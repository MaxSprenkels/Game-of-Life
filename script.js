const button = document.getElementById("startStopButton");
const gridContainer = document.getElementById('grid');
const siuuSound = document.getElementById('siuuSound');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const resetButton = document.querySelectorAll('button')[2]; // Select the third button (Reset)
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

// Event listener for the reset button
resetButton.addEventListener("click", function() {
    resetGame();
});

// Function to create the grid
function createGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const gridRow = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.alive = 'false'; // All cells start dead

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
    stopGame(); // Stop the game if running
    grid.forEach(row => {
        row.forEach(cell => {
            cell.dataset.alive = 'false';
            stopColorChange(cell); // Stop color change
            cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Reset cell color to default
        });
    });
}

// Function to toggle the cell's alive state
function toggleCell(cell) {
    const isAlive = cell.dataset.alive === 'true';
    if (isAlive) {
        cell.dataset.alive = 'false';
        cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Set back to default color
        stopColorChange(cell);
    } else {
        cell.dataset.alive = 'true';
        startColorChange(cell); // Start color change for living cell
    }
}

// Start the game
function startGame() {
    isRunning = true;
    interval = setInterval(nextGeneration, 500); // Update every 500ms
}

// Stop the game
function stopGame() {
    isRunning = false;
    clearInterval(interval);
}

// Function to compute the next generation
function nextGeneration() {
    const nextGridState = createNextGridState();
    updateGrid(nextGridState);
}

// Create the next grid state based on the current state
function createNextGridState() {
    const nextGridState = [];
    for (let row = 0; row < rows; row++) {
        nextGridState[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            const isAlive = cell.dataset.alive === 'true';
            const neighbors = countAliveNeighbors(row, col);

            if (isAlive) {
                // Apply rules for living cells
                if (neighbors === 2 || neighbors === 3) {
                    nextGridState[row][col] = true; // Stays alive
                } else {
                    nextGridState[row][col] = false; // Dies
                }
            } else {
                // Apply rules for dead cells
                if (neighbors === 3) {
                    nextGridState[row][col] = true; // Becomes alive
                } else {
                    nextGridState[row][col] = false; // Stays dead
                }
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

            if (shouldBeAlive) {
                if (!isAlive) {
                    cell.dataset.alive = 'true';
                    startColorChange(cell); // Start color change for new live cells
                }
            } else {
                if (isAlive) {
                    cell.dataset.alive = 'false';
                    stopColorChange(cell); // Stop color change for dead cells
                    cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Dead cell color
                }
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

    cell.colorChangeInterval = setInterval(() => {
        cell.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 500);
}

// Stop the color-changing effect for a cell
function stopColorChange(cell) {
    clearInterval(cell.colorChangeInterval);
    cell.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Set back to default color
}

// Play sound when a cell is toggled
function playSiuuSound() {
    siuuSound.currentTime = 0; // Rewind to the start
    siuuSound.play(); // Play the sound
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
