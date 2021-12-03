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
				res.sendStatus(400);
				return res.send({
					status : 400, 
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
				res.sendStatus(400);
				return res.send({
					status : 400, 
					message : 'Incorrect string format for BR. Please ensure that you\'re using the format XXXXX-XXX.'
				});
			}
			break;				
		default:
			res.sendStatus(500);
			return res.send({
				status : 500, 
				message : 'Unsupported country'
			});
			break;
	}
}

function getBR(PostalCode, res){
	const SplitPostalCode = PostalCode.split('-');
	const ConvertString = SplitPostalCode[0] + SplitPostalCode[1];
	axios.get(`https://viacep.com.br/ws/${ConvertString}/json/`)
	.then((response) => {
		const json = response.data
		var result = {};
		if(json.erro === undefined){
			result['street'] = json.logradouro;
			result['council'] = json.bairro;
			result['city'] = json.localidade;
			result['state'] = json.uf;
			result['postalcode'] = json.cep;
			result['country'] = 'BR';
		} else {
			res.sendStatus(404);
			result = {
				status : 404, 
				message : 'Not found.'
			}
		}
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
		const errorResult = $('div.alert-message', html).contents()[0];
		var notfound = (firstResult === undefined && errorResult !== undefined);
		var badserver = (firstResult === undefined && errorResult === undefined);
		var result = {}
		if(notfound == false){
			var childNodes = firstResult.childNodes;
			for(i of childNodes){
				var name = i.name;
				if(name == 'span'){
					var children = i.children;
					for(j of children){
						if(j.attribs != undefined){
							if(j.attribs.class == 'search-title'){
								var street = j.children[0].data;
								result['street'] = street;
							}
							else if(j.attribs.class == 'local'){
								var other = j.children[0].data.split(',');
								var council = other[0];
								var city = other[1];
								var state = (other[2] === undefined) ? city : other[2];
								result['council'] = result.council === undefined ? council.trim() : result.council;
								result['city'] = result.city === undefined ? city.trim() : result.city;
								result['state'] = result.state === undefined ? state.trim() : result.state;
							}						
							else if(j.attribs.class == 'cp'){
								var postalcode = j.children[0].data;
								result['postalcode'] = postalcode;
								result['country'] = 'PT';
							}
						}
					}
				}
			}
		} else {
			if(badserver == true){
				res.sendStatus(503);
				result = {
					status : 503, 
					message : 'Service Unavailable.'
				}
			} else {
				res.sendStatus(404);
				result = {
					status : 404, 
					message : 'Not found.'
				}
			}
		}
		res.send(result);
		return result
	})
}