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
    var URI = this.getAPIURI('search') + '/{A}/{B}';
    var localToken = localStorage.getItem("staddress_token")
    if(localToken == null){
        var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
        var currentProtocol = window.location.protocol;
        var currentHost = window.location.hostname;
        var URI = currentProtocol + '//' + currentHost + currentPort;
        window.open(URI, "_self");
    } else {
      //TODO FINISH LOADING  
    }
}

function searchAddress(){
    console.log('search!')
}