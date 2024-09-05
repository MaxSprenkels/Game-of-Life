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
let grid = createGrid(rows, cols);
let interval;
let isRunning = false;

// Fullscreen check
function isFullscreen() {
    return !!document.fullscreenElement;
}

// Enter fullscreen mode
function enterFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    }
}

// Exit fullscreen mode
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

// Function to create the grid
function createGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const gridRow = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
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

// Function to reset the game
function resetGame() {
    stopGame();
    grid.forEach(row => {
        row.forEach(cell => {
            cell.dataset.alive = 'false';
            stopColorChange(cell);
            cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        });
    });
}

// Function to toggle the cell's alive state
function toggleCell(cell) {
    const isAlive = cell.dataset.alive === 'true';
    if (isAlive) {
        cell.dataset.alive = 'false';
        cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        stopColorChange(cell);
    } else {
        cell.dataset.alive = 'true';
        startColorChange(cell);
    }
}

// Function to randomize the grid
function randomizeGrid() {
    grid.forEach(row => {
        row.forEach(cell => {
            const isAlive = Math.random() > 0.5;
            cell.dataset.alive = isAlive ? 'true' : 'false';
            if (isAlive) {
                startColorChange(cell);
            } else {
                stopColorChange(cell);
                cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
        });
    });
}


function startGame() {
    isRunning = true;
    interval = setInterval(nextGeneration, 500);
}

function stopGame() {
    isRunning = false;
    clearInterval(interval);
}

function nextGeneration() {
    const nextGridState = createNextGridState();
    updateGrid(nextGridState);
}

function createNextGridState() {
    const nextGridState = [];
    for (let row = 0; row < rows; row++) {
        nextGridState[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            const isAlive = cell.dataset.alive === 'true';
            const neighbors = countAliveNeighbors(row, col);

            if (isAlive) {
                if (neighbors === 2 || neighbors === 3) {
                    nextGridState[row][col] = true;
                } else {
                    nextGridState[row][col] = false;
                }
            } else {
                if (neighbors === 3) {
                    nextGridState[row][col] = true;
                } else {
                    nextGridState[row][col] = false;
                }
            }
        }
    }
    return nextGridState;
}

function updateGrid(nextGridState) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            const shouldBeAlive = nextGridState[row][col];
            const isAlive = cell.dataset.alive === 'true';

            if (shouldBeAlive) {
                if (!isAlive) {
                    cell.dataset.alive = 'true';
                    startColorChange(cell);
                }
            } else {
                if (isAlive) {
                    cell.dataset.alive = 'false';
                    stopColorChange(cell);
                    cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }
            }
        }
    }
}

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
            const neighbor = grid[newRow][newCol];
            if (neighbor.dataset.alive === 'true') {
                count++;
            }
        }
    });

    return count;
}

function startColorChange(cell) {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    let colorIndex = 0;

    cell.colorChangeInterval = setInterval(() => {
        cell.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 500);
}

function stopColorChange(cell) {
    clearInterval(cell.colorChangeInterval);
    cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
}

function playSiuuSound() {
    siuuSound.currentTime = 0;
    siuuSound.play();
}

fullscreenBtn.addEventListener('click', () => {
    if (!isFullscreen()) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
});

function savePattern() {
    const patternName = patternNameInput.value.trim();
    if (!patternName) {
        alert('Please enter a name for the pattern.');
        return;
    }

    const gridState = grid.map(row => row.map(cell => cell.dataset.alive === 'true'));
    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || {};
    
    savedPatterns[patternName] = gridState;
    localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));

    // Check and maintain fullscreen mode
    if (isFullscreen()) {
        enterFullscreen();
    }

    updatePatternSelect();
    alert(`Pattern "${patternName}" saved!`);
}

function loadPattern() {
    const patternName = patternSelect.value;
    if (!patternName) {
        alert('Please select a pattern to load.');
        return;
    }

    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || {};
    const pattern = savedPatterns[patternName];

    if (pattern) {
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const shouldBeAlive = pattern[rowIndex][colIndex];
                cell.dataset.alive = shouldBeAlive ? 'true' : 'false';
                cell.style.backgroundColor = shouldBeAlive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
                if (shouldBeAlive) startColorChange(cell);
                else stopColorChange(cell);
            });
        });
    } else {
        alert('Pattern not found.');
    }

    // Check and maintain fullscreen mode
    if (isFullscreen()) {
        enterFullscreen();
    }
}

// Update the pattern select dropdown
function updatePatternSelect() {
    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns')) || {};
    patternSelect.innerHTML = '<option value="" disabled selected>Select a pattern to load</option>';

    for (const patternName in savedPatterns) {
        const option = document.createElement('option');
        option.value = patternName;
        option.textContent = patternName;
        patternSelect.appendChild(option);
    }
}

// Initialize the pattern select dropdown on page load
updatePatternSelect();
