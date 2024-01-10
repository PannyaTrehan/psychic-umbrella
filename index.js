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
    const clickedColumnIndex = this.getAttribute("cellIndex") % 7;  //will return the column number [0-6]
    const cellIndex = findAvailableSlot(clickedColumnIndex); //only return row

    if (isValidMove(cellIndex)) {
        updateCell(cellIndex); //take input clickedColumnIndex (for column)
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

function findAvailableSlot(columnIndex) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][columnIndex] === "") {
            return row * 7 + columnIndex;
        }
    }
}

function isValidMove(index) {
    return index >= 0 && index <= 41 && running;
}

function updateCell(index) {
    const cellToUpdate = document.querySelector(`[cellIndex="${index}"]`);
    const row = Math.floor(index / 7);
    const col = index % 7;

    board[row][col] = currentPlayer;
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
