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
class Collider {
  constructor(coor1, coor2) {
    this.coor1 = new Coordinate(
      Math.min(coor1.x, coor2.x),
      Math.min(coor1.y, coor2.y)
    );
    this.coor2 = new Coordinate(
      Math.max(coor1.x, coor2.x),
      Math.max(coor1.y, coor2.y)
    );
  }
  collide(collider) {
    let collideX = false;
    let collideY = false;
    if (
      (this.coor1.x <= collider.coor1.x &&
        collider.coor1.x <= this.coor2.x &&
        this.coor2.x <= collider.coor2.x) ||
      (collider.coor1.x <= this.coor1.x &&
        this.coor1.x <= collider.coor2.x &&
        collider.coor2.x <= this.coor2.x) ||
      (collider.coor1.x <= this.coor1.x &&
        this.coor1.x <= this.coor2.x &&
        this.coor2.x <= collider.coor2.x) ||
      (this.coor1.x <= collider.coor1.x &&
        collider.coor1.x <= collider.coor2.x &&
        collider.coor2.x <= this.coor2.x)
    ) {
      collideX = true;
    }
    if (
      (this.coor1.y <= collider.coor1.y &&
        collider.coor1.y <= this.coor2.y &&
        this.coor2.y <= collider.coor2.y) ||
      (collider.coor1.y <= this.coor1.y &&
        this.coor1.y <= collider.coor2.y &&
        collider.coor2.y <= this.coor2.y) ||
      (collider.coor1.y <= this.coor1.y &&
        this.coor1.y <= this.coor2.y &&
        this.coor2.y <= collider.coor2.y) ||
      (this.coor1.y <= collider.coor1.y &&
        collider.coor1.y <= collider.coor2.y &&
        collider.coor2.y <= this.coor2.y)
    ) {
      collideY = true;
    }
  
    return collideX && collideY
  }
}
class Ball {
  constructor(context) {
    this.context = context;
    this.position = new Coordinate(0, 0);
    this.direction = new Vector(0, 0);
    this.radius = 9;
  }
  changeXDirection() {
    this.direction.x *= -1
  }
  getCollider() {
    return new Collider(
      new Coordinate(
        this.position.x - this.radius,
        this.position.y - this.radius
      ),
      new Coordinate(
        this.position.x + this.radius,
        this.position.y + this.radius
      )
    );
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
  constructor(context, color,width=10,height=40) {
    this.context = context;
    this.position = new Coordinate(0, 0);
    this.direction = new Vector(0, 0);
    this.width = width;
    this.height = height;
    this.color = color;
  }

  move(coords) {
    this.position = coords;
  }
  setDirection(vector) {
    this.direction = vector;
  }
  raquetMove() {
    //hazlo solo si no me salgo de la pantalla si me salgo me paro
    this.position.x += this.direction.x
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
      this.width,
      this.height
    );
    this.context.fill();
    this.context.closePath();
  }
  checkCollisions() {
    if (this.position.y < 0) {
      this.direction.y *= -1;
    }
    if (this.position.y + this.height > canvas.height) {
      this.direction.y *= -1;
    }
  }
  getCollider() {

    return new Collider(
      new Coordinate(this.position.x, this.position.y),
      new Coordinate(
        this.position.x + this.width,
        this.position.y + this.height
      )
    );
  }
}
class Game {
  constructor(context) {
    this.context = context;
    this.ball = new Ball(context);
    this.player1 = new Raquet(context, 'blue');
    this.player2 = new Raquet(context, 'green');
    this.gol1 = new Raquet(context, '#282828', 10, 300);
    this.gol2 = new Raquet(context, '#282828', 10, 300);
  }
  start() {
    this.ball.moveToPosition(new Coordinate(canvas.width/2, canvas.height/2));
    this.ball.setDirection(new Vector(1, -1));
    this.player1.move(new Coordinate(40, 20));
    this.player1.setDirection(new Vector(0, 0));
    this.player2.move(new Coordinate(650, 320));
    this.player2.setDirection(new Vector(0, 0));

    this.gol1.move(new Coordinate(0, (canvas.height-300)/2));
    this.gol2.move(new Coordinate(canvas.width - 10, (canvas.height-300)/2));

    this.renderLoop();
  }
  renderLoop() {
    const ballCollider = this.ball.getCollider();
    const player1Collider = this.player1.getCollider();
    const player2Collider = this.player2.getCollider();

    if (ballCollider.collide(player1Collider)) {
      this.ball.changeXDirection();
    }
    if (ballCollider.collide(player2Collider)) {
      this.ball.changeXDirection();
    }
    if (this.gol1.getCollider().collide(ballCollider)) {
      console.log('gol player1')
    }
    if (this.gol2.getCollider().collide(ballCollider)) {
      console.log('gol player2')
    }

    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.ball.draw();
    this.player1.draw();
    this.player2.draw();
    this.gol1.draw()
    this.gol2.draw()
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
  event.key === 'w' && game.player1.setDirection(new Vector(0, -10));
  event.key === 's' && game.player1.setDirection(new Vector(0, 10));
  event.key === 'ArrowUp' && game.player2.setDirection(new Vector(0, -1));
  event.key === 'ArrowDown' && game.player2.setDirection(new Vector(0, 1));
});

addEventListener('keyup', (event) => {
  event.key === 'w' && game.player1.setDirection(new Vector(0, 0));
  event.key === 's' && game.player1.setDirection(new Vector(0, 0));
  event.key === 'ArrowUp' && game.player2.setDirection(new Vector(0, 0));
  event.key === 'ArrowDown' && game.player2.setDirection(new Vector(0, 0));
});

//chequear si el estado de las teclas están apretadas o no si esta apretando los dos a la vez estate quieto.

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
// leftOfBrick() {
//   if (this.ball.position.x + this.ball.radius < this.player1.position.x) {
//     return true;
//   }
// }
// rightOfBrick() {
//   if (
//     this.ball.position.x + this.ball.radius >
//     this.player1.position.x + this.player1.raquetWidth
//   ) {
//     return true;
//   }
// }

// inTheBrick() {
//   if (
//     (this.ball.position.x - this.ball.radius > this.player1.position.x &&
//       this.ball.position.x - this.ball.radius <
//         this.player1.position.x + this.player1.raquetWidth) ||
//     (this.ball.position.x - this.ball.radius > this.player1.position.x &&
//       this.ball.position.x + this.ball.radius <
//         this.player1.position.x + this.player1.raquetWidth)
//   ) {
//     return true;
//   }
// }
// touchLeft() {
//   if (this.ball.position.x - this.ball.radius === this.player1.position.x) {
//     return true;
//   }
// }
// touchRigth() {
//   if (
//     this.ball.position.x - this.ball.radius ===
//     this.player1.position.x + this.player1.raquetWidth
//   ) {
//     return true;
//   }
// }
// collision() {
//   if (this.touchRigth() || this.inTheBrick()) {
//     // console.log(this.touchRigth() || this.inTheBrick());
//     console.log(this.inTheBrick());
//     this.ball.direction.x *= -1;
//   } else if (this.inTheBrick()) {
//      console.log(this.inTheBrick());

//     this.ball.direction.x *= -1;
//   }
// }


const b1 = new Collider(new Coordinate(4,6), new Coordinate(6,7));
const b2 = new Collider(new Coordinate(9, 8), new Coordinate(11, 9));
const b3 = new Collider(new Coordinate(3, 6), new Coordinate(12, 8));
const b4 = new Collider(new Coordinate(7, 7), new Coordinate(8, 8));
const b5 = new Collider(new Coordinate(22, 7), new Coordinate(23, 8));
const b6 = new Collider(new Coordinate(0, 7), new Coordinate(1, 8));
const raquet = new Collider(new Coordinate(5, 5), new Coordinate(10, 10));
console.log('testCollider B1:',b1.collide(raquet))
console.log('testCollider B2:', b2.collide(raquet));
console.log('testCollider B3:', b3.collide(raquet));
console.log('testCollider B4:', b4.collide(raquet));
console.log('testCollider B5:', b5.collide(raquet));
console.log('testCollider B6:', b6.collide(raquet));