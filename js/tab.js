"use strict";
function removeSaved() {
    var data = U.$("mySaved");
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
}
function invisbleAll() {
    var allContent = document.getElementsByTagName("section");
    for (var i = 0; i < allContent.length; i++) {
        allContent[i].style.display = "none";
    }
    U.$("topArt").style.backgroundColor = "#f1f1f1";
    U.$("savedArt").style.backgroundColor = "#f1f1f1";
    U.$("chartArt").style.backgroundColor = "#f1f1f1";
    U.$("resourceTab").style.backgroundColor = "#f1f1f1";
}
function selectAbout() {
    invisbleAll();
    removeSaved();
    U.$("about").style.display = "block";
    U.$("resourceTab").style.backgroundColor = "#c5c2c2";
}

function selectedTop() {
    invisbleAll();
    removeSaved();
    U.$("topArt").style.backgroundColor = "#c5c2c2";
    U.$("topContent").style.display = "block";
}
function selectedSaved() {
    invisbleAll();
    removeSaved();
    U.$("savedArt").style.backgroundColor = "#c5c2c2";
    U.$("savedContent").style.display = "block";
    var text = JSON.parse(localStorage.getItem("savedList"));
    if (text.length === 0) {
        var result = U.$("mySaved");
        var notText = document.createElement("p");
        notText.id = "noText";
        notText.innerText = "No Articles Saved";
        result.appendChild(notText);
    } else {
        parseText(text);
    }
}
function selectedChart() {
    invisbleAll();
    removeSaved();
    U.$("chartContent").style.display = "block";
    U.$("chartArt").style.backgroundColor = "#c5c2c2";
    chartMain();
}