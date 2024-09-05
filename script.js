const button = document.getElementById("startStopButton");
const gridContainer = document.getElementById('grid');
const siuuSound = document.getElementById('siuuSound');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const resetButton = document.getElementById('resetButton');
const savePatternButton = document.getElementById('savePatternButton');
const loadPatternButton = document.getElementById('loadPatternButton');
const patternNameInput = document.getElementById('patternName');
const patternSelect = document.getElementById('patternSelect');
const randomButton = document.getElementById('randomButton');   
const rows = 50;
const cols = 50;

let currentGrid = createGrid(rows, cols);  // Grid voor de huidige staat
let nextGrid = createGrid(rows, cols);     // Grid voor de volgende staat
let interval;
let isRunning = false;

// Controleer of fullscreen is ingeschakeld
function isFullscreen() {
    return !!document.fullscreenElement;
}

// Volledig scherm activeren
function enterFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    }
}

// Volledig scherm verlaten
function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

button.addEventListener("click", function() {
    if (button.textContent === "Start") {
        button.textContent = "Stop";
        button.classList.add("stop");
        startGame();
    } else {
        button.textContent = "Start";
        button.classList.remove("stop");
        stopGame();
    }
});

resetButton.addEventListener("click", function() {
    resetGame();
});

randomButton.addEventListener("click", function() {
    if (!isRunning) {
        randomizeGrid();
    }
});

savePatternButton.addEventListener("click", function() {
    savePattern();
});

loadPatternButton.addEventListener("click", function() {
    loadPattern();
});

// Grid creëren
function createGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const gridRow = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'cell-dead');
            cell.dataset.alive = 'false';

            cell.addEventListener('click', () => {
                toggleCell(cell);
                playSiuuSound();
            });

            gridContainer.appendChild(cell);
            gridRow.push(cell);
        }
        grid.push(gridRow);
    }
    return grid;
}

// Reset het spel
function resetGame() {
    stopGame();
    currentGrid.forEach(row => {
        row.forEach(cell => {
            cell.dataset.alive = 'false';
            stopColorChange(cell);
            cell.classList.remove('cell-alive');
            cell.classList.add('cell-dead');
        });
    });
}

// Wissel de staat van de cel
function toggleCell(cell) {
    if (cell.dataset.alive === 'true') {
        cell.dataset.alive = 'false';
        cell.classList.remove('cell-alive');
        cell.classList.add('cell-dead');
        stopColorChange(cell);
    } else {
        cell.dataset.alive = 'true';
        cell.classList.remove('cell-dead');
        cell.classList.add('cell-alive');
        startColorChange(cell);
    }
}

// Grid randomiseren
function randomizeGrid() {
    currentGrid.forEach(row => {
        row.forEach(cell => {
            const isAlive = Math.random() > 0.5;
            cell.dataset.alive = isAlive ? 'true' : 'false';
            if (isAlive) {
                startColorChange(cell);
                cell.classList.add('cell-alive');
                cell.classList.remove('cell-dead');
            } else {
                stopColorChange(cell);
                cell.classList.add('cell-dead');
                cell.classList.remove('cell-alive');
            }
        });
    });
}

// Start het spel
function startGame() {
    isRunning = true;
    interval = setInterval(nextGeneration, 850); // Verlaagde interval voor snellere updates
}

// Stop het spel
function stopGame() {
    isRunning = false;
    clearInterval(interval);
}

// Bereken de volgende generatie
function nextGeneration() {
    const nextGridState = createNextGridState();
    applyNextGridState(nextGridState);
}

// Creëer de volgende gridstaat
function createNextGridState() {
    const nextGridState = [];

    for (let row = 0; row < rows; row++) {
        nextGridState[row] = [];
        for (let col = 0; col < cols; col++) {
            const isAlive = currentGrid[row][col].dataset.alive === 'true';
            const neighbors = countAliveNeighbors(row, col);

            nextGridState[row][col] = (isAlive && (neighbors === 2 || neighbors === 3)) || (!isAlive && neighbors === 3);
        }
    }

    return nextGridState;
}

// Pas de volgende gridstaat toe
function applyNextGridState(nextGridState) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = currentGrid[row][col];
            const shouldBeAlive = nextGridState[row][col];

            if (shouldBeAlive) {
                if (cell.dataset.alive === 'false') {
                    cell.dataset.alive = 'true';
                    cell.classList.remove('cell-dead');
                    cell.classList.add('cell-alive');
                    startColorChange(cell);
                }
            } else {
                if (cell.dataset.alive === 'true') {
                    cell.dataset.alive = 'false';
                    cell.classList.remove('cell-alive');
                    cell.classList.add('cell-dead');
                    stopColorChange(cell);
                }
            }
        }
    }
}

// Tel het aantal levende buren
function countAliveNeighbors(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const neighbor = currentGrid[newRow][newCol];
            if (neighbor.dataset.alive === 'true') {
                count++;
            }
        }
    });

    return count;
}

// Start de kleuraanpassing
function startColorChange(cell) {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    let colorIndex = 0;

    cell.colorChangeInterval = setInterval(() => {
        cell.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 150);
}

// Stop de kleuraanpassing
function stopColorChange(cell) {
    clearInterval(cell.colorChangeInterval);
    cell.style.backgroundColor = '';  // Reset naar CSS default
}

// Speel geluid af
function playSiuuSound() {
    siuuSound.currentTime = 0;
    siuuSound.play();
}

// Fullscreen functionaliteit
fullscreenBtn.addEventListener('click', () => {
    if (!isFullscreen()) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
});

// Patroon opslaan
function savePattern() {
    const patternName = patternNameInput.value.trim();
    if (!patternName) {
        alert('Please enter a name for the pattern.');
        return;
    }

    const gridState = currentGrid.map(row => row.map(cell => cell.dataset.alive === 'true'));
    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || {};
    
    savedPatterns[patternName] = gridState;
    localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));

    if (isFullscreen()) {
        enterFullscreen();
    }

    updatePatternSelect();
    alert(`Pattern "${patternName}" saved!`);
}

// Patroon laden
function loadPattern() {
    const patternName = patternSelect.value;
    if (!patternName) {
        alert('Please select a pattern to load.');
        return;
    }

    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || {};
    const pattern = savedPatterns[patternName];

    if (pattern) {
        currentGrid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const shouldBeAlive = pattern[rowIndex][colIndex];
                cell.dataset.alive = shouldBeAlive ? 'true' : 'false';
                cell.classList.toggle('cell-alive', shouldBeAlive);
                cell.classList.toggle('cell-dead', !shouldBeAlive);
                if (shouldBeAlive) startColorChange(cell);
                else stopColorChange(cell);
            });
        });
    } else {
        alert('Pattern not found.');
    }

    if (isFullscreen()) {
        enterFullscreen();
    }
}

// Update de patroonselectie
function updatePatternSelect() {
    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || {};
    patternSelect.innerHTML = '';

    Object.keys(savedPatterns).forEach(patternName => {
        const option = document.createElement('option');
        option.value = patternName;
        option.textContent = patternName;
        patternSelect.appendChild(option);
    });
}

// Initialiseer de selectie
updatePatternSelect();
