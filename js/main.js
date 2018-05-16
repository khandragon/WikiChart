"use strict";

var g = {};

/**
 *  Teaches IE < 9 to recognize HTML5 elements. 
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


/**
 * When a checkbox is clicked remove from the saved list and update storage
 * 
 */
function removefromsaved() {
    var results = U.$("mySaved");
    for (var i = 0; i < results.childNodes.length; i++) {
        if (!results.childNodes[i].childNodes[2].checked) {
            var removeCheck = results.childNodes[i].id;
            results.removeChild(results.childNodes[i]);
            if (results.childNodes.length === 0) {
                var notText = document.createElement("p");
                notText.id = "noText";
                notText.innerText = "No Articles Saved";
                results.appendChild(notText);
                defaultStore();
            }
            var topList = U.$("results");
            for (var j = 0; j < topList.childNodes.length; j++) {
                if (topList.childNodes[i].id === removeCheck) {
                    topList.childNodes[i].childNodes[2].checked = false;
                }
            }
        }
    }
    var data = []
    for (var i = 0; i < results.childNodes.length; i++) {
        data[i] = localStorage.getItem(results.childNodes[i].id);
    }
    localStorage.setItem("savedList", data);
}

function checkmarkGen(title, isChecked) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = title;
    checkbox.id = title;
    checkbox.checked = isChecked;
    if (isChecked === true) {
        U.addHandler(checkbox, "click", removefromsaved)
    } else {
        U.addHandler(checkbox, "click", savedData)
    }

    return checkbox;
}

function parseText(saveList) {
    for (var i = 0; i < saveList.length; i++) {
        var data = JSON.parse(localStorage.getItem(saveList[i].titleUrl));
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
    if (imgSrc !== null) {
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

function removeDoubles(arr) {
    var returnArr = [];
    var checked ={};
    for (var i =0; i <arr.length;i++){
        if(!(arr[i].title in checked)){
            checked[arr[i].title] = true;
            returnArr.push(arr[i]);
        }
    }
    console.log(returnArr);
    return returnArr;
}

function savedData() {
    var results = U.$("results");
    var lang = U.$("langSelect").value;
    var date = U.$("date").value;
    var data = localStorage.getItem("savedList");
    if (data === "") {
        defaultStore();
    }
    data = JSON.parse(localStorage.getItem("savedList"));
    for (var i = 0; i < results.childNodes.length; i++) {
        if (results.childNodes[i].childNodes[2].checked) {
            var titleUrl = "https://" + lang + ".wikipedia.org/api/rest_v1/page/summary/" + results.childNodes[i].id + "?redirect=false";
            data.push(JSON.parse(localStorage.getItem(titleUrl)));
        }
    }
    data=removeDoubles(data);
    localStorage.setItem("savedList", JSON.stringify(data));
}

function removeData() {
    var data = U.$("results");
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
}
function createCache(pageInfo, date) {
    var lang = pageInfo.lang;
    var title = pageInfo.titles.canonical;
    var url = "https://" + pageInfo.lang + ".wikipedia.org/wiki/" + title;
    var titleUrl = "https://" + lang + ".wikipedia.org/api/rest_v1/page/summary/" + title + "?redirect=false";
    var extract = pageInfo.extract;
    var imgSrc = null;
    if (pageInfo.thumbnail !== undefined) {
        imgSrc = pageInfo.thumbnail.source;
    }
    var numViews = JSON.parse(localStorage.getItem(titleUrl)).views;
    var cache = {
        "lang": lang,
        "title": title,
        "url": url,
        "titleUrl": titleUrl,
        "views": numViews,
        "img": imgSrc,
        "extract": extract,
    }
    localStorage.setItem(titleUrl, JSON.stringify(cache));
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
function processTitles(responseText, url, date) {
    var pageInfo = JSON.parse(responseText);
    createCache(pageInfo, date);
    if (!pageInfo.thumbnail) {
        pageInfo.thumbnail = "null";
    }
    if (U.$(pageInfo.titles.canonical) !== null) {
        addExtractPictures(pageInfo.titles.canonical, pageInfo.extract, pageInfo.thumbnail.source);
    }
}

function readFile(url, cb, date) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Api-User-Agent", "saaadkhan23@yahoo.ca");
    U.addHandler(r, "load", function () {
        if (r.readyState === 4) {
            cb(r.responseText, url, date);
        }
    });
    r.send(null);
}
function TitleInCache(url) {
    if (JSON.parse(localStorage.getItem(url)).extract === undefined) {
        return false;
    }
    return true;
}
function createFromCache(url) {
    var data = JSON.parse(localStorage.getItem(url));
    addExtractPictures(data.title, data.extract, data.img)
}

function getExtractPictures(titles, numArt, date) {
    var language = U.$("langSelect").value;
    for (var i = 0; i < numArt; i++) {
        var url = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + titles[i] + "?redirect=false";
        if (TitleInCache(url)) {
            createFromCache(url);
        } else {
            readFile(url, processTitles, date);
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
    if ((!date_regex.test(testDate))
        || g.currentDate <= new Date(testDate)
        || g.minDate < 0
    ) {
        return false;
    }
    else
        return true;
}
function retainFromCache(url, numArt, date) {
    var top = JSON.parse(localStorage.getItem(url));
    var language = U.$("langSelect").value;
    for (var i = 0; i < numArt; i++) {
        var titleUrl = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + top[i] + "?redirect=false";
        if (TitleInCache(titleUrl)) {
            var data = JSON.parse(localStorage.getItem(titleUrl));
            populateIndex(data.title, data.views);
        } else {
            readFile(titleUrl, processTitles, date);
            var data = JSON.parse(localStorage.getItem(titleUrl));
        }
    }
    getExtractPictures(top, numArt, date);
}
function TopListinCache(url) {
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
        if (TopListinCache(url)) {
            console.log("url--->from api");
            readFile(url, processText, date);
        }
        else {
            console.log("url--->from cache");
            retainFromCache(url, numArt, date);
        }
    }
    else {
        U.$("date").style.borderColor = "red";
    }
}
function processText(responseText, url, date) {
    var text = JSON.parse(responseText);
    var language = U.$("langSelect").value;
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
        var titleUrl = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + topViewed[i] + "?redirect=false";
        localStorage.setItem(titleUrl, JSON.stringify(data));
    }
    localStorage.setItem(url, JSON.stringify(topViewed));
    for (var i = 0; i < numArt; i++) {
        populateIndex(topViewed[i], numViews[i], numArt);
    }
    getExtractPictures(topViewed, numArt, date);
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
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
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
    cookiePlus();
    var currentDate = new Date();
    g.yesturday = new Date(currentDate.setDate(currentDate.getDate() - 1));
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
