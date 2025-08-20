// 1. Hämta canvas-elementet
const canvas = document.getElementById("minCanvas");

// 2. Få en "ritpensel" (2D-kontext)
const ctx = canvas.getContext("2d");

// 3. 10x10 nät
function drawGrid(){
    const gridSize = 10; // Number of rows and columns
    const cellSize = 400 / gridSize; // Size of each cell (400px / 10 = 40px)

    ctx.beginPath();
    // Draw vertical lines
    for (let x = 0; x <= 400; x += cellSize) {
        ctx.moveTo(x, 0); // Start at the top of the canvas
        ctx.lineTo(x, 400); // Draw to the bottom of the canvas
    }

    // Draw horizontal lines
    for (let y = 0; y <= 400; y += cellSize) {
        ctx.moveTo(0, y); // Start at the left of the canvas
        ctx.lineTo(400, y); // Draw to the right of the canvas
    }

    ctx.strokeStyle = "black"; // Set the color of the grid lines
    ctx.stroke(); // Draw the lines
}

drawGrid();