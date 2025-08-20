function toggleMode(button) {
    const modeDisplay = document.getElementById("modeDisplay");
    if (button.textContent === "Klassisk Läge") {
        button.textContent = "Ryskt Läge";
        modeDisplay.textContent = "Ryskt läge";
        console.log("Bytte till Ryskt Läge");
    } else {
        button.textContent = "Klassiskt Läge";
        modeDisplay.textContent = "Klassiskt Läge";
        console.log("Bytte till Klassiskt Läge");
    }
}

// dark mode
function darkmode() {
    var element = document.body;
    element.classList.toggle("darkmode");
    
} 