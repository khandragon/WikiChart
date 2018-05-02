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
if (!document.addEventListener) {
    createDummyElements();
}
function removeSaved() {
   console.log("removing"); 
    var data = U.$("mySaved");
    data.innerHTML = '';    
}
function checkmarkGen(title,isChecked) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = title;
    checkbox.id = title;
    checkbox.checked=isChecked;
    return checkbox;
}
function selectedTop() {
    invisbleAll();
    removeSaved();
    U.$("topContent").style.display = "block";
    U.$("topContent").style.backgroundcolor = "grey";

}
function populateSave(link,title,imgSrc,extract) {
    var results = U.$("mySaved");
    var resultnode = document.createElement("div");
    var titleContainer = document.createElement("p");
    var anchor = document.createElement("a");
    var viewContainer = document.createElement("p");
    var titlenode = document.createTextNode(title);
    anchor.setAttribute("href",link);
    anchor.appendChild(titlenode);
    titleContainer.appendChild(anchor);
    resultnode.appendChild(titleContainer);
    resultnode.appendChild(viewContainer);
    resultnode.id = title.replace(/ /g,"_");
    resultnode.appendChild(checkmarkGen(resultnode.id,true));
    results.appendChild(resultnode);
    var text = document.createElement("p");
    var imgContainer = document.createElement("div");
    var summarynode = document.createTextNode(extract);
    if (imgSrc!== null) {
        var img = document.createElement("img");
        img.src = imgSrc;
        imgContainer.appendChild(img);
        text.appendChild(imgContainer);
    }
    text.appendChild(summarynode);
    results.appendChild(text);
}
function selectedSaved() {
    invisbleAll();
    removeSaved();
    U.$("savedContent").style.display = "block";
    var parser;
    var xmlDoc;
    var text = JSON.parse(localStorage.getItem("savedList"));

    for (var i = 0; i < text.length; i++) {
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(text[i], "text/html");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(text[i]);
        }
        var link = xmlDoc.getElementsByTagName("a")[0].href;
        var title = xmlDoc.getElementsByTagName("a")[0].innerText;
        var img = xmlDoc.getElementsByTagName("img")[0].src;
        var extract = xmlDoc.getElementsByTagName("div")[0].nextSibling.textContent;
        populateSave(link,title,img,extract)
    }
}
function notRepeat(data,resultHTML) {
    var isRepeat
    for (let i = 0; i < data.length; i++) {
        if (data[i] === resultHTML)
        return false
    }
    return true;
}
function savedData() {
    console.log("saving");
    var results = U.$("results");
    var data = JSON.parse(localStorage.getItem("savedList"));
    console.log(data);
    
    for (var i = 0; i < results.childNodes.length; i++) {
        if (results.childNodes[i].childNodes[2].checked && notRepeat(data, results.childNodes[i].innerHTML)) {
            data.push(results.childNodes[i].innerHTML);
        }
    }
    localStorage.setItem("savedList", JSON.stringify(data));
}
function selectedChart() {
    invisbleAll();
    removeSaved();
    U.$("chartContent").style.display = "block";
}
function invisbleAll() {
    var allContent = document.getElementsByTagName("section");
    for (var i = 0; i < allContent.length; i++) {
        allContent[i].style.display = "none";
    }
}
function removeData() {
    var data = U.$("mySaved");
    data.innerHTML = '';
}
function processTitles(responseText) {
    var pageInfo = JSON.parse(responseText);
    var result = document.createElement("p");
    var imgContainer = document.createElement("div");
    var summarynode = document.createTextNode(pageInfo.extract);
    var target = U.$(pageInfo.titles.canonical);
    if (pageInfo.thumbnail !== undefined) {
        var img = document.createElement("img");
        img.src = pageInfo.thumbnail.source;
        imgContainer.appendChild(img);
        result.appendChild(imgContainer);
    }
    result.appendChild(summarynode);
    target.appendChild(result);
}
function readTitle(url) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Api-User-Agent", "saaadkhan23@yahoo.ca");
    U.addHandler(r, "load", function () {
        if (r.readyState === 4) {
            processTitles(r.responseText);
        }
    });
    r.send(null);
}
function getExtractPictures(titles) {
    var language = U.$("langSelect").value;
    for (var i = 0; i < titles.length; i++) {
        readTitle("https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + titles[i]);
    }
}
function populateIndex(titles, numViews) {
    var results = U.$("results");
    var language = U.$("langSelect").value;
    for (var i = 0; i < titles.length; i++) {
        var resultnode = document.createElement("div");
        var titleContainer = document.createElement("p");
        var anchor = document.createElement("a");
        var viewContainer = document.createElement("p");
        var titlenode = document.createTextNode((i + 1) + ": " + titles[i].replace(/_/g, " "));
        anchor.setAttribute("href", "https://" + language + ".wikipedia.org/wiki/" + titles[i]);
        var viewnode = document.createTextNode("  Number of Views: " + numViews[i]);
        anchor.appendChild(titlenode);
        titleContainer.appendChild(anchor);
        viewContainer.appendChild(viewnode);
        resultnode.appendChild(titleContainer);
        resultnode.appendChild(viewContainer);
        resultnode.id = titles[i];
        resultnode.appendChild(checkmarkGen(titles[i],false));
        results.appendChild(resultnode);
    }
    console.log("done");
}
function dateIsValid(testDate) {
    var date_regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/;
    if ((!date_regex.test(testDate)) || g.currentDate <= new Date(testDate) || g.minDate < 0) {
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
        if (
            text.items[0].articles[i].article.indexOf("Main_Page") === -1 &&
            text.items[0].articles[i].article.indexOf("Accueil_principal") === -1 &&
            text.items[0].articles[i].article.indexOf(".php") === -1 &&
            text.items[0].articles[i].article.indexOf("Special") === -1 &&
            text.items[0].articles[i].article.indexOf("Spécial") === -1 &&
            text.items[0].articles[i].article.indexOf("Sp?cial") === -1) {
            topViewed[i] = text.items[0].articles[i].article;
            numViews[i] = text.items[0].articles[i].views;
        }
        else {
            numArt++;
        }
    }
    topViewed = topViewed.filter(String);
    numViews = numViews.filter(String);
    populateIndex(topViewed, numViews);
    getExtractPictures(topViewed);
}
function readFile(url, numArt) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Api-User-Agent", "saaadkhan23@yahoo.ca");
    U.addHandler(r, "load", function () {
        if (r.readyState === 4) {
            processText(r.responseText);
        }
    });
    r.send(null);
}
function defaultSearch() {
    console.log("default search");
    var date = dateToString(g.yesturday);
    if (dateIsValid(date)) {
        U.$("date").value = date;
        var language = U.$("langSelect").value;
        readFile("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" + language + ".wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2], numArt);
    }
}
function pad(number) {
    var r = String(number);
    if (r.length === 1) {
        r = '0' + r;
    }
    return r;
}
function dateToString(date) {
    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate());
}
function defaultStore() {
    var data = [];
    localStorage.setItem("savedList", JSON.stringify(data));
}
function noScrollJumping() {

}
function main() {
    console.log("start");
    var currentDate = new Date();
    g.yesturday = new Date(currentDate.setDate(currentDate.getDate() - 1));
    g.minDate = new Date();
    defaultStore();
    defaultSearch();
    noScrollJumping();
    invisbleAll();
    selectedTop();
    U.addHandler(U.$("topArt"), "click", selectedTop);
    U.addHandler(U.$("savedArt"), "click", selectedSaved);
    U.addHandler(U.$("chartArt"), "click", selectedChart);
    U.addHandler(U.$("submitBtn"), "click", submitData);
    U.addHandler(U.$("saveBtn"), "click", savedData);
}
U.ready(main);