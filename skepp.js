function toggleMode(button) {
    if (button.textContent === "Normal Mode") {
        button.textContent = "Russian Mode";
        // Add logic for Russian Mode here
        console.log("Switched to Russian Mode");
    } else {
        button.textContent = "Normal Mode";
        // Add logic for Normal Mode here
        console.log("Switched to Normal Mode");
    }
}