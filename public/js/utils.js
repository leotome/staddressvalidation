function onLoad(){
    this.setAPIURIs();
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

function setAPIURIs(){
    var URI = this.getAPIURI('search') + '/{A}/{B}';
    var how_apiurl = document.getElementById('how_apiurl');
    how_apiurl.innerHTML = URI;
    var how_apiurl_example = document.getElementById('how_apiurl_example');
    how_apiurl_example.innerHTML = URI.replace('{A}', 'PT').replace('{B}', '1169-023');
    this.queryServer(URI.replace('{A}', 'PT').replace('{B}', '1169-023'))
    .then(response => {
        var how_apiurl_example_response = document.getElementById('how_apiurl_example_response');
        how_apiurl_example_response.textContent = JSON.stringify(response);
    });
}

function checkSession(){
    var localToken = localStorage.getItem("staddress_token");
    if(localToken == null){
        var nav_logout = document.getElementById('nav_logout');
        var nav_account = document.getElementById('nav_account');
        nav_logout.remove();
        nav_account.remove();
    } else {
        var nav_login = document.getElementById('nav_login');
        var nav_register = document.getElementById('nav_register');
        nav_login.remove();
        nav_register.remove();
    }
}

async function queryServer(request_uri, headers){
    let response = await fetch(request_uri, headers);
    let data = await response.json();
    return data;
}
