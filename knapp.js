let currentMode = "normal"; 

function toggleMode(button) {
  const modeDisplay = document.getElementById("modeDisplay");

  if (currentMode === "normal") {
    currentMode = "ryskt";
    button.textContent = "Byt till Klassiskt Läge";
    modeDisplay.textContent = "Ryskt Läge";
    rysktläge();
  } else {
    currentMode = "normal";
    button.textContent = "Byt till Ryskt Läge";
    modeDisplay.textContent = "Klassiskt Läge";
    normalmode();
  }
}


function darkmode() {
    document.body.classList.toggle("darkmode");
}


