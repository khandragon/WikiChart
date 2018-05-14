"use strict";
function removeDisplay() {
    U.$("visitPopUp").style.display="none"
}
function displayVisits() {
    U.$("visitPopUp").style.display="block"
}


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
        console.log(cookies[1]);
        if(cookies[1] >= 10){
                displayVisits();
                setTimeout(function () {
                    removeDisplay();
                },10000);
        }
   }
}