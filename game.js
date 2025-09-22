// --- Configuração Inicial ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações da grade
const GRID_SIZE = 20;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;

canvas.width = GRID_SIZE * GRID_WIDTH;
canvas.height = GRID_SIZE * GRID_HEIGHT;

// Cores Neon
const NEON_GREEN = '#39ff14';
const NEON_PINK = '#ff00ff';

// Configurações do jogo
const FPS = 10; // Velocidade da cobra
let score = 0;
let gameOver = false;
let highScore = localStorage.getItem('neonSerpentHighScore') || 0;

// --- Estado do Jogo ---
let snake = {
    body: [
        { x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 } // Posição inicial
    ],
    direction: { x: 1, y: 0 } // Começa movendo para a direita
};

let food = {
    x: 0,
    y: 0
};

// --- Funções do Jogo ---

// Gera uma nova posição para a comida
function spawnFood() {
    while (true) {
        food.x = Math.floor(Math.random() * GRID_WIDTH);
        food.y = Math.floor(Math.random() * GRID_HEIGHT);

        let is_on_snake = snake.body.some(segment => segment.x === food.x && segment.y === food.y);
        if (!is_on_snake) {
            break;
        }
    }
}

// Lida com a entrada do teclado
function handleInput(e) {
    const key = e.key;
    if ((key === 'ArrowUp' || key.toLowerCase() === 'w') && snake.direction.y === 0) {
        snake.direction = { x: 0, y: -1 };
    } else if ((key === 'ArrowDown' || key.toLowerCase() === 's') && snake.direction.y === 0) {
        snake.direction = { x: 0, y: 1 };
    } else if ((key === 'ArrowLeft' || key.toLowerCase() === 'a') && snake.direction.x === 0) {
        snake.direction = { x: -1, y: 0 };
    } else if ((key === 'ArrowRight' || key.toLowerCase() === 'd') && snake.direction.x === 0) {
        snake.direction = { x: 1, y: 0 };
    }
}

// Desenha a cobra e a comida
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.body.forEach(segment => {
        ctx.fillStyle = NEON_GREEN;
        ctx.shadowColor = NEON_GREEN;
        ctx.shadowBlur = 10;
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    ctx.shadowBlur = 0;

    ctx.fillStyle = NEON_PINK;
    ctx.shadowColor = NEON_PINK;
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'white';
    ctx.font = '24px "Courier New", Courier, monospace';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.textAlign = 'right';
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 10, 25);
    ctx.textAlign = 'left';

    if (gameOver) {
        ctx.fillStyle = NEON_PINK;
        ctx.font = '50px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'white';
        ctx.font = '20px "Courier New", Courier, monospace';
        ctx.fillText('Pressione qualquer tecla para reiniciar', canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
    }
}

// Atualiza o estado do jogo
function update() {
    if (gameOver) return;

    const head = { x: snake.body[0].x + snake.direction.x, y: snake.body[0].y + snake.direction.y };
    snake.body.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.body.pop();
    }

    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver = true;
    }

    for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
            gameOver = true;
        }
    }

    if (gameOver && score > highScore) {
        highScore = score;
        localStorage.setItem('neonSerpentHighScore', highScore);
    }
}

function restartGame() {
    snake = {
        body: [{ x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 }],
        direction: { x: 1, y: 0 }
    };
    score = 0;
    gameOver = false;
    spawnFood();
}

// --- Game Loop Principal ---
function gameLoop() {
    update();
    draw();
}

// Inicia o jogo
spawnFood();
setInterval(gameLoop, 1000 / FPS);

document.addEventListener('keydown', (e) => {
    if (gameOver) {
        restartGame();
    } else {
        handleInput(e);
    }
});