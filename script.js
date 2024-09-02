const gridContainer = document.getElementById('grid');
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
            
            // Add event listener for click to start color change
            cell.addEventListener('click', () => {
                startColorChange(cell);
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
