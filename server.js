const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Game rooms
let waitingPlayer = null;
let games = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', (username) => {
        socket.username = username;
        console.log(`${username} joined`);

        if (waitingPlayer) {
            // Start a new game
            const gameId = `${waitingPlayer.id}-${socket.id}`;
            games[gameId] = {
                players: [waitingPlayer, socket],
                board: Array(9).fill(''),
                currentPlayer: 0,
                gameActive: true,
                winningCells: []
            };

            waitingPlayer.emit('gameStart', { gameId, player: 0, opponent: socket.username });
            socket.emit('gameStart', { gameId, player: 1, opponent: waitingPlayer.username });

            waitingPlayer = null;
        } else {
            waitingPlayer = socket;
            socket.emit('waiting');
        }
    });

    socket.on('makeMove', (data) => {
        const { gameId, index } = data;
        const game = games[gameId];
        if (!game || !game.gameActive) return;

        const playerIndex = game.players.indexOf(socket);
        if (playerIndex !== game.currentPlayer) return;

        if (game.board[index] !== '') return;

        game.board[index] = playerIndex === 0 ? 'X' : 'O';

        // Check for win
        if (checkWin(game.board, game.board[index])) {
            game.gameActive = false;
            game.winningCells = getWinningCells(game.board, game.board[index]);
            io.to(gameId).emit('gameUpdate', {
                board: game.board,
                currentPlayer: game.currentPlayer,
                gameActive: game.gameActive,
                winningCells: game.winningCells,
                winner: socket.username
            });
            return;
        }

        // Check for draw
        if (game.board.every(cell => cell !== '')) {
            game.gameActive = false;
            io.to(gameId).emit('gameUpdate', {
                board: game.board,
                currentPlayer: game.currentPlayer,
                gameActive: game.gameActive,
                winningCells: [],
                draw: true
            });
            return;
        }

        // Switch player
        game.currentPlayer = 1 - game.currentPlayer;
        io.to(gameId).emit('gameUpdate', {
            board: game.board,
            currentPlayer: game.currentPlayer,
            gameActive: game.gameActive,
            winningCells: []
        });
    });

    socket.on('resetGame', (gameId) => {
        const game = games[gameId];
        if (!game) return;

        game.board = Array(9).fill('');
        game.currentPlayer = 0;
        game.gameActive = true;
        game.winningCells = [];
        io.to(gameId).emit('gameReset', {
            board: game.board,
            currentPlayer: game.currentPlayer,
            gameActive: game.gameActive
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (waitingPlayer === socket) {
            waitingPlayer = null;
        }
        // Handle game cleanup if needed
        for (let gameId in games) {
            const game = games[gameId];
            if (game.players.includes(socket)) {
                const opponent = game.players.find(p => p !== socket);
                if (opponent) {
                    opponent.emit('opponentDisconnected');
                }
                delete games[gameId];
            }
        }
    });
});

function checkWin(board, player) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function getWinningCells(board, player) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winPatterns.find(pattern => pattern.every(index => board[index] === player)) || [];
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});