const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

let board = Array.from({ length: 6 }, () => Array(7).fill('')); //[row (0-5)][column (0-6)]
let currentPlayer = "X";
let running = false;

initialiseGame();

function initialiseGame() {
    cells.forEach(cell => {
        cell.addEventListener("click", cellClicked);
        cell.addEventListener("mouseenter", cellHovered);
        cell.addEventListener("mouseleave", cellUnhovered);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const clickedColumn = this.getAttribute("cellIndex") % 7;  //will return the column number [0-6]
    const rowIndex = findAvailableRow(clickedColumn); //only return row

    if (isValidMove(rowIndex, clickedColumn)) {
        updateCell(rowIndex, clickedColumn); //take input clickedColumnIndex (for column)
        changePlayer();
        checkWinner();
    }
}

function cellHovered() {
    const columnIndex = parseInt(this.getAttribute("cellIndex")) % 7;

    for (let row = 0; row < 6; row++) {
        cells[row * 7 + columnIndex].classList.add("hovered-cell");
    }
}

function cellUnhovered() {
    cells.forEach(cell => cell.classList.remove("hovered-cell"));
}

function findAvailableRow(columnIndex) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][columnIndex] === "") {
            return row;
        }
    }
}

function isValidMove(row, column) {
    let cellIndex = row * 7 + column;
    return cellIndex >= 0 && cellIndex <= 41 && running;
}

function updateCell(row, column) {
    const cellToUpdate = document.querySelector(`[cellIndex="${row * 7 + column}"]`);

    board[row][column] = currentPlayer;
    cellToUpdate.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
    currentPlayer = "X";
    board = Array.from({ length: 6 }, () => Array(7).fill(''));
    statusText.textContent = `${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("hovered-cell");
    });

    running = true;
}

function checkWinner() {
    // TODO: Implement the logic to check for a winner in the 2D array (board)
}
