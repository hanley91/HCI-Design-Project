function authError(data){
    //Checks what type of error we have.
    errorMessage = "";
    
    //We automatically clear the textbox for password.
    $("#password").val("");
    
    //Checks what message to display.
    if (data === 'error') {
        errorMessage = 'A connection problem with Student Center has occurred.<br/>' +
                       'Please contact ITS at (519) 661-3800 for help with your account.<br/></br>';
    } else {
        errorMessage = 'Your username and password are not correct.<br/>' +
                       'Please try again.<br/><br/>';
    }          
    
    //Displays the message.
    $('div.error').html(errorMessage);
    
    //We want to shake the div.
    $( "#Login" ).effect( "shake" );
}

function authSuccess(data){
    //We create a login cookie.
    if (typeof data[0] === 'undefined') {
        authError("");
        return;
    }
    
    document.cookie = 'username=' + data[0]['UserName'] + '; path=/';
    document.cookie = 'name=' + data[0]['Fname'] + '; path=/';
    
    //Check the auth cookie.
    auth = getCookie('auth');
    if (typeof auth === 'undefined')
        auth = 'LaunchPage.html';
    
    //We now redirect the page.
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.replace(auth);
}

function results(data){
    if (data === 'error' || data === null || data === ""){
        authError(data);
    } else {
        authSuccess(data);
    }
}

function verifyUser(){
    //Gets the username and password.
    userName = $("#username").val();
    password = $("#password").val();
    
    //Check for empty.
    if (userName === "" || password === "") {
        authError();
        return;
    }
    
    //Disables all the buttons.
    $("#login_form").children('input[type=submit]').prop('disabled', true);
        
    //Runs HTML query.
    sql = "SELECT UserName, Fname FROM User WHERE UserName = \"" + userName + "\" AND Password = \"" 
            + password + "\";";
    result = runSQL(sql, results);
    
    //Prevent the page from reloading.
    return false;
}

function notLoggedIn(){
    path = getCookie('auth');
    status = getCookie('logout');
    
    if (window.path){
        errorMessage = 'You are not logged in!<br/>' +
                       'Please log in below to continue.<br/></br>';
               
        //Displays the message.
        $('div.error').html(errorMessage);
    } else if (status === '1'){
        errorMessage = 'You have successfully logged out!<br/>' +
                       'Thank-you for using Student Center.<br><br>';
               
        //Displays the message.
        $('div.error').html(errorMessage);
        $('div.error').css('color', 'white');
        
        document.cookie = 'logout=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } 
}
function isLoggedIn(pageURL){
    //We need to check if the username cookie exists.
    uname = getCookie('username');

    //If it doesn't exist.
    if (uname === null || uname === "" || typeof uname === 'undefined'){
        //We need to create an error cookie and redirect.
        document.cookie = 'auth=' + pageURL + '; path=/;';
        window.location.replace('http://cs4474.muscedere.ca/index.html');
    }
}
function isAlreadyIn(){
    //We check for a uname cookie.
    uname = getCookie('username');
    
    //Check if it exists.
    if (uname !== null && uname !== "" && typeof uname !== 'undefined'){
        //We go to the main page.
        window.location.replace('http://cs4474.muscedere.ca/LaunchPage.html');
    }
}
function logout(){
    //We replace the cookie with ""
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'logout=1; path=/;';
    
    window.location.replace('http://cs4474.muscedere.ca/index.html');
}