const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
let apple = { x: 320, y: 320 };

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++count < 4) return; // slows down the game
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wrap snake position
    if (snake.x < 0) snake.x = canvas.width - grid;
    if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

    // Draw snake
    ctx.fillStyle = 'lime';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid-1, grid-1);

        // Snake eats apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }

        // Snake collides with self
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
            }
        }
    });
}

// Arrow key controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
    if (e.key === 'ArrowUp' && snake.dy === 0) { snake.dx = 0; snake.dy = -grid; }
    if (e.key === 'ArrowRight' && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
    if (e.key === 'ArrowDown' && snake.dy === 0) { snake.dx = 0; snake.dy = grid; }
});

requestAnimationFrame(gameLoop);