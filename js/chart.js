"use strict";
function queryParse(title) {
    title = title.replace(/ /g,"_");
    return title;
}

function createGraph(query, lang) {

}
function chartMain() {
    U.addHandler(U.$("displayBtn"), "click", function () {
        var query = U.$("chartTitle").value;
        var lang = U.$("chartLang").value;
        createGraph(queryParse(query), lang);
    });
}