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
    var results = U.$("mySaved");
    console.log(results.childNodes);
    for (var i = 0; i < results.childNodes.length; i++) {
        if (!results.childNodes[i].childNodes[2].checked) {
            results.removeChild(results.childNodes[i]);
        }
    }
    var data = []
    for (var i = 0; i < results.childNodes.length; i++) {
        data[i] = localStorage.getItem(results.childNodes[i].id);
    }
    localStorage.setItem("savedList", (data));
}
function checkmarkGen(title, isChecked) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = title;
    checkbox.id = title;
    checkbox.checked = isChecked;
    if (isChecked === true) {
        U.addHandler(checkbox, "click", removefromsaved)
    }
    return checkbox;
}

function parseText(saveList) {
    for (var i = 0; i < saveList.length; i++) {
        var data = JSON.parse(localStorage.getItem(saveList[i]))
        populateSave(data.url, data.title, data.img, data.extract);
    }
}
function populateSave(link, title, imgSrc, extract) {
    var results = U.$("mySaved");
    var resultnode = document.createElement("div");
    var titleContainer = document.createElement("p");
    var anchor = document.createElement("a");
    var viewContainer = document.createElement("p");
    var titlenode = document.createTextNode(title.replace(/_/g, ""));
    var text = document.createElement("p");
    var imgContainer = document.createElement("div");
    var summarynode = document.createTextNode(extract);
    anchor.setAttribute("href", link);
    anchor.appendChild(titlenode);
    titleContainer.appendChild(anchor);
    resultnode.appendChild(titleContainer);
    resultnode.appendChild(viewContainer);
    resultnode.id = title;
    resultnode.appendChild(checkmarkGen(resultnode.id, true));
    if (imgSrc !== "null") {
        var img = document.createElement("img");
        img.src = imgSrc;
        img.height = "326";
        img.width = "220"
        imgContainer.appendChild(img);
        text.appendChild(imgContainer);
    }
    text.appendChild(summarynode);
    text.id = "extract";
    resultnode.appendChild(text);
    results.appendChild(resultnode);
}


function savedData() {
    var results = U.$("results");
    var data = JSON.parse(localStorage.getItem("savedList"));
    for (var i = 0; i < results.childNodes.length; i++) {
        if (results.childNodes[i].childNodes[2].checked) {
            console.log(data);
            if(!data.includes(results.childNodes[i].id)){
                data.push(JSON.parse(localStorage.getItem(results.children[i].id)).title);
            }
        }
    }
    localStorage.setItem("savedList", JSON.stringify(data));
}

function removeData() {
    var data = U.$("results");
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
}
function createCache(pageInfo) {
    var title = pageInfo.titles.canonical;
    var url = "https://" + pageInfo.lang + ".wikipedia.org/wiki/" + pageInfo.titles.canonical;
    var extract = pageInfo.extract;
    var imgSrc = null;
    if (pageInfo.thumbnail !== undefined) {
        imgSrc = pageInfo.thumbnail.source;
    }
    var numViews = JSON.parse(localStorage.getItem(title)).views;
    var cache = {
        "title": title,
        "url": url,
        "views": numViews,
        "img": imgSrc,
        "extract": extract,
    }
    localStorage.setItem(title, JSON.stringify(cache));
}
function addExtractPictures(title, extract, thumbnail) {
    var result = document.createElement("p");
    var imgContainer = document.createElement("div");
    var text = document.createElement("p")
    var summarynode = document.createTextNode(extract);
    var target = U.$(title);
    if (thumbnail) {
        var img = document.createElement("img");
        img.src = thumbnail;
        img.height = "326";
        img.width = "220"
        imgContainer.appendChild(img);
        result.appendChild(imgContainer);
    }
    text.appendChild(summarynode)
    result.appendChild(text);
    target.appendChild(result);
}
function processTitles(responseText) {
    var pageInfo = JSON.parse(responseText);
    console.log(pageInfo);
    createCache(pageInfo);
    if (!pageInfo.thumbnail) {
        pageInfo.thumbnail = "null";
        console.log(pageInfo);
    }
    if (U.$(pageInfo.titles.canonical) !== null) {
        addExtractPictures(pageInfo.titles.canonical, pageInfo.extract, pageInfo.thumbnail.source);
    }
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
function TitleInCache(title) {
    if (JSON.parse(localStorage.getItem(title)).extract === undefined) {
        return false;
    }
    return true;
}
function createFromCache(title) {
    var data = JSON.parse(localStorage.getItem(title));
    addExtractPictures(data.title, data.extract, data.img)
}

function getExtractPictures(titles, numArt) {
    var language = U.$("langSelect").value;
    for (var i = 0; i < numArt; i++) {
        var url = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + titles[i] + "?redirect=false";
        if (TitleInCache(titles[i])) {
            console.log("title in cache");
            createFromCache(titles[i]);
        } else {
            console.log("title not in cache");
            readTitle(url)
        }
    }
}

function populateIndex(title, numViews) {
    var results = U.$("results");
    var language = U.$("langSelect").value;
    var resultnode = document.createElement("div");
    var titleContainer = document.createElement("p");
    var anchor = document.createElement("a");
    var viewContainer = document.createElement("p");
    var titlenode = document.createTextNode(title.replace(/_/g, " "));
    anchor.setAttribute("href", "https://" + language + ".wikipedia.org/wiki/" + title);
    var viewnode = document.createTextNode("  Number of Views: " + numViews);
    anchor.appendChild(titlenode);
    titleContainer.appendChild(anchor);
    viewContainer.appendChild(viewnode);
    resultnode.appendChild(titleContainer);
    resultnode.appendChild(viewContainer);
    resultnode.id = title;
    resultnode.appendChild(checkmarkGen(title, false));
    results.appendChild(resultnode);
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
function retainFromCache(url, numArt) {
    var top = JSON.parse(localStorage.getItem(url));
    var language = U.$("langSelect").value;
    for (var i = 0; i < numArt; i++) {
        if (TitleInCache(top[i])) {
            var data = JSON.parse(localStorage.getItem(top[i]));
            populateIndex(data.title, data.views);
        } else {
            var url = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + top[i]+ "?redirect=false";
            readTitle(url);
            var data = JSON.parse(localStorage.getItem(top[i]));
        }
    }
    getExtractPictures(top, numArt);
}
function DateInCache(url) {
    if (localStorage.getItem(url) !== null) {
        return false;
    }
    return true;
}

function submitData() {
    removeData();
    console.log("submitting");
    var date = U.$("date").value;
    if (dateIsValid(date)) {
        U.$("date").style.borderColor = "black";
        var language = U.$("langSelect").value;
        var numArt = U.$("numArt").value;
        var url = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" + language + ".wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2]);
        if (DateInCache(url)) {
            console.log("--->from api");
            readFile(url);
        }
        else {
            console.log("--->from cache");
            retainFromCache(url, numArt);
        }
    }
    else {
        U.$("date").style.borderColor = "red";
    }
}
function processText(responseText, url) {
    var text = JSON.parse(responseText);
    var numArt = U.$("numArt").value;
    var twenty = 20;
    var topViewed = [];
    var numViews = [];
    for (var i = 0; i < twenty; i++) {
        if (
            text.items[0].articles[i].article.indexOf("Main_Page") === -1 &&
            text.items[0].articles[i].article.indexOf("Accueil_principal") === -1 &&
            text.items[0].articles[i].article.indexOf(".") === -1 &&
            text.items[0].articles[i].article.indexOf("Special") === -1 &&
            text.items[0].articles[i].article.indexOf("Spécial") === -1 &&
            text.items[0].articles[i].article.indexOf("Category") === -1 &&
            text.items[0].articles[i].article.indexOf("User") === -1 &&
            text.items[0].articles[i].article.indexOf("Dns_rebinding") === -1 &&
            text.items[0].articles[i].article.indexOf("DNS_rebinding") === -1 &&
            text.items[0].articles[i].article.indexOf("Sp?cial") === -1) {
            topViewed[i] = text.items[0].articles[i].article;
            numViews[i] = text.items[0].articles[i].views;
        }
        else {
            twenty++;
        }
    }
    topViewed = topViewed.filter(String);
    numViews = numViews.filter(String);
    for (var i = 0; i < topViewed.length; i++) {
        var data = {
            "views": numViews[i],
        };
        localStorage.setItem(topViewed[i], JSON.stringify(data));
    }
    localStorage.setItem(url, JSON.stringify(topViewed));
    for (let i = 0; i < numArt; i++) {
        populateIndex(topViewed[i], numViews[i], numArt);
    }
    getExtractPictures(topViewed, numArt);
}
function readFile(url) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Api-User-Agent", "saaadkhan23@yahoo.ca");
    U.addHandler(r, "load", function () {
        if (r.readyState === 4) {
            processText(r.responseText, url);
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
    U.$("topArt").href = "#!topContent";
    U.$("savedArt").href = "#!savedContent";
    U.$("chartArt").href = "#!hartContent";
}
function main() {
    var currentDate = new Date();
    g.yesturday = new Date(currentDate.setDate(currentDate.getDate() - 1));
    g.tommorrow = new Date(currentDate.setDate(currentDate.getDate() + 1));
    defaultStore();
    defaultSearch();
    noScrollJumping();
    invisbleAll();
    selectedTop();
    U.addHandler(U.$("topArt"), "click", selectedTop);
    U.addHandler(U.$("savedArt"), "click", selectedSaved);
    U.addHandler(U.$("chartArt"), "click", selectedChart);
    U.addHandler(U.$("resourceTab"), "click", selectAbout);
    U.addHandler(U.$("submitBtn"), "click", submitData);
    U.addHandler(U.$("saveBtn"), "click", savedData);
}
U.ready(main);