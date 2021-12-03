const axios = require("axios");
const cheerio = require("cheerio");

const auth_controller = require('../controllers/auth.js');

const demo_allowed = [
	{ id : 'PT_1169-023', country : 'PT', postalcode : '1169-023'},
	{ id : 'BR_40110-909', country : 'BR', postalcode : '40110-909'},
]

exports.search = (req, res) => {
	var RequestCountry = req.params.country.toUpperCase();
	var RequestPostalCode = req.params.postalcode;
	var IsAuthenticated = auth_controller.authenticateToken(req, res);
	if( IsAuthenticated == true || ( IsAuthenticated == false && demo_allowed.find(({id}) => id == RequestCountry + '_' + RequestPostalCode) !== undefined ) ){
		switch (RequestCountry) {
			case 'PT':
				var regex = new RegExp('[0-9]{4}-[0-9]{3}');
				var format = regex.test(RequestPostalCode);
				var correctlength = RequestPostalCode.length == 8;
				if(format && correctlength){
					var result = getPT(RequestPostalCode, res);
				} else {
					return res.sendStatus(400).send({
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
					return res.sendStatus(400).send({
						status : 400,
						message : 'Incorrect string format for BR. Please ensure that you\'re using the format XXXXX-XXX.'
					});
				}
				break;
			default:
				return res.sendStatus(500).send({
					status : 500, 
					message : 'Unsupported country'
				});
				break;
		}
	} else {
		res.sendStatus(401);
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
			res.send(result);
		} else {
			result = {
				status : 404, 
				message : 'Not found.'
			}
			res.sendStatus(404).send(result);
		}
	})
	return result;
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
			res.send(result);
		} else {
			if(badserver == true){
				result = {
					status : 503, 
					message : 'Service Unavailable.'
				}
				res.sendStatus(503).send(result);
			} else {
				result = {
					status : 404, 
					message : 'Not found.'
				}
				res.sendStatus(404).send(result);
			}
		}
		return result
	})
}