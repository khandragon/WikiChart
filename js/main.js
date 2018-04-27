"use strict";
var g ={
    "open":"topContent"
};

function main() {
    console.log("start");
    invisbleAll();
    selectedTop();
    U.addHandler(U.$("topArt"),"click",selectedTop);
    U.addHandler(U.$("savedArt"),"click",selectedSaved);
    U.addHandler(U.$("chartArt"),"click",selectedChart);
}

function selectedTop() {
    invisbleAll();
    U.$("topContent").style.display="block";
}
function selectedSaved() {
    invisbleAll();
    U.$("savedContent").style.display="block";
}
function selectedChart() {
    invisbleAll();
    U.$("chartContent").style.display="block";
}

function invisbleAll() {
    var allContent = document.getElementsByTagName("section");
    for (let i = 0; i < allContent.length; i++) {
        allContent[i].style.display="none"; 
        
    }
}

function hideOtherTabs(tabname){
    console.log(tabname); 
};
U.ready(main);