const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

let board = Array.from({ length: 6 }, () => Array(7).fill('')); //[row (0-5)][column (0-6)]
let currentPlayer = "Red";
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
        if (checkWinner(rowIndex, columnIndex)) {
            declareWinner();
            running = false;
            return;
        }
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

    // Create a div element for the circle
    const circleDiv = document.createElement('div');

    // Add a class based on currentPlayer for styling
    circleDiv.classList.add('circle', currentPlayer === 'Red' ? 'player-X' : 'player-O');

    // Clear the contents of the cell and append the circle
    cellToUpdate.innerHTML = '';
    cellToUpdate.appendChild(circleDiv);
}

function declareWinner() {
    statusText.textContent = `${currentPlayer} is the winner`;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "Red") ? "Blue" : "Red";
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
    if (checkVertical(row, column) || checkHorizontal(row, column) || checkNegativeDiagonal(row, column) || checkPositiveDiagonal(row, column)) {
        return true;
    }

    return false;
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
    let numSameIconsNextToLeft = 0;
    let numSameIconsNextToRight = 0;
    let leftIntercept = false;
    let rightIntercept = false;

    for (let i = 1; i < 4; i++) {
        if (column-i >= 0 && board[row][column - i] === currentPlayer && leftIntercept === false) {
            numSameIconsNextToLeft++;
        } else if (column-i >= 0 && board[row][column - i] != currentPlayer && board[row][column - i] != "") {
            leftIntercept = true;
        }
        if (column+i <= 6 && board[row][column + i] === currentPlayer && rightIntercept === false) {
            numSameIconsNextToRight++;
        } else if (column+i <= 6 && board[row][column + i] != currentPlayer && board[row][column + i] != "") {
            rightIntercept = true;
        }
    }

    return (numSameIconsNextToLeft + numSameIconsNextToRight) >= 3;
}
function checkPositiveDiagonal(row, column) {
    let numSameIconsNextToLeft = 0;
    let numSameIconsNextToRight = 0;
    let leftIntercept = false;
    let rightIntercept = false;

    for (let i = 1; i < 4; i++) {
        if (column-i >= 0 && row+i <= 5 && board[row + i][column - i] === currentPlayer && leftIntercept === false) { //bottom left
            numSameIconsNextToLeft++;
        } else if (column-i >= 0 && row+i <= 5 && board[row + i][column - i] != currentPlayer && board[row + i][column - i] != "") {
            leftIntercept = true;
        }
        if (column+i <= 6 && row-i >= 0 && board[row - i][column + i] === currentPlayer) { //top right
            numSameIconsNextToRight++;
        } else if (column+i <= 6 && row-i >= 0 && board[row - i][column + i] != currentPlayer && board[row - i][column + i] !=  "") {
            rightIntercept = true;
        }
    }

    return (numSameIconsNextToLeft + numSameIconsNextToRight) >= 3;
}
function checkNegativeDiagonal(row, column) {
    let numSameIconsNextToLeft = 0;
    let numSameIconsNextToRight = 0;
    let leftIntercept = false;
    let rightIntercept = false;

    for (let i = 1; i < 4; i++) {
        if ((column-i >= 0 && row-i >= 0) && board[row - i][column - i] === currentPlayer && leftIntercept === false) { //top left
            numSameIconsNextToLeft++;
        } else if ((column-i >= 0 && row-i >= 0) && board[row - i][column - i] != currentPlayer && board[row - i][column - i] != "") {
            leftIntercept = true;
        }
        if ((column+i <= 6 && row+i <= 5) && board[row + i][column + i] === currentPlayer && rightIntercept === false) { //bottom right
            numSameIconsNextToRight++;
        } else if ((column+i <= 6 && row+i <= 5) && board[row + i][column + i] != currentPlayer && board[row + i][column + i] != "") {
            rightIntercept = true;
        }
    }

    return (numSameIconsNextToLeft + numSameIconsNextToRight) >= 3;
}
