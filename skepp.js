// =========
//  Setup / Globala variabler
// =========
const canvas = document.getElementById("minCanvas");   // spelarens canvas
const fiendeCanvas = document.getElementById("fiendeCanvas"); // fiendens canvas
const ctx = canvas.getContext("2d");
const fiendeCtx = fiendeCanvas.getContext("2d");

const gridSize = 10, size = 400, cell = size / gridSize; // gridstorlek

// Arrays som håller celler för spel och drag
const clickedCells = [];   // spelarens skott på fienden
const shipCells = [];      // spelarens skepp
const enemyShips = [];     // fiendens skepp
const computerMoves = [];  // datorns drag

window.currentMode = "normal"; // startläge
window.gameOver = window.gameOver || false; // global game over-flagga

// ==================
//  Hjälpfunktioner
// ==================

// Returnerar cellen som musen pekar på
function getCell(e) {
    const rect = fiendeCanvas.getBoundingClientRect();
    return [
        Math.floor((e.clientX - rect.left) / cell),
        Math.floor((e.clientY - rect.top) / cell)
    ];
}

// Skapar ett skeppsfält utan att överlappa andra skepp eller förbjudna celler
function generateFleet(targetArray, totalCells, forbidden = []) {
    targetArray.length = 0;
    while (targetArray.length < totalCells) {
        const length = Math.floor(Math.random() * 4) + 1;
        const horizontal = Math.random() < 0.5;
        const startCol = horizontal ? Math.floor(Math.random() * (gridSize - length + 1)) : Math.floor(Math.random() * gridSize);
        const startRow = horizontal ? Math.floor(Math.random() * gridSize) : Math.floor(Math.random() * (gridSize - length + 1));
        const newShip = [];
        for (let i = 0; i < length; i++) {
            newShip.push(horizontal ? [startCol + i, startRow] : [startCol, startRow + i]);
        }
        // Kontrollera att skeppet inte överlappar
        if (!newShip.some(pos =>
            targetArray.some(([c, r]) => c === pos[0] && r === pos[1]) ||
            forbidden.some(([c, r]) => c === pos[0] && r === pos[1])
        )) {
            targetArray.push(...newShip);
        }
    }
}

// Returnerar en slumpmässig cell som datorn inte redan har valt
function getRandomEmptyCell() {
    let cell;
    do {
        cell = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
    } while (computerMoves.some(([c, r]) => c === cell[0] && r === cell[1]));
    return cell;
}

// =======================
//  Renderingsfunktioner
// =======================

// Ritar rutnätet
function drawGrid(ctx) {
    ctx.beginPath();
    for (let i = 0; i <= gridSize; i++) {
        ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size);
        ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}

// Ritar kors för miss och explosion för träff
function drawAllX(ctx, cells, ships) {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    const pad = cell * 0.2;

    cells.forEach(([c, r]) => {
        if (ships.some(([sc, sr]) => sc === c && sr === r)) {
            // träff
            ctx.font = `${cell * 0.8}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "red"; 
            ctx.fillText("💥", c * cell + cell / 2, r * cell + cell / 2);
        } else {
            // miss
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

// Ritar fiendens canvas och hover-effekt
function redrawFiendeCanvas(hover) {
    fiendeCtx.clearRect(0, 0, size, size);
    drawGrid(fiendeCtx);
    drawAllX(fiendeCtx, clickedCells, enemyShips);

    if (hover && !window.gameOver) {
        fiendeCtx.fillStyle = "rgba(0,0,255,0.2)";
        fiendeCtx.fillRect(hover[0] * cell, hover[1] * cell, cell, cell);
    }
}

// Ritar spelarens canvas med skepp och datorns drag
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
//  Game Over & Leaderboard
// ===================================================

// Kontrollerar om spelet är slut
function checkGameOver() {
    const playerLost = shipCells.every(([c, r]) =>
        computerMoves.some(([cc, rr]) => cc === c && rr === r)
    );
    const enemyLost = enemyShips.every(([c, r]) =>
        clickedCells.some(([cc, rr]) => cc === c && rr === r)
    );

    if (playerLost || enemyLost) {
        if (!window.gameOver) {
            window.gameOver = true;

            setTimeout(() => {
                if (enemyLost && playerLost) alert("Oavgjort! 😲");
                else if (enemyLost) { alert("DU VANN! 🚢💥"); updateLeaderboard(1); }
                else alert("Du förlorade... dålig 😢");
            }, 100);
        }
    }
}

// Uppdaterar leaderboard med poäng
function updateLeaderboard(points) {
    fetch("leaderboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log(`Points successfully added! New points: ${points}`);
            fetch("leaderboard.php")
                .then(r => r.text())
                .then(html => {
                    const leaderboard = document.getElementById('lederboard');
                    if (leaderboard) leaderboard.innerHTML = html;
                });
        } else console.error("Failed to update points:", data.error);
    });
}

// ===============================
//  Spellogik
// ===============================

// Återställer spelet
function resetGame(fleetSize = 12) {  
    clickedCells.length = 0;       // rensa spelarens drag
    computerMoves.length = 0;      // rensa datorns drag
    window.gameOver = false;       // återställ game over

    generateFleet(shipCells, fleetSize);           // skapa spelarens skepp
    generateFleet(enemyShips, fleetSize, shipCells); // skapa fiendens skepp

    redrawFiendeCanvas(); // rita fiendens canvas
    redrawPlayerCanvas(); // rita spelarens canvas
}

// Startlägen
function normalmode() { resetGame(11); }
function rysktläge() { resetGame(15); }

// Byter mellan normal och ryskt läge
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

// Byter mellan ljust och mörkt läge
window.darkmode = () => document.body.classList.toggle("darkmode");

// Aktiverar gamemode (ryskt läge)
function gamemode() {
    const element = document.body;
    element.classList.toggle("gamemode");
    element.classList.contains("gamemode") ? rysktläge() : normalmode();
}

// ==========================================================
//  Event listeners
// ==========================================================

// Hover-effekt på fiendens canvas
fiendeCanvas.addEventListener('mousemove', e => !window.gameOver && redrawFiendeCanvas(getCell(e)));
fiendeCanvas.addEventListener('mouseleave', () => redrawFiendeCanvas());

// Hanterar klick på fiendens canvas (spelarens drag)
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
            const randCell = getRandomEmptyCell();
            computerMoves.push(randCell);
            redrawPlayerCanvas();
            enemyHit = shipCells.some(([c, r]) => c === randCell[0] && r === randCell[1]);
            checkGameOver();
        } while (enemyHit && !window.gameOver);
    }
});

// Reset-knapp
document.getElementById('resetBtn').addEventListener('click', () => {
    currentMode === "ryskt" ? rysktläge() : normalmode();
});

// ===========
//  Initiera
// ===========
drawGrid(ctx);
drawGrid(fiendeCtx);
normalmode();
