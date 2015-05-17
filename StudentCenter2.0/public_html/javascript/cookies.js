function getCookie(cookieName){
    //Gets the value of the cookie.
    var value = "; " + document.cookie;
    
    //Splits based on the value name.
    var parts = value.split("; " + cookieName + "=");
    if (parts.length === 2) 
        return parts.pop().split(";").shift();
}


