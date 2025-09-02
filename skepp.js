// ========
//  Setup
// ========
const canvas = document.getElementById("minCanvas");
const fiendeCanvas = document.getElementById("fiendeCanvas");
const ctx = canvas.getContext("2d");
const fiendeCtx = fiendeCanvas.getContext("2d");

window.currentMode = "normal";

window.toggleMode = function(button) {
    const modeDisplay = document.getElementById("modeDisplay");

    if (window.currentMode === "normal") {
        window.currentMode = "ryskt";
        button.textContent = "Byt till Klassiskt Läge";
        modeDisplay.textContent = "Ryskt Läge";
        rysktläge();
    } else {
        window.currentMode = "normal";
        button.textContent = "Byt till Ryskt Läge";
        modeDisplay.textContent = "Klassiskt Läge";
        normalmode();
    }
}

window.darkmode = function() {
    document.body.classList.toggle("darkmode");
}

const gridSize = 10, size = 400, cell = size / gridSize;

const clickedCells = [];   // dina skott på fienden
const shipCells = [];      // spelarens skepp
const enemyShips = [];     // fiendens skepp
const computerMoves = [];  // datorns drag

// Global gameOver variable
window.gameOver = window.gameOver || false;

// ==================
//  Hjälpfunktioner
// ==================

function getCell(e) {
    const rect = fiendeCanvas.getBoundingClientRect();
    return [
        Math.floor((e.clientX - rect.left) / cell),
        Math.floor((e.clientY - rect.top) / cell)
    ];
}

function generateFleet(targetArray, totalCells, forbidden = []) {
    targetArray.length = 0;

    while (targetArray.length < totalCells) {
        const length = Math.floor(Math.random() * 4) + 1;
        const horizontal = Math.random() < 0.5;
        let startCol, startRow;

        if (horizontal) {
            startCol = Math.floor(Math.random() * (gridSize - length + 1));
            startRow = Math.floor(Math.random() * gridSize);
        } else {
            startCol = Math.floor(Math.random() * gridSize);
            startRow = Math.floor(Math.random() * (gridSize - length + 1));
        }

        const newShip = [];
        for (let i = 0; i < length; i++) {
            const c = horizontal ? startCol + i : startCol;
            const r = horizontal ? startRow : startRow + i;
            newShip.push([c, r]);
        }

        if (!newShip.some(pos =>
            targetArray.some(([c, r]) => c === pos[0] && r === pos[1]) ||
            forbidden.some(([c, r]) => c === pos[0] && r === pos[1])
        )) {
            targetArray.push(...newShip);
        }
    }
}

// =======================
//  Renderingsfunktioner
// =======================

function drawGrid(ctx) {
    ctx.beginPath();
    for (let i = 0; i <= gridSize; i++) {
        ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size);
        ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell);
    }
    ctx.strokeStyle = "black"; ctx.stroke();
}

function drawAllX(ctx, cells, ships) {
    ctx.save();
    ctx.strokeStyle = "black"; ctx.lineWidth = 3;
    const pad = cell * 0.2;

    cells.forEach(([c, r]) => {
        if (ships.some(([sc, sr]) => sc === c && sr === r)) {
            ctx.font = `${cell * 0.8}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "red"; 
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
    drawAllX(fiendeCtx, clickedCells, enemyShips);

    if (hover && !window.gameOver) {
        fiendeCtx.fillStyle = "rgba(0,0,255,0.2)";
        fiendeCtx.fillRect(hover[0] * cell, hover[1] * cell, cell, cell);
    }
}

function redrawPlayerCanvas() {
    ctx.clearRect(0, 0, size, size);
    drawGrid(ctx);

    shipCells.forEach(([c, r]) => {
        ctx.save();
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    });

    drawAllX(ctx, computerMoves, shipCells);
}

// ===================================================
//  Game Over / Vinst meddelanden / Leaderboard update
// ===================================================

function checkGameOver() {
    const playerLost = shipCells.every(([c, r]) =>
        computerMoves.some(([cc, rr]) => cc === c && rr === r)
    );
    const enemyLost = enemyShips.every(([c, r]) =>
        clickedCells.some(([cc, rr]) => cc === c && rr === r)
    );

    if (playerLost || enemyLost) {
        if (!window.gameOver) { // only run once
            window.gameOver = true;

            setTimeout(() => {
                if (enemyLost && playerLost) {
                    alert("Oavgjort! 😲");
                } else if (enemyLost) {
                    alert("DU VANN! 🚢💥");
                    updateLeaderboard(1); // only add points if player won
                } else {
                    alert("Du förlorade... dålig 😢");
                }
            }, 100);
        }
    }
}

function updateLeaderboard(points) {
    fetch("leaderboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: points })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log(`Points successfully added! New points: ${points}`);
            
            // Refresh leaderboard
            fetch("leaderboard.php")
                .then(r => r.text())
                .then(html => {
                    const leaderboard = document.getElementById('lederboard');
                    if (leaderboard) leaderboard.innerHTML = html;
                });
        } else {
            console.error("Failed to update points:", data.error);
        }
    })
}
// ===============================
//  Spellogik
// ===============================

function resetGame(fleetSize = 12) {  
    clickedCells.length = 0;
    computerMoves.length = 0;
    window.gameOver = false;

    generateFleet(shipCells, fleetSize);
    generateFleet(enemyShips, fleetSize, shipCells);

    redrawFiendeCanvas();
    redrawPlayerCanvas();
}

function normalmode() {
    resetGame(11);  
}

function rysktläge() {
    resetGame(15);  
}

function gamemode() {
    const element = document.body;
    element.classList.toggle("gamemode");
    if (element.classList.contains("gamemode")) {
        rysktläge();
    } else {
        normalmode();
    }
}

// ==========================================================
//  Funktioner som lyssnar på actions aka mouse track på grid
// ==========================================================

fiendeCanvas.addEventListener('mousemove', e => !window.gameOver && redrawFiendeCanvas(getCell(e)));
fiendeCanvas.addEventListener('mouseleave', () => redrawFiendeCanvas());

fiendeCanvas.addEventListener('click', e => {
    if (window.gameOver) return;

    const cellPos = getCell(e);

    if (clickedCells.some(([c, r]) => c === cellPos[0] && r === cellPos[1])) return;

    clickedCells.push(cellPos);
    redrawFiendeCanvas();

    const hit = enemyShips.some(([c, r]) => c === cellPos[0] && r === cellPos[1]);
    checkGameOver();

    if (!hit && !window.gameOver) {
        let enemyHit;
        do {
            let randCell;
            do {
                randCell = [
                    Math.floor(Math.random() * gridSize),
                    Math.floor(Math.random() * gridSize)
                ];
            } while (computerMoves.some(([c, r]) => c === randCell[0] && r === randCell[1]));

            computerMoves.push(randCell);
            redrawPlayerCanvas();

            enemyHit = shipCells.some(([c, r]) => c === randCell[0] && r === randCell[1]);
            checkGameOver();
        } while (enemyHit && !window.gameOver);
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (currentMode === "ryskt") rysktläge();
    else normalmode();
});

// ===========
//  Initiera
// ===========
drawGrid(ctx);
drawGrid(fiendeCtx);
normalmode();