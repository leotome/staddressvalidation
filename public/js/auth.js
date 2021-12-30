function registerUser(){
    let email = document.getElementById("register_email").value;
    let password = document.getElementById("register_password").value;
    if(email.length == 0 && password.length == 0){
        alert("You need to insert an email and password. Please review.");
        return;
    } else if (email.length == 0) {
        alert("You need to insert an email. Please review.");
        return;
    } else if (password.length == 0) {
        alert("You need to insert an password. Please review.");
        return;
    }
    let user = {
        email : email,
        password : password
    }
    let server_url = this.getAPIURI('auth/register');
    let params = {
        headers: {
            "Content-Type": "application/json",
        },
        method : "POST",
        body : JSON.stringify(user)
    }
    fetch(server_url, params)
    .then(async (response) => {
        var result = await response.json();
        let register_servermsg = document.getElementById("register_servermsg");
        register_servermsg.innerHTML = result.message + '. In order to continue, please close this popup, then click "Login".';
        //localStorage.setItem("staddress_token", result.user.password);
    })
    .catch((error) => {
        alert('Oops... An unexpected error ocurred.');
    })
}

function loginUser(){
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;
    if(email.length == 0 && password.length == 0){
        alert("You need to insert an email and password. Please review.");
        return;
    } else if (email.length == 0) {
        alert("You need to insert an email. Please review.");
        return;
    } else if (password.length == 0) {
        alert("You need to insert an password. Please review.");
        return;
    }
    let user = {
        email : email,
        password : password
    }
    let server_url = this.getAPIURI('auth/login');
    let params = {
        headers: {
            "Content-Type": "application/json",
        },
        method : "POST",
        body : JSON.stringify(user)
    }
    fetch(server_url, params)
    .then(async (response) => {
        var result = await response.json();
        // This piece was not being handled in the previous version
        // That's a "hot fix", it's not done properly. Must be fixed soon.
        if(result.msg){
            let login_servermsg = document.getElementById("login_servermsg");
            login_servermsg.innerHTML = result.msg;
        } else if(result.message){
            let login_servermsg = document.getElementById("login_servermsg");
            login_servermsg.innerHTML = result.message;
        } else {
            const token = result.accessToken;
            localStorage.setItem("staddress_token", token);          
    
            var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
            var currentProtocol = window.location.protocol;
            var currentHost = window.location.hostname;
            var URI = currentProtocol + '//' + currentHost + currentPort;
            window.open(URI + '/account', "_self");
        }
    })
    .catch(async (error) => {
        alert(JSON.stringify(error));
    })
}

function logoutUser(){
    localStorage.removeItem("staddress_token");
    var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var URI = currentProtocol + '//' + currentHost + currentPort;
    window.open(URI, "_self");
}

function getAPIURI(route){
    var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var URI = currentProtocol + '//' + currentHost + currentPort + '/api/' + route;
    return URI;
}