function selectAbout() {
    invisbleAll();
    removeSaved();
    U.$("about").style.display = "block";
}

function selectedTop() {
    invisbleAll();
    removeSaved();
    U.$("topContent").style.display = "block";
}
function selectedSaved() {
    invisbleAll();
    removeSaved();
    U.$("savedContent").style.display = "block";
    var text = JSON.parse(localStorage.getItem("savedList"));
    parseText(text);
}
function selectedChart() {
    invisbleAll();
    removeSaved();
    U.$("chartContent").style.display = "block";
}