let currentMode = "normal"; 

function toggleMode(button) {
    const modeDisplay = document.getElementById("modeDisplay");

    if (button.textContent === "Klassiskt Läge") {
        button.textContent = "Ryskt Läge";
        modeDisplay.textContent = "Ryskt Läge";
        currentMode = "ryskt";
        console.log("Bytte till Ryskt Läge");
        rysktläge(); 
    } else {
        button.textContent = "Klassiskt Läge";
        modeDisplay.textContent = "Klassiskt Läge";
        currentMode = "normal";
        console.log("Bytte till Klassiskt Läge");
        normalmode(); 
    }
}

function darkmode() {
    document.body.classList.toggle("darkmode");
}


