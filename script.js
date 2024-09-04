const button = document.getElementById("startStopButton");
const gridContainer = document.getElementById('grid');
const siuuSound = document.getElementById('siuuSound');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const resetButton = document.getElementById('resetButton');
const randomButton = document.getElementById('randomButton');
const rows = 50;
const cols = 50;
let grid = createGrid(rows, cols);
let interval; // Variable to hold the interval ID
let isRunning = false; // Game state

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

// Function to create the grid
function createGrid(rows, cols) {
    const grid = [];
    gridContainer.innerHTML = ''; // Clear any existing cells in the container
    for (let row = 0; row < rows; row++) {
        const gridRow = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.alive = 'false'; // All cells start dead
            cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Initial background color for dead cells

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

// Function to toggle the cell's alive state
function toggleCell(cell) {
    const isAlive = cell.dataset.alive === 'true';
    if (isAlive) {
        cell.dataset.alive = 'false';
        cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Reset to default color for dead cells
        stopColorChange(cell);
    } else {
        cell.dataset.alive = 'true';
        startColorChange(cell);
    }
}
let animationFrameId;

function startGame() {
    isRunning = true;
    runGame();
}
function runGame() {
    nextGeneration();
    animationFrameId = requestAnimationFrame(runGame);
}

function stopGame() {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
}
// Start the game
function startGame() {
    isRunning = true;
    interval = setInterval(nextGeneration, 1000); // Update every 500ms
}

// Stop the game
function stopGame() {
    isRunning = false;
    clearInterval(interval);
}

function nextGeneration() {
    const nextGridState = createNextGridState();
    updateGrid(nextGridState);
}

// Correct function to calculate the next grid state
function createNextGridState() {
    const nextGridState = [];
    for (let row = 0; row < rows; row++) {
        nextGridState[row] = [];
        for (let col = 0; col < cols; col++) {
            const isAlive = grid[row][col].dataset.alive === 'true';
            const neighbors = countAliveNeighbors(row, col);

            // Apply Game of Life rules
            if (isAlive) {
                nextGridState[row][col] = (neighbors === 2 || neighbors === 3);
            } else {
                nextGridState[row][col] = (neighbors === 3);
            }
        }
    }
    return nextGridState;
}

// Update the grid to match the next state
function updateGrid(nextGridState) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            const shouldBeAlive = nextGridState[row][col];
            const isAlive = cell.dataset.alive === 'true';

            if (shouldBeAlive && !isAlive) {
                cell.dataset.alive = 'true';
                startColorChange(cell);
            } else if (!shouldBeAlive && isAlive) {
                cell.dataset.alive = 'false';
                stopColorChange(cell);
                cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Background color for dead cells
            }
        }
    }
}

// Count the number of alive neighbors for a cell
function countAliveNeighbors(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], // Top-left, top, top-right
        [0, -1],           [0, 1],  // Left,         right
        [1, -1], [1, 0], [1, 1]    // Bottom-left, bottom, bottom-right
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

// Start the color-changing effect for a cell
function startColorChange(cell) {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    let colorIndex = 0;

    // Verlaag de snelheid van kleurverandering
    cell.colorChangeInterval = setInterval(() => {
        cell.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 200); // 1 seconde per kleurverandering
}


// Stop the color-changing effect for a cell
function stopColorChange(cell) {
    clearInterval(cell.colorChangeInterval);
    cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Restore the original background color
}

// Play sound when a cell is toggled
function playSiuuSound() {
    siuuSound.currentTime = 0;
    siuuSound.play();
}

// Toggle fullscreen mode
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});
