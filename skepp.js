// 1. Hämta canvas-elementen
const canvas = document.getElementById("minCanvas");
const fiendeCanvas = document.getElementById("fiendeCanvas");

// 2. Få en "ritpensel" (2D-kontext)
const ctx = canvas.getContext("2d");
const fiendeCtx = fiendeCanvas.getContext("2d");

// 3. 10x10 nät
function drawGrid(ctx) {
    const gridSize = 10; 
    const cellSize = 400 / gridSize;
    
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
drawGrid(ctx);
drawGrid(fiendeCtx);

// Hover-effekt på fiendeCanvas
fiendeCanvas.addEventListener('mousemove', function(e) {
    const rect = fiendeCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridSize = 10;
    const cellSize = 400 / gridSize;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Rensa canvas och rita om rutnätet
    fiendeCtx.clearRect(0, 0, 400, 400);
    drawGrid(fiendeCtx);

    // Rita hover-rutan
    fiendeCtx.fillStyle = "rgba(0, 0, 255, 0.2)";
    fiendeCtx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
});

fiendeCanvas.addEventListener('mouseleave', function() {
    fiendeCtx.clearRect(0, 0, 400, 400);
    drawGrid(fiendeCtx);
});

function getRandomCoordinate() {
    const letters = 'ABCDEFGHIJ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return `${randomLetter}${randomNumber}`;
}

document.getElementById('generateBtn').addEventListener('click', function() {
    document.getElementById('coordinate').textContent = getRandomCoordinate();
});