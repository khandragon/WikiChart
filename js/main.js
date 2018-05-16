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

/**
 * Create a check box object and depending on assign it a a function depending on where it was created
 * 
 * @param {any} title title of the object we are applying checmark to, it also becomes id and value
 * @param {any} isChecked depending if the value is true or not assign a function
 * @returns a checkmark object to be appended
 */
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

/**
 * takes an array of titles from save, parses the data then using the parsed data populate the save tab
 * 
 * @param {any} saveList a list of the articles to get from cache
 */
function parseText(saveList) {
    for (var i = 0; i < saveList.length; i++) {
        var data = JSON.parse(localStorage.getItem(saveList[i].titleUrl));
        populateSave(data.url, data.title, data.img, data.extract);
    }
}

/**
 * take valus and populate the save list
 * 
 * @param {any} link url link to wikipedia site
 * @param {any} title title of the article
 * @param {any} imgSrc img source from the wikipedia article
 * @param {any} extract the text information from the wikipedia article
 */
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

/**
 * checl an array for any double, soecifcly for the save list
 * 
 * @param {any} arr array filled with many values some of which may be doubles
 * @returns the same array in the same order without the doubles
 */
function removeDoubles(arr) {
    var returnArr = [];
    var checked = {};
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i].title in checked)) {
            checked[arr[i].title] = true;
            returnArr.push(arr[i]);
        }
    }
    return returnArr;
}

/**
 * when the save btn is clicked or checkmark is added to an article
 * add it to the savelist in localstorage, also remove any possible doubles in the save list
 * 
 */
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
    data = removeDoubles(data);
    localStorage.setItem("savedList", JSON.stringify(data));
}

/**
 * when new data is queried remove the old data from the results tab
 * 
 */
function removeData() {
    var data = U.$("results");
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
}

/**
 * takes the page information and put them into the local storage
 * 
 * @param {any} pageInfo the page information from the response text and 
 */
function createCache(pageInfo) {
    var lang = pageInfo.lang;
    var title = pageInfo.titles.canonical;
    var url = "https://" + pageInfo.lang + ".wikipedia.org/wiki/" + title;
    var titleUrl = "https://" + lang + ".wikipedia.org/api/rest_v1/page/summary/" + title + "?redirect=false";
    var extract = pageInfo.extract;
    var imgSrc = null;
    if (pageInfo.thumbnail !== undefined) {
        imgSrc = pageInfo.thumbnail.source;
    }
    var timestamp = dateToString(g.yesturday);
    var numViews = JSON.parse(localStorage.getItem(titleUrl)).views;
    var cache = {
        "lang": lang,
        "title": title,
        "url": url,
        "titleUrl": titleUrl,
        "views": numViews,
        "img": imgSrc,
        "extract": extract,
        "timestamp": timestamp
    }
    localStorage.setItem(titleUrl, JSON.stringify(cache));
}

/**
 * takes parameters and ads them to the resutlts tab displaying the results from the query
 * 
 * @param {any} title title of articles
 * @param {any} extract extract of wikipedia articles
 * @param {any} thumbnail source of image in wikipedia article
 */
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

/**
 * takes the response text and creates cache following which it it adds extract and images
 * 
 * @param {any} responseText results from the api request
 * @param {any} url null value for reusibility 
 * @param {any} date value of the date query to be sent to create cache
 */
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

/**
 * api request with a cb function
 * 
 * @param {any} url api url to get response text
 * @param {any} cb a callback function to be with response text
 * @param {any} date date of the query
 */
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

/**
 * checks if title is in the cache
 * 
 * @param {any} url url of the object in cache
 * @returns returns boolean
 */
function TitleInCache(url) {
    if (JSON.parse(localStorage.getItem(url)).extract === undefined) {
        return false;
    }
    return true;
}

/**
 * taking the url retrieves data from local storage then appends the extract and image  
 * 
 * @param {any} url value in local storage
 */
function createFromCache(url) {
    var data = JSON.parse(localStorage.getItem(url));
    addExtractPictures(data.title, data.extract, data.img)
}

/**
 * taking the title, searches local storage for a value or makes an api request to get the information missing from the cache
 * 
 * @param {any} titles array of titles from the top 20 list
 * @param {any} numArt number of articles that should be displayed
 * @param {any} date the date of the query
 */
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

/**
 * appends to the results the titles, number of views 
 * 
 * @param {any} title a single title of a a wiki article
 * @param {any} numViews number of views for that article
 */
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
}

/**
 * Checks if date is valid  
 * 
 * @param {any} testDate date to be checked
 * @returns returns wether or not the date is valid
 */
function dateIsValid(testDate) {
    var date_regex = /^(201[5678])-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/;
    var minDate = new Date("2015-08-01");
    var testDate = new Date(testDate);
    var testDate = new Date(testDate.setDate(testDate.getDate()+1));
    var currentDate= new Date();
    if ((!date_regex.test(dateToString(testDate)))
       || (currentDate < testDate)
       || (minDate >= testDate)
    ){
        return false;
    }else{
        return true;
    }
}

/**
 * takes top results then checks wether or not the toplist url is exists then checks
 * wether or not to create from cache or make a new request afterwards appends extract and image
 * 
 * 
 * @param {any} url url of top results
 * @param {any} numArt number of articles that the query requires
 * @param {any} date the date of the query
 */
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

/**
 * check if the toplist is in the cache
 * 
 * @param {any} url toplist url
 * @returns returns boolean value
 */
function TopListinCache(url) {
    if (localStorage.getItem(url) !== null) {
        return false;
    }
    return true;
}

/**
 * when submit btn is clicked function removes original data,
 * than takes and validates values from query then decides whether or not
 * to retain from cache or to make a request 
 * 
 * if date is invalid however the border will be red
 * 
 */
function submitData() {
    removeData();
    var date = U.$("date").value;
    if (dateIsValid(date)) {
        U.$("date").style.borderColor = "black";
        var language = U.$("langSelect").value;
        var numArt = U.$("numArt").value;
        var url = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" + language + ".wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2]);
        if (TopListinCache(url)) {
            readFile(url, processText, date);
        }
        else {
            retainFromCache(url, numArt, date);
        }
    }
    else {
        U.$("date").style.borderColor = "red";
    }
}

/**
 * takes response text which are a list of top articles along with the number of views
 * then saves them along with their views followed by calling populate index
 * which appends the title and the views to the results after which envokes the 
 * method to add the extracts and images
 * 
 * @param {any} responseText value that the api returns
 * @param {any} url url for top list
 * @param {any} date of the query requested
 */
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

/**
 * default search to be made when DOM loads up
 * 
 */
function defaultSearch() {
    var date = dateToString(g.yesturday);
    if (dateIsValid(date)) {
        U.$("date").value = date;
        submitData();
    }
}

/**
 * add padding to  number value
 * 4 --> 04
 * but 
 * 10 -->10
 * 
 * @param {any} number 
 * @returns 
 */
function pad(number) {
    var r = String(number);
    if (r.length === 1) {
        r = '0' + r;
    }
    return r;
}

/**
 * takes Date object and turns it into a string of the following format:
 * Ex: 2018-04-12 
 * 
 * 
 * @param {any} date 
 * @returns 
 */
function dateToString(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

/**
 * by defaul stores an empty array into the local storage
 * 
 */
function defaultStore() {
    var data = [];
    localStorage.setItem("savedList", JSON.stringify(data));
}

/**
 * makes the hrefs in the tabs stop from jumping around the page
 * 
 */
function noScrollJumping() {
    U.$("topArt").href = "#!topContent";
    U.$("savedArt").href = "#!savedContent";
    U.$("chartArt").href = "#!hartContent";
}

/**
 * checks the local storage for any value in the local storage that have been expired
 * 
 */
function removeOldCookies() {
    for (var key in localStorage) {
        if (JSON.parse(localStorage.getItem(key)) !== null) {
            if (JSON.parse(localStorage.getItem(key)).timestamp !== undefined) {
                var timestamp = new Date(JSON.parse(localStorage.getItem(key)).timestamp);
                var date = dateToString(timestamp);
                var urlEn = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2]);
                var urlFr = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/fr.wikipedia.org/all-access/" + date.split("-")[0] + "/" + date.split("-")[1] + "/" + date.split("-")[2]);
                if(key === urlEn||key === urlFr){
                    localStorage.removeItem(key);
                }                
                var today = new Date();
                if (date < today){
                    localStorage.removeItem(key);
                }
            }
        }
    }
}

/**
 * Main function does:
 * function first addds 1 to the cookie checking number of visits,
 * creates date objects to be used in he future,
 * checks the local storage for any values to remove,
 * stores the default value into the local storage,
 * does a preliminary search,
 * formats the tabs,
 * followed by selecting the first tab,
 * finally add handlers to tabs and the buttons
 * 
 */
function main() {
    cookiePlus();
    var currentDate = new Date();
    g.yesturday = new Date(currentDate.setDate(currentDate.getDate()-1));
    defaultStore();
    defaultSearch();
    removeOldCookies();
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

