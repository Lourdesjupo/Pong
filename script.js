const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 400;

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
}
//direction
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  increase(f) {
    this.x *= f;
    this.y *= f;
  }

  decrease(f) {
    this.x /= f;
    this.y /= f;
  }
}
class RaquetPos {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  // move(x, y) {
  //   this.x += x;
  //   this.y += y;
  // }
}
class Ball {
  constructor(context) {
    this.context = context;
    this.position = new Coordinate(0, 0);
    this.direction = new Vector(0, 0);
    this.radius = 9;
  }
  moveToPosition(coords) {
    this.position = coords;
    console.log('move to:', this.position, coords);
  }
  ballMove() {
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;
  }
  setDirection(vector) {
    this.direction = vector;
  }
  checkCollisions() {
    if (this.position.y - this.radius < 0) {
      this.direction.y *= -1;
    }
    if (this.position.y + this.radius > canvas.height) {
      this.direction.y *= -1;
    }
    if (this.position.x - this.radius < 0) {
      this.direction.x *= -1;
    }
    if (this.position.x + this.radius > canvas.width) {
      this.direction.x *= -1;
    }
  }
  draw() {
    this.ballMove();
    this.checkCollisions();
    this.context.beginPath();
    //posición, radio, angulo inicio final
    // console.log('ball',this.position.x, this.position.y, this.radius);
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = 'red';
    this.context.fill();
    this.context.closePath();
  }
  speedUp(speedFactor) {
    this.direction.increase(speedFactor);
  }
  speedDown(speedFactor) {
    this.direction.decrease(speedFactor);
  }
}
class Raquet {
  constructor(context, color) {
    this.context = context;
    this.position = new Coordinate(0, 0);
    this.direction = new Vector(0, 0);
    this.raquetWidth = 10;
    this.raquetHeight = 40;
    this.color = color;
  }
  move(coords) {
    this.position = coords;
  }
  setDirection(vector) {
    this.direction = vector;
  }
  raquetMove() {
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;
  }
  draw() {
    this.raquetMove();
    this.checkCollisions();
    //console.log('raquet', raquetP);
    this.context.beginPath();
    //posición, radio, angulo inicio final
    // console.log('ball',this.position.x, this.position.y, this.radius);
    this.context.fillStyle = this.color;
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.raquetWidth,
      this.raquetHeight
    );
    this.context.fill();
    this.context.closePath();
  }
  checkCollisions() {
    if (this.position.y < 0) {
      this.direction.y *= -1;
    }
    if (this.position.y + this.raquetHeight > canvas.height) {
      this.direction.y *= -1;
    }
  }
}
class Game {
  constructor(context) {
    this.context = context;
    this.ball = new Ball(context);
    this.player1 = new Raquet(context, 'blue');
    this.player2 = new Raquet(context, 'green');
  }
  start() {
    this.ball.moveToPosition(new Coordinate(300, 340));
    this.ball.setDirection(new Vector(1, -1));
    this.player1.move(new Coordinate(40, 20));
    this.player1.setDirection(new Vector(0, 0));
    this.player2.move(new Coordinate(650, 320));
    this.player2.setDirection(new Vector(0, 0));
    this.renderLoop();
  }
  renderLoop() {
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.ball.draw();
    this.collision();
    this.player1.draw();
    this.player2.draw();
    window.requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
  speedUpBall() {
    this.ball.speedUp(1.1);
  }
  speedDownBall() {
    this.ball.speedDown(1.1);
  }

  leftOfBrick() {
    if (this.ball.position.x + this.ball.radius < this.player1.position.x) {
      return true;
    }
  }
  rightOfBrick() {
    if (
      this.ball.position.x + this.ball.radius >
      this.player1.position.x + this.player1.raquetWidth
    ) {
      return true;
    }
  }

  inTheBrick() {
    if (
      (this.ball.position.x - this.ball.radius > this.player1.position.x &&
        this.ball.position.x - this.ball.radius <
          this.player1.position.x + this.player1.raquetWidth) ||
      (this.ball.position.x - this.ball.radius > this.player1.position.x &&
        this.ball.position.x + this.ball.radius <
          this.player1.position.x + this.player1.raquetWidth)
    ) {
      return true;
    }
  }
  touchLeft() {
    if (this.ball.position.x - this.ball.radius === this.player1.position.x) {
      return true;
    }
  }
  touchRigth() {
    if (
      this.ball.position.x - this.ball.radius ===
      this.player1.position.x + this.player1.raquetWidth
    ) {
      return true;
    }
  }
  collision() {
    if (this.touchRigth() || this.inTheBrick()) {
      // console.log(this.touchRigth() || this.inTheBrick());
      console.log(this.inTheBrick());
      this.ball.direction.x *= -1;
    } else if (this.inTheBrick()) {
       console.log(this.inTheBrick());
       
      this.ball.direction.x *= -1;
    }
  }
}

const game = new Game(context);
game.start();

document.getElementById('speedUp').addEventListener('click', () => {
  game.speedUpBall();
});
document.getElementById('speedDown').addEventListener('click', () => {
  game.speedDownBall();
});

addEventListener('keydown', (event) => {
  event.key === 'w' && game.player1.setDirection(new Vector(0, -1));
  event.key === 's' && game.player1.setDirection(new Vector(0, 1));
  event.key === 'ArrowUp' && game.player2.setDirection(new Vector(0, -1));
  event.key === 'ArrowDown' && game.player2.setDirection(new Vector(0, 1));
});

addEventListener('keyup', (event) => {
  event.key === 'w' && game.player1.setDirection(new Vector(0, 0));
  event.key === 's' && game.player1.setDirection(new Vector(0, 0));
  event.key === 'ArrowUp' && game.player2.setDirection(new Vector(0, 0));
  event.key === 'ArrowDown' && game.player2.setDirection(new Vector(0, 0));
});

//console.log('last:',new Coordinate(300, 340));
//leftOfBrick()
//rightOfBrick()
//inTheBrick()
//touchLeft()
//touchRigth()
// 1.if(this.ball.position.x + this.ball.radius < this.player1.position.x)
// 2.if(this.ball.position.x + this.ball.radius > this.player1.position.x + this.player1.raquetWidth)
// 3.if(this.ball.position.x - this.ball.radius === this.player1.position.x + this.player1.raquetWidth)
// 4.if(this.ball.position.x  === this.player1.position.x )
// 5.if(this.ball.position.x - this.ball.radius > this.player1.position.x  && this.ball.position.x - this.ball.radius < this.player1.position.x + this.player1.raquetWidth )
