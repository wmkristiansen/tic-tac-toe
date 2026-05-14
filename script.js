// Local Two-Player Tic Tac Toe Game
// No server required - runs entirely in the browser

// Game State
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let currentPlayer = 'X'; // X always goes first
let gameBoard = Array(9).fill('');
let gameActive = false;
let winningCells = [];

// Score tracking (temporary - resets on page refresh)
let scores = {
    p1: { wins: 0, losses: 0 },
    p2: { wins: 0, losses: 0 }
};

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const startBtn = document.getElementById('start-btn');
const board = document.getElementById('board');
const currentTurnSpan = document.getElementById('current-turn');
const resultMessage = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again-btn');
const newPlayersBtn = document.getElementById('new-players-btn');
const resetScoresBtn = document.getElementById('reset-scores-btn');

// Score elements
const scoreNameP1 = document.getElementById('score-name-p1');
const scoreNameP2 = document.getElementById('score-name-p2');
const winsP1 = document.getElementById('wins-p1');
const lossesP1 = document.getElementById('losses-p1');
const winsP2 = document.getElementById('wins-p2');
const lossesP2 = document.getElementById('losses-p2');

// Winning patterns
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Event Listeners
startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetBoard);
newPlayersBtn.addEventListener('click', newPlayers);
resetScoresBtn.addEventListener('click', resetScores);

// Allow Enter key to start game
player2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});

function startGame() {
    // Get player names
    player1Name = player1Input.value.trim() || 'Player 1';
    player2Name = player2Input.value.trim() || 'Player 2';

    // Update scoreboard names
    scoreNameP1.textContent = player1Name;
    scoreNameP2.textContent = player2Name;

    // Switch screens
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    // Initialize game
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = Array(9).fill('');
    winningCells = [];
    resultMessage.style.display = 'none';
    playAgainBtn.style.display = 'none';

    updateTurnDisplay();
    createBoard();
    updateScoreboard();
}

function createBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.dataset.index = index;

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

    // Place mark
    gameBoard[index] = currentPlayer;

    // Check for win
    if (checkWin(currentPlayer)) {
        winningCells = getWinningCells(currentPlayer);
        gameActive = false;
        handleWin(currentPlayer);
        createBoard();
        return;
    }

    // Check for draw
    if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        handleDraw();
        createBoard();
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();
    createBoard();
}

function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === player);
    });
}

function getWinningCells(player) {
    return winPatterns.find(pattern => {
        return pattern.every(index => gameBoard[index] === player);
    }) || [];
}

function handleWin(winner) {
    const winnerName = winner === 'X' ? player1Name : player2Name;
    const loserName = winner === 'X' ? player2Name : player1Name;

    // Update scores
    if (winner === 'X') {
        scores.p1.wins++;
        scores.p2.losses++;
    } else {
        scores.p2.wins++;
        scores.p1.losses++;
    }

    updateScoreboard();

    // Show result
    resultMessage.innerHTML = `<span class="winner-text">🎉 ${winnerName} Wins! 🎉</span>`;
    resultMessage.style.display = 'block';
    playAgainBtn.style.display = 'inline-block';

    // Highlight winner's score card
    document.getElementById('score-p1').classList.toggle('winner-highlight', winner === 'X');
    document.getElementById('score-p2').classList.toggle('winner-highlight', winner === 'O');
}

function handleDraw() {
    resultMessage.innerHTML = '<span class="draw-text">🤝 It's a Draw! 🤝</span>';
    resultMessage.style.display = 'block';
    playAgainBtn.style.display = 'inline-block';

    // Remove winner highlights
    document.getElementById('score-p1').classList.remove('winner-highlight');
    document.getElementById('score-p2').classList.remove('winner-highlight');
}

function updateTurnDisplay() {
    const currentName = currentPlayer === 'X' ? player1Name : player2Name;
    const currentSymbol = currentPlayer;
    currentTurnSpan.textContent = `${currentName}'s turn (${currentSymbol})`;

    // Highlight active player in scoreboard
    document.getElementById('score-p1').classList.toggle('active-player', currentPlayer === 'X');
    document.getElementById('score-p2').classList.toggle('active-player', currentPlayer === 'O');
}

function updateScoreboard() {
    winsP1.textContent = scores.p1.wins;
    lossesP1.textContent = scores.p1.losses;
    winsP2.textContent = scores.p2.wins;
    lossesP2.textContent = scores.p2.losses;
}

function resetBoard() {
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = Array(9).fill('');
    winningCells = [];
    resultMessage.style.display = 'none';
    playAgainBtn.style.display = 'none';

    // Remove highlights
    document.getElementById('score-p1').classList.remove('winner-highlight');
    document.getElementById('score-p2').classList.remove('winner-highlight');

    updateTurnDisplay();
    createBoard();
}

function newPlayers() {
    // Reset everything and go back to setup
    scores = { p1: { wins: 0, losses: 0 }, p2: { wins: 0, losses: 0 } };
    resetBoard();
    setupScreen.style.display = 'block';
    gameScreen.style.display = 'none';
}

function resetScores() {
    scores = { p1: { wins: 0, losses: 0 }, p2: { wins: 0, losses: 0 } };
    updateScoreboard();
}

// Initialize empty board on load (will be hidden behind setup screen)
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