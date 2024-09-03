const button = document.getElementById("startStopButton");
        button.addEventListener("click", function() {
            if (button.textContent === "Start") {
                button.textContent = "Stop";
                button.classList.add("stop");
            } else {
                button.textContent = "Start";
                button.classList.remove("stop");
            }
        });

const gridContainer = document.getElementById('grid');
const siuuSound = document.getElementById('siuuSound'); // Get the audio element
const fullscreenBtn = document.getElementById('fullscreen-btn'); // Get the fullscreen button
const rows = 50;
const cols = 50;
let grid = createGrid(rows, cols);

function createGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const gridRow = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            cell.addEventListener('click', () => {
                startColorChange(cell);
                playSiuuSound();
            });
            
            gridContainer.appendChild(cell);
            gridRow.push(cell);
        }
        grid.push(gridRow);
    }
    return grid;
}

function startColorChange(cell) {
    let isChanging = cell.dataset.isChanging === 'true';
    
    if (!isChanging) {
        cell.dataset.isChanging = 'true';
        
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        let colorIndex = 0;

        cell.colorChangeInterval = setInterval(() => {
            cell.style.backgroundColor = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
        }, 500);
    } else {
        clearInterval(cell.colorChangeInterval);
        cell.style.backgroundColor = 'white';
        cell.dataset.isChanging = 'false';
    }
}

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
