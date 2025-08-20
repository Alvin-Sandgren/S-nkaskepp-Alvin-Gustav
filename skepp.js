function toggleMode(button) {
    const modeDisplay = document.getElementById("modeDisplay");
    if (button.textContent === "Normal Mode") {
        button.textContent = "Russian Mode";
        modeDisplay.textContent = "Russian Mode";
        console.log("Switched to Russian Mode");
    } else {
        button.textContent = "Normal Mode";
        modeDisplay.textContent = "Normal Mode";
        console.log("Switched to Normal Mode");
    }
}