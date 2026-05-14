const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = true;
let winningCells = [];

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function createBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        if (cell === 'X') cellElement.classList.add('x');
        if (cell === 'O') cellElement.classList.add('o');
        if (winningCells.includes(index)) cellElement.classList.add('winning');
        if (cell !== '') cellElement.classList.add('taken');
        cellElement.addEventListener('click', () => makeMove(index));
        board.appendChild(cellElement);
    });
}

function makeMove(index) {
    if (gameBoard[index] !== '' || !gameActive) return;
    gameBoard[index] = currentPlayer;
    if (checkWin()) {
        winningCells = getWinningCells();
        createBoard();
        setTimeout(() => alert(`${currentPlayer} wins!`), 100);
        gameActive = false;
        return;
    }
    if (gameBoard.every(cell => cell !== '')) {
        createBoard();
        setTimeout(() => alert('It\'s a draw!'), 100);
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    createBoard();
}

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === currentPlayer);
    });
}

function getWinningCells() {
    return winPatterns.find(pattern => {
        return pattern.every(index => gameBoard[index] === currentPlayer);
    }) || [];
}

function resetGame() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    winningCells = [];
    createBoard();
}

resetBtn.addEventListener('click', resetGame);
createBoard();