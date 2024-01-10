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
    const columnIndex = this.getAttribute("cellIndex") % 7;  //will return the column number [0-6]
    const rowIndex = findAvailableRow(columnIndex); //only return row

    if (isValidMove(rowIndex, columnIndex)) {
        updateCell(rowIndex, columnIndex); //take input columnIndex (for column)
        checkWinner(rowIndex, columnIndex);
        changePlayer();
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

function checkWinner(row, column) {
    console.log(row, column);
    if (checkVertical(row, column)) {
        console.log("vertical 4 in a row");
    }
    if (checkHorizontal(row, column)) {
        console.log("horizontal 4 in a row");
    }
    if (checkNegativeDiagonal(row, column)) {
        console.log("negative diagonal 4 in a row");
    }
    if (checkPositiveDiagonal(row, column)) {
        console.log("positive diagonal 4 in a row");
    }
    // TODO: Implement the logic to check for a winner in the 2D array (board)
}
function checkVertical(row, column) {
    let numSameIconsNextTo = 0;

    for (let i = 1; i <= 3; i++) {
        if (row+i <= 5 && board[row + i][column] === currentPlayer) {
            numSameIconsNextTo++;
        }
    }

    return numSameIconsNextTo >= 3;
}
function checkHorizontal(row, column) {
    let numSameIconsNextTo = 0;
    for (let i = 1; i < 4; i++) {
        if (column-i >= 0 && board[row][column - i] === currentPlayer) {
            numSameIconsNextTo++;
        }
        if (column+i <= 6 && board[row][column + i] === currentPlayer) {
            numSameIconsNextTo++;
        }
    }

    return numSameIconsNextTo >= 3;
}
function checkPositiveDiagonal(row, column) {
    let numSameIconsNextTo = 0;
    for (let i = 1; i < 4; i++) {
        if (column-i >= 0 && row+i <= 5 && board[row + i][column - i] === currentPlayer) { //bottom left
            numSameIconsNextTo++;
        }
        if (column+i <= 6 && row-i >= 0 && board[row - i][column + i] === currentPlayer) { //top right
            numSameIconsNextTo++;
        }
    }

    return numSameIconsNextTo >= 3;
}
function checkNegativeDiagonal(row, column) {
    let numSameIconsNextTo = 0;
    for (let i = 1; i < 4; i++) {
        if (column-i >= 0 && row-i >= 0 && board[row - i][column - i] === currentPlayer) { //top left
            numSameIconsNextTo++;
        }
        if (column+i <= 6 && row+i <= 5 && board[row + i][column + i] === currentPlayer) { //bottom right
            numSameIconsNextTo++;
        }
    }

    return numSameIconsNextTo >= 3;
}
