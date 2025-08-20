// 1. Hämta canvas-elementet
const canvas = document.getElementById("minCanvas");
const fiendeCanvas = document.getElementById("fiendeCanvas");

// 2. Få en "ritpensel" (2D-kontext)
const ctx = canvas.getContext("2d");

// Function to draw the grid on a given canvas
    function drawGrid(canvas) {
    const ctx = canvas.getContext("2d");
    const gridSize = 10; 
    const cellSize = 400 / gridSize;

    // Draw the background
    ctx.fillStyle = "rgb(244, 241, 241)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    ctx.beginPath();
    // Draw vertical lines
    for (let x = 0; x <= 400; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 400);
    }

    // Draw horizontal lines
    for (let y = 0; y <= 400; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(400, y);
    }

    ctx.strokeStyle = "black";
    ctx.stroke();
}

// Call the function for both canvases
drawGrid(minCanvas);
drawGrid(fiendeCanvas);