const axios = require("axios");
const cheerio = require("cheerio");

exports.search = (req, res) => {
	var RequestCountry = req.params.country.toUpperCase();
	var RequestPostalCode = req.params.postalcode;
	switch (RequestCountry) {
		case 'PT':
			var regex = new RegExp('[0-9]{4}-[0-9]{3}');
			var format = regex.test(RequestPostalCode);
			var correctlength = RequestPostalCode.length == 8;
			if(format && correctlength){
				var result = getPT(RequestPostalCode, res);
			} else {
				return res.send({
					status : 100, 
					message : 'Incorrect string format for PT. Please ensure that you\'re using the format XXXX-XXX.'
				});
			}
			break;
		case 'BR':
			var regex = new RegExp('[0-9]{5}-[0-9]{3}');
			var format = regex.test(RequestPostalCode);
			var correctlength = RequestPostalCode.length == 9;
			if(format && correctlength){
				var result = getBR(RequestPostalCode, res);
			} else {
				return res.send({
					status : 100, 
					message : 'Incorrect string format for BR. Please ensure that you\'re using the format XXXXX-XXX.'
				});
			}
			break;				
		default:
			return res.send({
				status : -1, 
				message : 'Unsupported country'
			});
			break;
	}
}

function getBR(PostalCode, res){
	const SplitPostalCode = PostalCode.split('-');
	const NormPostalCoide = SplitPostalCode[0] + SplitPostalCode[1];
	axios.get(`https://viacep.com.br/ws/${NormPostalCoide}/json/`)
	.then((response) => {
		const json = response.data
		var result = {}
		result['street'] = json.logadouro
		result['council'] = json.bairro
		result['city'] = json.localidade
		result['state'] = json.uf
		result['postalcode'] = json.cep
		result['country'] = 'BR'
		res.send(result);
	})
	return {}
}

function getPT(PostalCode, res){
	const SplitPostalCode = PostalCode.split('-');
	axios.get(`https://www.codigo-postal.pt/?cp4=${SplitPostalCode[0]}&cp3=${SplitPostalCode[1]}`)
	.then((response) => {
		const html = response.data;
		const $ = cheerio.load(html);
		const firstResult = $('div.places', html).contents()[0];
		var childNodes = firstResult.childNodes;
		var result = {}
		for(i of childNodes){
			var name = i.name;
			if(name == 'span'){
				var children = i.children;
				for(j of children){
					if(j.attribs != undefined){
						if(j.attribs.class == 'search-title'){
							var street = j.children[0].data
							result['street'] = street
						}
						else if(j.attribs.class == 'local'){
							var other = j.children[0].data.split(',')
							var council = other[0]
							var city = other[1]
							var state = other[2]
							result['council'] = council.trim()
							result['city'] = city.trim()
							result['state'] = state.trim()
						}						
						else if(j.attribs.class == 'cp'){
							var postalcode = j.children[0].data
							result['postalcode'] = postalcode
							result['country'] = 'PT'
						}
					}
				}
			}
		}
		res.send(result);
		return result
	})
}