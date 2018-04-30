"use strict";
var g = {};
/**
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
function selectedTop() {
    invisbleAll();
    console.log("top");
    U.$("topContent").style.display = "block";
    U.$("topContent").style.backgroundcolor = "grey";

}
function selectedSaved() {
    console.log("saved");
    invisbleAll();
    U.$("savedContent").style.display = "block";
}
function selectedChart() {
    console.log("chart");
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
function removeData() {
    var data = U.$("results");
    data.innerHTML='';
}
function populateIndex(titles, numViews) {
    var results = U.$("results");
    for (let i = 0; i < titles.length; i++) {

        var resultnode = document.createElement("p");
        var titlenode = document.createTextNode((i+1)+": "+titles[i]);
        var viewnode = document.createTextNode("    Number of Views: "+numViews[i])
        resultnode.appendChild(titlenode);
        resultnode.appendChild(viewnode);
        results.appendChild(resultnode);
    }

}
function dateIsValid(testDate) {
    var date_regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/;
    if ((!date_regex.test(testDate)) || g.currentDate <= new Date(testDate)) {
        return false;
    }
    else
        return true;
}
function submitData() {
    removeData();
    var date = U.$("date").value;
    if (dateIsValid(date)) {
        U.$("date").style.color = "black";
        var numArt = U.$("numArt");
        var language = U.$("langSelect").value;
        readFile("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" + language + ".wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2], numArt);
    }
    else {
        console.log("change to red");

        U.$("date").style.color = "red";
    }
}
function processText(responseText) {
    var text = JSON.parse(responseText);
    var numArt = U.$("numArt").value;
    var topViewed = [];
    var numViews = [];
    for (var i = 0; i < numArt; i++) {
        if (text.items[0].articles[i].article !== "Main_Page" && text.items[0].articles[i].article.indexOf("Special") === -1) {
            topViewed[i] = text.items[0].articles[i].article;
            numViews[i] = text.items[0].articles[i].views;
        }
        else {
            numArt++;
        }
    }
    topViewed = topViewed.filter(String);
    numViews = numViews.filter(String);
    populateIndex(topViewed, numViews)
    console.log(topViewed);
    console.log(numViews);
}
function readFile(url, numArt) {
    console.log(url);
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Api-User-Agent", "saaadkhan23@yahoo.ca");
    console.log("set the request header");
    U.addHandler(r, "load",
    /*r.onreadystatechange*/  function () {
            if (r.readyState === 4) {
                processText(r.responseText);
            }
        });
    r.send(null);
}
function defaultSearch() {
    console.log("default search");
    if (dateIsValid(g.yesturday)) {
        var date = dateToString(g.yesturday);
        U.$("date").value = date;
        var language = U.$("langSelect").value;
        readFile("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" + language + ".wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2], numArt);
    }
}
function dateToString(date) {
    return new Date(date).toISOString().slice(0, 10);
}
function main() {
    console.log("start");
    var currentDate = new Date();
    g.yesturday = dateToString(new Date(currentDate.setDate(currentDate.getDate() - 2)));
    defaultSearch();
    //noScrollJumping();
    invisbleAll();
    selectedTop();
    U.addHandler(U.$("topArt"), "click", selectedTop);
    U.addHandler(U.$("savedArt"), "click", selectedSaved);
    U.addHandler(U.$("chartArt"), "click", selectedChart);
    U.addHandler(U.$("submitBtn"), "click", submitData);
}
U.ready(main);