import config from './config.js';

const socket = io(config.serverUrl);
let gameId = null;
let playerIndex = null;
let opponent = null;
let currentPlayer = 0;
let gameBoard = Array(9).fill('');
let gameActive = false;
let winningCells = [];

const loginDiv = document.getElementById('login');
const waitingDiv = document.getElementById('waiting');
const gameDiv = document.getElementById('game');
const usernameInput = document.getElementById('username');
const joinBtn = document.getElementById('joinBtn');
const statusP = document.getElementById('status');
const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');

joinBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        socket.emit('joinGame', username);
        loginDiv.style.display = 'none';
        waitingDiv.style.display = 'block';
    }
});

socket.on('waiting', () => {
    waitingDiv.style.display = 'block';
});

socket.on('gameStart', (data) => {
    gameId = data.gameId;
    playerIndex = data.player;
    opponent = data.opponent;
    waitingDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    statusP.textContent = playerIndex === 0 ? 'Your turn (X)' : `Waiting for ${opponent} (X)`;
    createBoard();
});

socket.on('gameUpdate', (data) => {
    gameBoard = data.board;
    currentPlayer = data.currentPlayer;
    gameActive = data.gameActive;
    winningCells = data.winningCells;
    createBoard();

    if (data.winner) {
        statusP.textContent = data.winner === socket.username ? 'You win!' : `${data.winner} wins!`;
        gameActive = false;
    } else if (data.draw) {
        statusP.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        statusP.textContent = currentPlayer === playerIndex ? 'Your turn' : `Waiting for ${opponent}`;
    }
});

socket.on('gameReset', (data) => {
    gameBoard = data.board;
    currentPlayer = data.currentPlayer;
    gameActive = data.gameActive;
    winningCells = [];
    createBoard();
    statusP.textContent = currentPlayer === playerIndex ? 'Your turn' : `Waiting for ${opponent}`;
});

socket.on('opponentDisconnected', () => {
    alert('Opponent disconnected. Returning to lobby.');
    resetToLogin();
});

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
    if (!gameActive || currentPlayer !== playerIndex || gameBoard[index] !== '') return;
    socket.emit('makeMove', { gameId, index });
}

resetBtn.addEventListener('click', () => {
    if (gameId) {
        socket.emit('resetGame', gameId);
    }
});

function resetToLogin() {
    loginDiv.style.display = 'block';
    waitingDiv.style.display = 'none';
    gameDiv.style.display = 'none';
    gameId = null;
    playerIndex = null;
    opponent = null;
    gameBoard = Array(9).fill('');
    gameActive = false;
    winningCells = [];
}