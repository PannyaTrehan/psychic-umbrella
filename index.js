const cells = document.querySelectorAll(".cell");
const selectionCells = document.querySelectorAll(".tool");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

let board = Array.from({ length: 6 }, () => Array(7).fill('')); //[row (0-5)][column (0-6)]
let currentPlayer = "Red";
let running = false;

initialiseGame();

function initialiseGame() {
    selectionCells.forEach(tool => {
        tool.addEventListener("click", cellClicked)
        tool.addEventListener("mouseenter", cellHovered);
        tool.addEventListener("mouseleave", cellUnhovered);
    })
    cells.forEach(cell => {
        cell.addEventListener("click", cellClicked);
        cell.addEventListener("mouseenter", cellHovered);
        cell.addEventListener("mouseleave", cellUnhovered);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    setCells();
    running = true;
}

function cellClicked() {
    let columnIndex = this.getAttribute("toolIndex");
    if (columnIndex === null) {
        columnIndex = this.getAttribute("cellIndex") % 7;  //will return the column number [0-6]
    } else {
        columnIndex--;
    }

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
    let toolToUpdate = document.querySelector(`[toolIndex="${parseInt(this.getAttribute("toolIndex"))}"]`);
    if (toolToUpdate === null) {
        toolToUpdate = document.querySelector(`[toolIndex="${(this.getAttribute("cellIndex") % 7) + 1}"]`);
    }
    const greenCircleDiv = document.createElement('div');
    greenCircleDiv.classList.add('circle', 'hover-default');
    toolToUpdate.innerHTML = '';
    toolToUpdate.appendChild(greenCircleDiv);
}

function cellUnhovered() {
    selectionCells.forEach(tool => {
        tool.innerHTML = ''; // Clear the content of the tool
    });
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

function setCells() {
    for (let i = 0; i <= 41; i++) {
        const cellToUpdate = document.querySelector(`[cellIndex="${i}"]`);
        const blackCircleDiv = document.createElement('div');
        blackCircleDiv.classList.add('circle', 'player-default');
        cellToUpdate.innerHTML = '';
        cellToUpdate.appendChild(blackCircleDiv);
    }
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
        if (column+i <= 6 && row-i >= 0 && board[row - i][column + i] === currentPlayer && rightIntercept == false) { //top right
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

function changePlayer() {
    currentPlayer = (currentPlayer === "Red") ? "Yellow" : "Red";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
    currentPlayer = "Red";
    board = Array.from({ length: 6 }, () => Array(7).fill(''));
    statusText.textContent = `${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("hovered-cell");
    });
    setCells();
    running = true;
}

