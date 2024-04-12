// //ball
// const ballRadius = 9
// //derecha-izquierda
// //velocity
// let posX = canvas.width/20
// //arriba- abajo
// let posY = 350
// let xDirection = 1
// let yDirection = -1

// function drawBall() {
// context.beginPath();
// //posición, radio, angulo inicio final
// context.arc(posX, posY, ballRadius, 0, Math.PI * 2);
// context.fillStyle = 'red';
// context.fill();
// context.closePath()
// // console.log('manolo')
// }

// function ballMove() {
//   posX += xDirection;
//   posY += yDirection
// }

// function collision() {
//   if ((posY - ballRadius) < 0) {
//     yDirection *= -1;
//   }

//   if ((posY + ballRadius) > canvas.height) {
//     yDirection *= -1;
//   }
//   if ((posX - ballRadius) < 0) {
//     xDirection *= -1;
//   }

//   if ((posX + ballRadius )> canvas.width) {
//     xDirection *= -1;
//   }

// }

// function draw() {
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   collision()
//  //drawBall()
//   ballMove()
//  // drawBricks()
//  // drawPaddle()
//  // paddMove()

//   //recursive function
//   window.requestAnimationFrame(draw)
// }
