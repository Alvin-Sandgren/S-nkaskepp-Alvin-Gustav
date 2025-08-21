const canvas = document.getElementById("minCanvas");
const fiendeCanvas = document.getElementById("fiendeCanvas");
const ctx = canvas.getContext("2d");
const fiendeCtx = fiendeCanvas.getContext("2d");
const gridSize = 10, size = 400, cell = size / gridSize;
const clickedCells = [];
const shipCells = []; // Här lagras skeppens positioner

// Generera 5 slumpmässiga skepp
function generateShips(count = 5) {
    shipCells.length = 0;
    while (shipCells.length < count) {
        const pos = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ];
        if (!shipCells.some(([c, r]) => c === pos[0] && r === pos[1])) {
            shipCells.push(pos);
        }
    }
}
generateShips();

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
        // Om det är en skeppsposition, rita explosion istället för X
        if (shipCells.some(([sc, sr]) => sc === c && sr === r)) {
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

document.getElementById('resetBtn').addEventListener('click', function() {
    clickedCells.length = 0; 
    generateShips();          
    redrawFiendeCanvas();     
});

fiendeCanvas.addEventListener('click', e => {
    const cellPos = getCell(e);
    if (!clickedCells.some(([c, r]) => c === cellPos[0] && r === cellPos[1]))
        clickedCells.push(cellPos);
    redrawFiendeCanvas(cellPos);

    // Rita 5 skepp på din egen canvas (om inte redan finns)
    ctx.clearRect(0, 0, size, size);
    drawGrid(ctx);
    // Rita skepp som blåa cirklar
    shipCells.forEach(([c, r]) => {
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    });

    // Slumpmässigt X på din egen ruta
    let randCell;
    do {
        randCell = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ];
    } while (clickedCells.some(([c, r]) => c === randCell[0] && r === randCell[1]));
    
    // Rita explosion om träff, annars X på din egen canvas
    ctx.save();
    if (shipCells.some(([sc, sr]) => sc === randCell[0] && sr === randCell[1])) {
        ctx.font = `${cell * 0.8}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💥", randCell[0] * cell + cell / 2, randCell[1] * cell + cell / 2);
    } else {
        ctx.strokeStyle = "black"; ctx.lineWidth = 3;
        const pad = cell * 0.2;
        ctx.beginPath();
        ctx.moveTo(randCell[0] * cell + pad, randCell[1] * cell + pad);
        ctx.lineTo((randCell[0] + 1) * cell - pad, (randCell[1] + 1) * cell - pad);
        ctx.moveTo((randCell[0] + 1) * cell - pad, randCell[1] * cell + pad);
        ctx.lineTo(randCell[0] * cell + pad, (randCell[1] + 1) * cell - pad);
        ctx.stroke();
    }
    ctx.restore();
    
});
