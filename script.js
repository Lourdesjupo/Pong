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

    return collideX && collideY;
  }

  //recibe collider
  //retorna la dirección de la colisión {x: boolean, y: boolean, inside: boolean}
  //inside: this está dentro de collider.
  collisionDirections(collider) {
    const tc1 = this.coor1;
    const tc2 = this.coor2;
    const cc1 = collider.coor1;
    const cc2 = collider.coor2;

    if (
      tc1.x <= cc1.x &&
      cc1.x <= tc2.x &&
      tc2.x <= cc2.x &&
      tc1.y <= cc1.y &&
      cc1.y <= tc2.y &&
      tc2.y <= cc2.y
    ) {
      //caso a
      return { x: true, y: true, inside: false };
    }
    if (
      tc1.x <= cc1.x &&
      cc1.x <= tc2.x &&
      tc2.x <= cc2.x &&
      cc1.y <= tc1.y &&
      tc1.y <= tc2.y &&
      tc2.y <= cc2.y
    ) {
      //caso b
      return { x: true, y: false, inside: false };
    }
    if (
      tc1.x <= cc1.x &&
      cc1.x <= tc2.x &&
      tc2.x <= cc2.x &&
      cc1.y <= tc1.y &&
      tc1.y <= cc2.y &&
      cc2.y <= tc2.y
    ) {
      //caso c
      return { x: true, y: true, inside: false };
    }
    if (
      cc1.x <= tc1.x &&
      tc1.x <= tc2.x &&
      tc2.x <= cc2.x &&
      cc1.y <= tc1.y &&
      tc1.y <= cc2.y &&
      cc2.y <= tc2.y
    ) {
      //caso d
      return { x: false, y: true, inside: false };
    }
    if (
      cc1.x <= tc1.x &&
      tc1.x <= cc2.x &&
      cc2.x <= tc2.x &&
      cc1.y <= tc1.y &&
      tc1.y <= cc2.y &&
      cc2.y <= tc2.y
    ) {
      //caso e
      return { x: true, y: true, inside: false };
    }
    if (
      cc1.x <= tc1.x &&
      tc1.x <= cc2.x &&
      cc2.x <= tc2.x &&
      cc1.y <= tc1.y &&
      tc1.y <= tc2.y &&
      tc2.y <= cc2.y
    ) {
      //caso f
      return { x: true, y: false, inside: false };
    }
    if (
      cc1.x <= tc1.x &&
      tc1.x <= cc2.x &&
      cc2.x <= tc2.x &&
      tc1.y <= cc1.y &&
      cc1.y <= tc2.y &&
      tc2.y <= cc2.y
    ) {
      //caso g
      return { x: true, y: true, inside: false };
    }
    if (
      cc1.x <= tc1.x &&
      tc1.x <= tc2.x &&
      tc2.x <= cc2.x &&
      tc1.y <= cc1.y &&
      cc1.y <= tc2.y &&
      tc2.y <= cc2.y
    ) {
      //caso h
      return { x: false, y: true, inside: false };
    }
    if (
      cc1.x <= tc1.x &&
      tc1.x <= tc2.x &&
      tc2.x <= cc2.x &&
      cc1.y <= tc1.y &&
      tc1.y <= tc2.y &&
      tc2.y <= cc2.y
    ) {
      //caso i
      //inside: this está dentro de collider.
      return { x: true, y: true, inside: true };
    }
    return { x: false, y: false, inside: false };
  }
}
class Ball {
  constructor(context, color = 'red', radius = 9) {
    this.context = context;
    this.position = new Coordinate(0, 0);
    this.direction = new Vector(0, 0);
    this.color = color;
    this.radius = radius;
  }
  changeXDirection() {
    this.direction.x *= -1;
  }
  changeYDirection() {
    this.direction.y *= -1;
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
  move() {
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;
  }
  setDirection(vector) {
    this.direction = vector;
  }
  //Si colisiona con paredes
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
    this.move();
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
    this.context.fillStyle = this.color;
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

  setPosition(coords) {
    this.position = coords;
  }
  setDirection(vector) {
    this.direction = vector;
  }
  move() {
    //hazlo solo si no me salgo de la pantalla si me salgo me paro
    this.position.x += this.direction.x
    this.position.y += this.direction.y;
  }
  draw() {
    this.move();
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
  //Cambio de dirección
  checkCollisions() {
    if (this.position.y < 0) {
      this.direction.y *= -1;
    }
    if (this.position.y + this.height > canvas.height) {
      this.direction.y *= -1;
    }
  
  }
//Raqueta tiene un collider
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
class Thing {
  constructor(context, color) {
    this.context = context;
    this.position = new Coordinate(0, 0);
    this.direction = new Vector(0, 0);
    this.color = color;
    this.parts = [
      new Ball(context,color, 20),
      new Raquet(context, color, 10,  40),
    ];

    // this.parts[0].move(new Coordinate(0,0))
    // this.parts[1].move(new Coordinate(10/2*-1, 20))
    this.move(new Coordinate(0,0))
  }

  move(coords) {
    this.parts[0].move(new Coordinate(coords.x, coords.y));
    this.parts[1].move(new Coordinate(coords.x + ((this.parts[1].width / 2) * -1), coords.y + this.parts[0].radius));
  }
  setDirection(vector) {
    this.direction = vector;
  }
  animate() {
  }
  draw() {
    this.animate();
    this.checkCollisions();
    this.parts.forEach((part)=>{
      part.draw()
    })

  }
  checkCollisions() {
  }
  getCollider() {
    //@TODO 
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
    this.player1 = new Raquet(context, 'blue', 10, 40);
    this.player2 = new Raquet(context, 'green');
    this.gol1 = new Raquet(context, '#423453', 10, 300);
    this.gol2 = new Raquet(context, '#423453', 10, 300);
    //this.thing1 = new Thing(context,"purple")
    
  }
  start() {
    this.ball.moveToPosition(
      new Coordinate(canvas.width / 2, canvas.height / 2)
    );
    this.ball.setDirection(new Vector(1, -1));
    this.player1.setPosition(new Coordinate(40, 20));
    this.player1.setDirection(new Vector(0, 0));
    this.player2.setPosition(new Coordinate(650, 210));
    this.player2.setDirection(new Vector(0, 0));

    this.gol1.setPosition(new Coordinate(0, (canvas.height - 300) / 2));
    this.gol2.setPosition(
      new Coordinate(canvas.width - 10, (canvas.height - 300) / 2)
    );


    //this.thing1.setPosition(new Coordinate(200,100))

    this.renderLoop();
  }
  renderLoop() {
    const ballCollider = this.ball.getCollider();
    const player1Collider = this.player1.getCollider();
    const player2Collider = this.player2.getCollider();
    this.score1 = 0;
    //Raqueta tiene un collider, (pelota también) y esto indica si chocan o no.
    //entre ellos
    if (ballCollider.collide(player1Collider)) {
      const collision = ballCollider.collisionDirections(player1Collider);
      if (collision.x && !collision.y) {
        this.ball.changeXDirection();
      }
      if (!collision.x && collision.y) {
        this.ball.changeYDirection();
      }
      if (collision.x && collision.y) {
        this.ball.changeXDirection();
        this.ball.changeYDirection();
      }
    }
    if (ballCollider.collide(player2Collider)) {
      const collision = ballCollider.collisionDirections(player2Collider);
      if (collision.x && !collision.y) {
        this.ball.changeXDirection();
      }
      if (!collision.x && collision.y) {
        this.ball.changeYDirection();
      }
      if (collision.x && collision.y) {
        this.ball.changeXDirection();
        this.ball.changeYDirection();
      }
    }
    if (this.gol1.getCollider().collide(ballCollider)) {
      this.score1 = this.score1 += 1;
      document.getElementById('score_player1').textContent = this.score1; 
      console.log('gol player1');
      console.log();
    }
    if (this.gol2.getCollider().collide(ballCollider)) {
      console.log('gol player2');
    }

    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.ball.draw();
    this.player1.draw();
    this.player2.draw();
    this.gol1.draw();
    this.gol2.draw();
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
  scoreP1() {

   return 1

  }
  scoreP2() {
  return 1


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


let raquetSpeed = 3
document.getElementById('speedUpRaquet').addEventListener('click', () => {
  raquetSpeed+= 0.2
});
document.getElementById('speedDownRaquet').addEventListener('click', () => {
  raquetSpeed -= 0.2;
  raquetSpeed = raquetSpeed < 1 ? 1 : raquetSpeed 
});

document.getElementById('score_player1').textContent = score1 
console.log(score1 + game.scoreP1());

addEventListener('keydown', (event) => {
  event.key === 'w' &&
    game.player1.setDirection(new Vector(0, -raquetSpeed));
  event.key === 's' &&
    game.player1.setDirection(new Vector(0, raquetSpeed));
  event.key === 'ArrowUp' &&
    game.player2.setDirection(new Vector(0, -raquetSpeed));
  event.key === 'ArrowDown' &&
    game.player2.setDirection(new Vector(0, raquetSpeed));
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


// const b1 = new Collider(new Coordinate(4,6), new Coordinate(6,7));
// const b2 = new Collider(new Coordinate(9, 8), new Coordinate(11, 9));
// const b3 = new Collider(new Coordinate(3, 6), new Coordinate(12, 8));
// const b4 = new Collider(new Coordinate(7, 7), new Coordinate(8, 8));
// const b5 = new Collider(new Coordinate(22, 7), new Coordinate(23, 8));
// const b6 = new Collider(new Coordinate(0, 7), new Coordinate(1, 8));
// const raquet = new Collider(new Coordinate(5, 5), new Coordinate(10, 10));
// console.log('testCollider B1:',b1.collide(raquet))
// console.log('testCollider B2:', b2.collide(raquet));
// console.log('testCollider B3:', b3.collide(raquet));
// console.log('testCollider B4:', b4.collide(raquet));
// console.log('testCollider B5:', b5.collide(raquet));
// console.log('testCollider B6:', b6.collide(raquet));