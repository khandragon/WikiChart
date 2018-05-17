"use strict";

/**
 * remove pop up about user views
 * 
 */
function removeDisplay() {
    U.$("visitPopUp").style.display="none"
}

/**
 * display pop up of user views
 * 
 */
function displayVisits() {
    U.$("visitPopUp").style.display="block"
}

/**
 * add or set the number of views in cookie
 * then if equal to 10 or greater display msg for 10 sec
 * 
 */
function cookiePlus() {
    var week = new Date();
    week.setDate(week.getDate()+7);
    var weekExpiry = week.toUTCString();
   if(document.cookie == ""){
    document.cookie="views=0;expires="+weekExpiry;
   }else{
        var cookies = document.cookie.split(";")[0].split("=");
        cookies[1]=(parseInt(cookies[1])+1);
        document.cookie=cookies[0]+"="+cookies[1]+";expires="+weekExpiry;
        if(cookies[1] >= 10){
                displayVisits();
                setTimeout(function () {
                    removeDisplay();
                },10000);
        }
   }
}