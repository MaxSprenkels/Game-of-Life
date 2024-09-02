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
            gridContainer.appendChild(cell);
        }
    }
    return grid;
}