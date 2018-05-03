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
    var data = U.$("mySaved");
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
}
function removefromsaved() {
    var data = JSON.parse(localStorage.getItem("savedList"));
    for (var i = 0; i < data.length; i++) {

    }
    localStorage.setItem("savedList", JSON.stringify(data));
}
function checkmarkGen(title, isChecked) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = title;
    checkbox.id = title;
    checkbox.checked = isChecked;
    U.addHandler(checkbox, "click", removefromsaved)
    return checkbox;
}
function selectedTop() {
    invisbleAll();
    removeSaved();
    U.$("topContent").style.display = "block";
    U.$("topContent").style.backgroundcolor = "grey";

}
function parseText(text) {
    for (var i = 0; i < text.length; i++) {
        var parser;
        var xmlDoc;
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
        var img = null;
        var extract = xmlDoc.getElementsByTagName("p")[3].innerText;
        if (xmlDoc.getElementsByTagName("img")[0] !== undefined) {
            img = xmlDoc.getElementsByTagName("img")[0].src;
        }
        populateSave(link, title, img, extract);
    }
}
function populateSave(link, title, imgSrc, extract) {
    var results = U.$("mySaved");
    var resultnode = document.createElement("div");
    var titleContainer = document.createElement("p");
    var anchor = document.createElement("a");
    var viewContainer = document.createElement("p");
    var titlenode = document.createTextNode(title);
    var text = document.createElement("p");
    var imgContainer = document.createElement("div");
    var summarynode = document.createTextNode(extract);
    anchor.setAttribute("href", link);
    anchor.appendChild(titlenode);
    titleContainer.appendChild(anchor);
    resultnode.appendChild(titleContainer);
    resultnode.appendChild(viewContainer);
    resultnode.id = title.replace(/ /g, "_");
    resultnode.appendChild(checkmarkGen(resultnode.id, true));
    results.appendChild(resultnode);
    if (imgSrc !== null) {
        var img = document.createElement("img");
        img.src = imgSrc;
        imgContainer.appendChild(img);
        text.appendChild(imgContainer);
    }
    text.appendChild(summarynode);
    text.id = "extract";
    results.appendChild(text);


}
function selectedSaved() {
    invisbleAll();
    removeSaved();
    U.$("savedContent").style.display = "block";
    var text = JSON.parse(localStorage.getItem("savedList"));
    parseText(text);
}
function notRepeat(data, resultHTML) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].split("</p>")[0] === resultHTML.split("</p>")[0])
            return false
    }
    return true;
}
function savedData() {
    var results = U.$("results");
    var data = JSON.parse(localStorage.getItem("savedList"));
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
    var data = U.$("results");
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
}
function processTitles(responseText) {
    var pageInfo = JSON.parse(responseText);
    var result = document.createElement("p");
    var imgContainer = document.createElement("div");
    var text = document.createElement("p")
    var summarynode = document.createTextNode(pageInfo.extract);
    var target = U.$(pageInfo.titles.canonical);
    if (pageInfo.thumbnail !== undefined) {
        var img = document.createElement("img");
        img.src = pageInfo.thumbnail.source;
        imgContainer.appendChild(img);
        result.appendChild(imgContainer);
    }
    text.appendChild(summarynode)
    result.appendChild(text);
    target.appendChild(result);
}
function readTitle(url) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Api-User-Agent", "saaadkhan23@yahoo.ca");
    U.addHandler(r, "load", function () {
        if (r.readyState === 4) {
            processTitles(r.responseText,url);
        }
    });
    r.send(null);
}
function getExtractPictures(titles) {
    var language = U.$("langSelect").value;
    for (var i = 0; i < titles.length; i++) {
        readTitle("https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + titles[i]);
    }

   /* var results = U.$("results");
    var date = U.$("date").value;
    var x = (results.childNodes[0]);
    console.log("results.childNodes[0].innerHTML.length --->")
    console.log(x);
    

    var resultsArray = [];
    for (var i = 0; i < results.childNodes.length; i++) {
        console.log(U.$("results").childNodes[0].innerHTML);
    }

    /*var expire = new Date();
    expire.setDate(expire.getDate() + 1);
    var dateInUTCFormat = expire.toUTCString();
    console.log("making cookies");
    document.cookie = date + "=" + encodeURIComponent(resultsArray) + ";expires=" + dateInUTCFormat;
    */
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
        resultnode.appendChild(checkmarkGen(titles[i], false));
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
function checkcookies(submitDate) {
    var cookies = document.cookie.split(";");
    var listCookies = [];
    for (var i = 0; i < cookies.length; i++) {
        listCookies[i] = cookies[i].split("=");
        if (listCookies[i][0] !== submitDate) {
            return true;
        }
    }
    return false;
}
function retainFromCache(date) {
    var cookies = document.cookie.split(";");
    var listCookies = [];
    var myCookie;
    for (var i = 0; i < cookies.length; i++) {
        listCookies[i] = cookies[i].split("=");
        if (listCookies[i][0] !== date) {
            myCookie = decodeURIComponent(listCookies[i][1]);
        }
    }
    console.log(myCookie);
}
function submitData() {
    removeData();
    console.log("submitting");
    var date = U.$("date").value;
    if (dateIsValid(date)) {
        U.$("date").style.color = "black";
        var numArt = U.$("numArt");
        var language = U.$("langSelect").value;
        if (checkcookies(date)) {
            console.log("api");
            readFile("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" + language + ".wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2], numArt);
        }
        else {
            retainFromCache(date);
        }
    }
    else {
        U.$("date").style.borderColor = "red";
    }
}
function processText(responseText,url) {
    var text = JSON.parse(responseText);
    var numArt = U.$("numArt").value;
    var topViewed = [];
    var numViews = [];
    for (var i = 0; i < numArt; i++) {
        if (
            text.items[0].articles[i].article.indexOf("Main_Page") === -1 &&
            text.items[0].articles[i].article.indexOf("Accueil_principal") === -1 &&
            text.items[0].articles[i].article.indexOf(".") === -1 &&
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
    console.log(topViewed);
    
   // localStorage.setItem()
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
        submitData();
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