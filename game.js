// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
  constructor(x, y, radius, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebote con bordes superior e inferior
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.speedY = -this.speedY;
    }
    // Rebote con bordes laterales
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.speedX = -this.speedX;
    }
  }
}

// Clase Paddle (Paleta)
class Paddle {
  constructor(x, y, width, height, color, isPlayerControlled = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isPlayerControlled = isPlayerControlled;
    this.speed = 5;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction) {
    if (direction === 'up' && this.y > 0) {
      this.y -= this.speed;
    } else if (direction === 'down' && this.y + this.height < canvas.height) {
      this.y += this.speed;
    }
  }

  autoMove(targetY) {
    if (targetY < this.y + this.height / 2) this.y -= this.speed;
    else if (targetY > this.y + this.height / 2) this.y += this.speed;
  }
}

// Clase Game
class Game {
  constructor() {
    // Crear 5 pelotas de distintos colores, tamaños y velocidades
    this.balls = [
      new Ball(400, 300, 10, 4, 3, "white"),
      new Ball(200, 150, 15, 3, 2, "cyan"),
      new Ball(600, 200, 8, -4, 3, "blue"),
      new Ball(300, 400, 20, 2, -3, "gray"),
      new Ball(500, 100, 5, -3, 2, "orange")
    ];

    this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, "green", true);
    this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, "red");

    this.keys = {};
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar pelotas
    this.balls.forEach(ball => ball.draw());

    // Dibujar paletas
    this.paddle1.draw();
    this.paddle2.draw();
  }

  update() {
    // Mover pelotas
    this.balls.forEach(ball => ball.move());

    // Movimiento de paleta del jugador
    if (this.keys['ArrowUp']) this.paddle1.move('up');
    if (this.keys['ArrowDown']) this.paddle1.move('down');

    // Movimiento automático de la segunda paleta (sigue a la primera bola)
    this.paddle2.autoMove(this.balls[0].y);
  }

  handleInput() {
    window.addEventListener('keydown', e => this.keys[e.key] = true);
    window.addEventListener('keyup', e => this.keys[e.key] = false);
  }

  run() {
    this.handleInput();
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  }
}

// Iniciar el juego
const game = new Game();
game.run();