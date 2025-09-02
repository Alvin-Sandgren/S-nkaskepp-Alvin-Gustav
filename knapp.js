let currentMode = "normal";

document.getElementById("modeBtn").addEventListener("click", function() {
    if (currentMode === "normal") {
        currentMode = "ryskt";
        this.textContent = "Byt till Klassiskt Läge";
        modeDisplay.textContent = "Ryskt Läge";
        rysktläge();
    } else {
        currentMode = "normal";
        this.textContent = "Byt till Ryskt Läge";
        modeDisplay.textContent = "Klassiskt Läge";
        normalmode();
    }
});

document.getElementById("darkBtn").addEventListener("click", function() {
    document.body.classList.toggle("darkmode");
});
