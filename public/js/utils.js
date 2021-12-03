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
    var element = document.getElementById('footer');
    element.innerHTML = '&copy; ' + this.getCurrentYear() + ' Leonardo Oliveira';
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
    var section_howto_apiuri = document.getElementById('section_howto_apiuri');
    section_howto_apiuri.innerHTML = URI;

    var section_howto_apiuri_example = document.getElementById('section_howto_apiuri_example');
    section_howto_apiuri_example.innerHTML = URI.replace('{A}', 'PT').replace('{B}', '1169-023');
    this.queryServer(URI.replace('{A}', 'PT').replace('{B}', '1169-023'))
    .then(response => {
        var section_howto_apiuri_example_code = document.getElementById('section_howto_apiuri_example_code');
        section_howto_apiuri_example_code.textContent = JSON.stringify(response);
    });
}

async function queryServer(URI_Request){
    let response = await fetch(URI_Request);
    let data = await response.json();
    return data;
}