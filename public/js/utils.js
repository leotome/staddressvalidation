function onLoad(){
    this.setAPIURIs();
    this.setFooter();
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

function getAPIURI(){
    var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var URI = currentProtocol + '//' + currentHost + currentPort + '/api/search/{A}/{B}'
    return URI;
}

function setAPIURIs(){
    var URI = this.getAPIURI();
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

async function queryServer(URI_Request){
    let response = await fetch(URI_Request);
    let data = await response.json();
    return data;
}