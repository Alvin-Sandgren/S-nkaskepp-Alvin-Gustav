const canvas = document.getElementById("minCanvas");
const fiendeCanvas = document.getElementById("fiendeCanvas");
const ctx = canvas.getContext("2d");
const fiendeCtx = fiendeCanvas.getContext("2d");
const gridSize = 10, size = 400, cell = size / gridSize;
const clickedCells = [];
const shipCells = []; 
const enemyShips = []; // <-- NYTT: fiendens skepp
const computerMoves = [];

// Genererar skepp på en bräda
function generateShips(targetArray, count = 5, forbidden = []) {
    targetArray.length = 0;
    while (targetArray.length < count) {
        const pos = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ];
        if (
            !targetArray.some(([c, r]) => c === pos[0] && r === pos[1]) && // inte dubbelt
            !forbidden.some(([c, r]) => c === pos[0] && r === pos[1])     // inte samma som förbjudna
        ) {
            targetArray.push(pos);
        }
    }
}

// Skapa spelplan
generateShips(shipCells);           // mina skepp
generateShips(enemyShips, 5, shipCells); // fiendens skepp, EJ samma som mina

function drawGrid(ctx) {
    ctx.beginPath();
    for (let i = 0; i <= gridSize; i++) {
        ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size);
        ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell);
    }
    ctx.strokeStyle = "black"; ctx.stroke();
}

// Ritar X eller träffar
function drawAllX(ctx, cells, ships) {
    ctx.save();
    ctx.strokeStyle = "black"; ctx.lineWidth = 3;
    const pad = cell * 0.2;
    cells.forEach(([c, r]) => {
        if (ships.some(([sc, sr]) => sc === c && sr === r)) {
            ctx.font = `${cell * 0.8}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("💥", c * cell + cell / 2, r * cell + cell / 2);
        } else {
            ctx.beginPath();
            ctx.moveTo(c * cell + pad, r * cell + pad);
            ctx.lineTo((c + 1) * cell - pad, (r + 1) * cell - pad);
            ctx.moveTo((c + 1) * cell - pad, r * cell + pad);
            ctx.lineTo(c * cell + pad, (r + 1) * cell - pad);
            ctx.stroke();
        }
    });
    ctx.restore();
}

function redrawFiendeCanvas(hover) {
    fiendeCtx.clearRect(0, 0, size, size);
    drawGrid(fiendeCtx);
    drawAllX(fiendeCtx, clickedCells, enemyShips); // <-- använder fiendens skepp
    if (hover)
        fiendeCtx.fillStyle = "rgba(0,0,255,0.2)",
        fiendeCtx.fillRect(hover[0] * cell, hover[1] * cell, cell, cell);
}

function redrawPlayerCanvas() {
    ctx.clearRect(0, 0, size, size);
    drawGrid(ctx);

    // Rita mina skepp
    shipCells.forEach(([c, r]) => {
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    });

    // Ritar datorns drag på mina skepp
    drawAllX(ctx, computerMoves, shipCells);
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

    // DATORNS DRAG
    let randCell;
    do {
        randCell = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ];
    } while (computerMoves.some(([c, r]) => c === randCell[0] && r === randCell[1]));

    computerMoves.push(randCell);

    redrawPlayerCanvas();
});

document.getElementById('resetBtn').addEventListener('click', function() {
    clickedCells.length = 0;
    computerMoves.length = 0;
    generateShips(shipCells);
    generateShips(enemyShips, 5, shipCells); // <-- NYTT: skapa nya fiendeskepp
    redrawFiendeCanvas();
    redrawPlayerCanvas();
});

document.getElementById('startBtn').addEventListener('click', function() {
    clickedCells.length = 0;
    computerMoves.length = 0;
    generateShips(shipCells);
    generateShips(enemyShips, 5, shipCells); // <-- NYTT: skapa nya fiendeskepp
    redrawFiendeCanvas();
    redrawPlayerCanvas();
});