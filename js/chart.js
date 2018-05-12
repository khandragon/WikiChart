"use strict";
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
function queryParse(title) {
    title = title.replace(/ /g, "_");
    return title;
}
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
function chartMain() {
    var pastMonths = generateDates();
    console.log(pastMonths);
    U.addHandler(U.$("displayBtn"), "click", function () {
        var query = U.$("chartTitle").value;
        var lang = U.$("chartLang").value;
        inputGraphData(queryParse(query), lang, pastMonths);
    });
}