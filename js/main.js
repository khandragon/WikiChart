"use strict";

/**var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
 * createDummyElements - creates sematic elements which are not supported by IE8
 *
 */
function createDummyElements() {
    var semanticElements = [
        "article", "aside", "details", "figcaption", "figure",
        "footer", "header", "hgroup", "menu", "nav", "section"
    ];
    for (var i = 0; i < semanticElements.length; i++) {
        document.createElement(semanticElements[i]);
    }
}

function main() {
    console.log("start");
    invisbleAll();
    selectedTop();
    U.addHandler(U.$("topArt"), "click", selectedTop);
    U.addHandler(U.$("savedArt"), "click", selectedSaved);
    U.addHandler(U.$("chartArt"), "click", selectedChart);
    U.addHandler(U.$("submitBtn"),"click", submitData);
}
function selectedTop() {
    invisbleAll();
    U.$("topContent").style.display = "block";
    U.$("topContent").style.backgroundcolor = "grey";

}
function selectedSaved() {
    invisbleAll();
    U.$("savedContent").style.display = "block";
}
function selectedChart() {
    invisbleAll();
    U.$("chartContent").style.display = "block";
}
function invisbleAll() {
    var allContent = document.getElementsByTagName("section");
    for (var i = 0; i < allContent.length; i++) {
        allContent[i].style.display = "none";
    }
}

if (!document.addEventListener) {
    createDummyElements();
}

function dateIsValid(testDate) {
    var date_regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/ ;
    if(!(date_regex.test(testDate))){
        return false;
    }
    else
        return true;
}

function submitData() {
 var date = U.$("date").value;
 console.log(dateIsValid(date));  
 console.log(date);
  
}
U.ready(main);