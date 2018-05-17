"use strict";

/**
 * generate an array of all past months
 * 
 * @returns an array of past months
 */
function generateDates() {
    var today = new Date();
    var yearToday = today.getFullYear();
    var monthToday = today.getMonth();
    var pastMonths = [];
    var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    for (var i = 0; i < months.length; i++) {
        monthToday--;
        pastMonths.push(yearToday + "-" + months[monthToday]);
        if (monthToday < 1) {
            monthToday = 12;
            yearToday--;
        }
    }
    return pastMonths;
}

/**
 * format titles so that spaces are replaced with underlines
 * 
 * @param {any} title title of wiki article with spaces
 * @returns return article name without spaces
 */
function queryParse(title) {
    title = title.replace(/ /g, "_");
    return title;
}

/**
 * take the proper input and look for the
 * correct values in local storage before making a api request
 * 
 * @param {any} query title of selected article
 * @param {any} lang the language of the search we want
 * @param {any} dates past dates to be displayed
 */
function inputGraphData(query, lang, dates) {
    if (query !== "") {
        console.log("in" + query);
    } else {
        var exist = false;
        if (lang === "en") {
            for (var i = 0; i < localStorage.length; i++) {
                if ((/^en\!.*/.test(localStorage.key(i)))) {
                    if (("en!" + parseId(query) === localStorage.key(i))) {
                        exist = true;
                        var views = localStorage.getItem(localStorage.key(i)).split(",");
                        for (var j = 0; j < views.length; j++) {
                            d.monthlyViews.push(views[j]);
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < localStorage.length; i++) {
                if ((/^fr\!.*/.test(localStorage.key(i)))) {
                    if (("fr!" + parseId(query) === localStorage.key(i))) {
                        exist = true;
                        var views = localStorage.getItem(localStorage.key(i)).split(",");
                        for (var j = 0; j < views.length; j++) {
                            d.monthlyViews.push(views[j]);
                        }
                    }
                }
            }
        }
        if (!exist) {
            d.parseArticle = getParsedTitle(query);
            retrieveRequest(d.parseArticle, d.language, dates[12].split("-").join(""), dates[0].split("-").join(""));
        } else {
            createGraph();
        }
    }
}

/**
 * main function for charts, generate past months
 * followed by adding handler
 * then creating the graph
 * 
 */
function chartMain() {
    var pastMonths = generateDates();
    U.addHandler(U.$("displayBtn"), "click", function () {
        var query = U.$("chartTitle").value;
        var lang = U.$("chartLang").value;
        inputGraphData(queryParse(query), lang, pastMonths);
    });
}