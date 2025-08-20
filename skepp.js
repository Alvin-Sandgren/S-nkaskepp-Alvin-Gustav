const canvas = document.getElementById("minCanvas");
const fiendeCanvas = document.getElementById("fiendeCanvas");
const ctx = canvas.getContext("2d");
const fiendeCtx = fiendeCanvas.getContext("2d");
const gridSize = 10, size = 400, cell = size / gridSize;
const clickedCells = [];

function drawGrid(ctx) {
    ctx.beginPath();
    for (let i = 0; i <= gridSize; i++) {
        ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size);
        ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell);
    }
    ctx.strokeStyle = "black"; ctx.stroke();
}

function drawAllX(ctx, cells) {
    ctx.save();
    ctx.strokeStyle = "black"; ctx.lineWidth = 3;
    const pad = cell * 0.2;
    cells.forEach(([c, r]) => {
        ctx.beginPath();
        ctx.moveTo(c * cell + pad, r * cell + pad);
        ctx.lineTo((c + 1) * cell - pad, (r + 1) * cell - pad);
        ctx.moveTo((c + 1) * cell - pad, r * cell + pad);
        ctx.lineTo(c * cell + pad, (r + 1) * cell - pad);
        ctx.stroke();
    });
    ctx.restore();
}

function redrawFiendeCanvas(hover) {
    fiendeCtx.clearRect(0, 0, size, size);
    drawGrid(fiendeCtx);
    drawAllX(fiendeCtx, clickedCells);
    if (hover)
        fiendeCtx.fillStyle = "rgba(0,0,255,0.2)",
        fiendeCtx.fillRect(hover[0] * cell, hover[1] * cell, cell, cell);
}

drawGrid(ctx); drawGrid(fiendeCtx);

function getCell(e) {
    const rect = fiendeCanvas.getBoundingClientRect();
    return [
        Math.floor((e.clientX - rect.left) / cell),
        Math.floor((e.clientY - rect.top) / cell)
    ];
}

fiendeCanvas.addEventListener('mousemove', e => redrawFiendeCanvas(getCell(e)));
fiendeCanvas.addEventListener('mouseleave', () => redrawFiendeCanvas());
fiendeCanvas.addEventListener('click', e => {
    const cellPos = getCell(e);
    if (!clickedCells.some(([c, r]) => c === cellPos[0] && r === cellPos[1]))
        clickedCells.push(cellPos);
    redrawFiendeCanvas(cellPos);
});

document.getElementById('generateBtn').addEventListener('click', () => {
    const letters = 'ABCDEFGHIJ';
    document.getElementById('coordinate').textContent =
        letters[Math.floor(Math.random() * 10)] + (Math.floor(Math.random() * 10) + 1);
});

document.getElementById('resetBtn').addEventListener('click', function() {
    clickedCells.length = 0; // Töm arrayen
    redrawFiendeCanvas();    // Rita om canvasen utan X
});

