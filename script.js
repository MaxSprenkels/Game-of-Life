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