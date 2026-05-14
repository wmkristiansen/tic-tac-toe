# Tic Tac Toe Online

A real-time multiplayer Tic Tac Toe game built with Node.js, Express, Socket.io, HTML, CSS, and JavaScript.

## Features

- **Online Multiplayer**: Play against other players in real-time
- **User Sign-in**: Enter a username to join games
- **Automatic Matchmaking**: Get paired with waiting players
- **Real-time Updates**: Moves are synchronized instantly
- **Win Detection**: Highlights winning combinations
- **Draw Detection**: Handles tied games
- **Reset Functionality**: Start a new game with the same opponent
- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: Hover effects and winning cell animations

## How to Run

### Prerequisites
- Node.js installed on your system

### Installation
1. Clone the repository or download the files
2. Navigate to the project directory
3. Run `npm install` to install dependencies

### Starting the Server
1. Run `npm start` to start the server
2. Open your browser and go to `http://localhost:3000`
3. Enter a username and click "Join Game"
4. Wait for another player to join, or open another browser tab/window to test locally

## How to Play

1. Enter your username and join a game
2. Wait for an opponent to be matched
3. Take turns placing X's and O's on the 3x3 grid
4. The first player to get three in a row wins
5. If the board fills without a winner, it's a draw
6. Click "Reset Game" to play again with the same opponent

## Files

- `server.js`: Node.js server with Socket.io for real-time communication
- `index.html`: Main HTML structure with login and game UI
- `style.css`: Styling for all game elements
- `script.js`: Client-side game logic and Socket.io integration
- `package.json`: Node.js dependencies and scripts

## Deployment

### GitHub Pages (Frontend Only)
The frontend is automatically deployed to GitHub Pages on every push to main branch.

**Note**: GitHub Pages serves static files only. For full multiplayer functionality, deploy the backend separately (see below).

To enable GitHub Pages:
1. Go to your repository settings
2. Scroll to "Pages" section
3. Select "GitHub Actions" as source
4. The site will be available at `https://wmkristiansen.github.io/tic-tac-toe/`

### Backend Deployment
For multiplayer to work, deploy the server to a platform that supports Node.js:

#### Heroku (Recommended)
1. Create a Heroku account
2. Install Heroku CLI
3. Run:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```
4. Update `config.js` with your Heroku app URL
5. Push the updated config to trigger a new Pages build

#### Other Options
- Vercel
- Railway
- Render
- DigitalOcean App Platform

Update the `serverUrl` in `config.js` to point to your deployed server.