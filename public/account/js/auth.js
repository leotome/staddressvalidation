function logoutUser(){
    localStorage.removeItem("staddress_token");
    var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var URI = currentProtocol + '//' + currentHost + currentPort;
    window.open(URI, "_self");
}

function getUser(){
    const token = localStorage.getItem("staddress_token");
    const params = {
        method: "POST",
        headers: {
            Authorization : `Bearer ${token}`
        }
      };
      const url = this.getAPIURI('auth/token');
      const request = new Request(url, params);
      fetch(request)
      .then(async (response) => {
          var res = await response.json();
          let auth_token_welcome = document.getElementById("auth_token_welcome");
          auth_token_welcome.innerHTML = 'Welcome, ' + res._id;

          let auth_token_display = document.getElementById("auth_token_display");
          auth_token_display.innerHTML = res.token;

      })
      .catch(async (error) => {
        alert(JSON.stringify(error));
      })
}
