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
}
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
    console.log(text);//if(text ===)
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
    chartMain();
}