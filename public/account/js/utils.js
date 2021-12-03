function onLoad(){
    this.setFooter();
    this.checkSession();
}

function getCurrentYear(){
    var TodayDate = new Date();
    var CurrentYear = TodayDate.getFullYear();
    return CurrentYear;
}

function setFooter(){
    var element = document.getElementById('copyright_footer');
    element.innerHTML = 'Copyright &copy; ' + this.getCurrentYear() + ' Leonardo Oliveira';
}

function getAPIURI(route){
    var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var URI = currentProtocol + '//' + currentHost + currentPort + '/api/' + route;
    return URI;
}

function checkSession(){
    var localToken = localStorage.getItem("staddress_token")
    if(localToken == null){
        var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
        var currentProtocol = window.location.protocol;
        var currentHost = window.location.hostname;
        var URI = currentProtocol + '//' + currentHost + currentPort;
        window.open(URI, "_self");
    } else {
      this.getUser();
    }
}

function searchAddress(){
    var test_form_country = document.getElementById('test_form_country').value;
    var test_form_postal_code = document.getElementById('test_form_postal_code').value;

    if(test_form_country.length == 0 && test_form_postal_code.length == 0){
        alert("You need to select a country and insert a postal code. Please review.");
        return;
    } else if (test_form_country.length == 0) {
        alert("You need to select a country. Please review.");
        return;
    } else if (test_form_postal_code.length == 0) {
        alert("You need to insert a postal code. Please review.");
        return;
    }

    const token = localStorage.getItem("staddress_token");
    const params = {
        method: "GET",
        headers: {
            Authorization : `Bearer ${token}`
        }
    };

    const url = this.getAPIURI('search') + '/' + test_form_country + '/' + test_form_postal_code;
    const request = new Request(url, params);

    fetch(request)
    .then(async (response) => {
        var res = await response.json();
        var ok = await response.ok;
        if(ok){
            var street_field = `<label class="form-label" for="test_form_result_street">Street</label><input type="text" class="form-control" id="test_form_result_street" disabled value="${res.street}">`;
            var city_field = `<label class="form-label" for="test_form_result_city">City</label><input type="text" class="form-control" id="test_form_result_city" disabled value="${res.city}">`;
            var state_field = `<label class="form-label" for="test_form_result_state">State</label><input type="text" class="form-control" id="test_form_result_state" disabled value="${res.state}">`;
            var postalcode_field = `<label class="form-label" for="test_form_result_postal_code">Postal Code</label><input type="text" class="form-control" id="test_form_result_postal_code" disabled value="${res.postalcode}">`;
            var country_field = `<label class="form-label" for="test_form_result_country">Country</label><input type="text" class="form-control" id="test_form_result_country" disabled value="${res.country}">`;

            var fields_html = '<div class="col-md-6 col-lg-4 mb-5">' + street_field + city_field + state_field + postalcode_field + country_field + '</div>';

            var google_maps_query_string = (res.street + ' ' + res.city + ' ' + res.state + ' ' + res.postalcode + ' ' + res.country).replace(' ', '%20');
            var google_maps_embed_map = `<div class="mapouter"><div class="gmap_canvas"><iframe id="gmap_canvas" src="https://maps.google.com/maps?q=${google_maps_query_string}&t=&z=11&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div></div>`;
            
            var google_maps_embed_map_html = '<div class="col-md-6 col-lg-4 mb-5">' + google_maps_embed_map + '</div>';

            var test_form_server_response_display = document.getElementById('test_form_server_response_display');
            
            test_form_server_response_display.innerHTML = fields_html + google_maps_embed_map_html;

        } else {
            var bootstrap_alert = `<div class="alert alert-danger" role="alert">${res.message}</div>`;
            var test_form_server_response_display = document.getElementById('test_form_server_response_display');
            test_form_server_response_display.innerHTML = bootstrap_alert;
        }
    })
    .catch(async (error) => {
        console.log(error)
    })
}