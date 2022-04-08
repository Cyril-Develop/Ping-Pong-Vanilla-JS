/** @type {HTMLCanvasElement} */ 

//************ Initialisation Canvas ************/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1400;
canvas.height = 800;

const btnRejouer = document.getElementById('btnRejouer');
btnRejouer.addEventListener('click', () => {
    location.reload()
})

//************ Lancement du jeu ************/
function startGame(){
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.textAlign = 'center'
    ctx.fillText(`Appuyer sur 'espace' pour commencer`, canvas.width/2, 300);
}

//************ Variables ************/
let gameSpeed = 7;
let velocity = 5;
let countScoreP1 = 0;
let countScoreP2 = 0;
let gameOver = false;
//Choix entre 3 et -3
let choseValue = Math.random() <= 0.5 ? 3 : -3
let keysPressed = {
    rightPressed : false,
    leftPressed : false,
    dPressed : false,
    qPressed : false,
    spaceBarPressed : false
}

//************ Gestionnaire de touches ************/
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == 'ArrowRight') {
        keysPressed.rightPressed = true;
    }
    else if(e.key == 'ArrowLeft') {
        keysPressed.leftPressed = true;
    }
    else if(e.key == 'd') {
        keysPressed.dPressed = true;
    }
    else if(e.key == 'q') {
        keysPressed.qPressed = true;
    }
};
function keyUpHandler(e) {
    BG_GAME.play();
    if(e.key == 'ArrowRight') {
        keysPressed.rightPressed = false;
    }
    else if(e.key == 'ArrowLeft') {
        keysPressed.leftPressed = false;
    }
    else if(e.key == 'd') {
        keysPressed.dPressed = false;
    }
    else if(e.key == 'q') {
        keysPressed.qPressed = false;
    }
    else if(e.key == ' ') {
        keysPressed.spaceBarPressed = true;
        START_GAME.play();
    }
};

//************ Paddle player One ************/
let PADDLE_P1_WIDTH = 250;
let PADDLE_P1_HEIGHT = 20;
let PADDLE_MARGIN_BOTTOM = 20

let paddlePlayerOne = {
    positionX : (canvas.width - PADDLE_P1_WIDTH ) / 2,
    positionY : (canvas.height - PADDLE_P1_HEIGHT) - PADDLE_MARGIN_BOTTOM
}
//************ Dessine Paddle player One ************/
function drawPaddlePlayerOne(){
    ctx.beginPath()
    ctx.shadowColor = 'blue';
    ctx.strokeStyle = 'blue'
    ctx.fillStyle = 'blue';
    ctx.shadowBlur = 20;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 10;
    ctx.rect(paddlePlayerOne.positionX, paddlePlayerOne.positionY, PADDLE_P1_WIDTH, PADDLE_P1_HEIGHT);
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
}
//************ Deplace Paddle player One ************/
function movePaddlePlayerOne(){

    if(keysPressed.dPressed && paddlePlayerOne.positionX < canvas.width - PADDLE_P1_WIDTH){
        paddlePlayerOne.positionX += gameSpeed
    }
    if(keysPressed.qPressed && paddlePlayerOne.positionX > 0){
        paddlePlayerOne.positionX -= gameSpeed
    }
}

//************ Paddle player Two ************/
let PADDLE_P2_WIDTH = 250;
let PADDLE_P2_HEIGHT = 20;


let paddlePlayerTwo = {
    positionX : (canvas.width - PADDLE_P2_WIDTH ) / 2,
    positionY :  PADDLE_P2_HEIGHT
}
//************ Dessine Paddle player Two ************/
function drawPaddlePlayerTwo(){
    ctx.beginPath()
    ctx.shadowColor = 'red';
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'red'
    ctx.shadowBlur = 20;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 10;
    ctx.rect(paddlePlayerTwo.positionX, paddlePlayerTwo.positionY, PADDLE_P2_WIDTH, PADDLE_P2_HEIGHT);
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
}

//************ Deplace Paddle player Two ************/
function movePaddlePlayerTwo(){

    if(keysPressed.rightPressed && paddlePlayerTwo.positionX < canvas.width - PADDLE_P2_WIDTH){
        paddlePlayerTwo.positionX += gameSpeed
    }
    if(keysPressed.leftPressed && paddlePlayerTwo.positionX > 0){
        paddlePlayerTwo.positionX -= gameSpeed
    }
}
//************ Ball ************/
let ball = {
    radius : 10,
    positionX : paddlePlayerOne.positionX + PADDLE_P1_WIDTH / 2,
    positionY : (canvas.height - 10) / 2,
    dx : 3 * (Math.random() * 2 - 1),
    dy : choseValue 
}
//************ Dessine Ball ************/
function drawBall(){
    ctx.beginPath()
    ctx.shadowColor = 'white';
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 10;
    ctx.arc(ball.positionX, ball.positionY + ball.radius, ball.radius, 0, 2 * Math.PI);
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
}
//************ Deplace Ball ************/
function moveBall(){
    if(keysPressed.spaceBarPressed){
        ball.positionX += ball.dx;
        ball.positionY += ball.dy
    } 
    else {
        startGame()
     }
    

    //************ Collision mur ************/
    if(ball.positionX + ball.radius > canvas.width || ball.positionX < 0 + ball.radius) {
        WALL_COLLISION.play()
        ball.dx *= -1
    }
    //************ Collision en haut ************/
    if(ball.positionY < 0) {
        GOAL_P1.play()
        countScoreP1++;
        document.getElementById('scoreJ1').innerHTML = countScoreP1;
        resetP1Win();
    }
    //************ Collision en bas ************/
    if(ball.positionY > canvas.height - ball.radius) {
        GOAL_P2.play()
        countScoreP2++;
        document.getElementById('scoreJ2').innerHTML = countScoreP2;
        resetP2Win();
    }
    endGame()
}
//************ Reset si joueur 1 gagne ************/
function resetP1Win(){
    ball = {
        radius : 10,
        positionX : paddlePlayerTwo.positionX + PADDLE_P2_WIDTH / 2,
        positionY : paddlePlayerTwo.positionY,
        dx : 3 * (Math.random() * 2 - 1),
        dy : 3
    },
    paddlePlayerOne = {
        positionX : (canvas.width - PADDLE_P1_WIDTH ) / 2,
        positionY : (canvas.height - PADDLE_P1_HEIGHT) - PADDLE_MARGIN_BOTTOM
    }
    paddlePlayerTwo = {
        positionX : (canvas.width - PADDLE_P2_WIDTH ) / 2,
        positionY :  PADDLE_P2_HEIGHT
    }
};
//************ Reset si joueur 2 gagne ************/
function resetP2Win(){
    ball = {
        radius : 10,
        positionX : paddlePlayerOne.positionX + PADDLE_P1_WIDTH / 2,
        positionY : paddlePlayerOne.positionY - PADDLE_MARGIN_BOTTOM,
        dx : 3 * (Math.random() * 2 - 1),
        dy : -3
    },
    paddlePlayerOne = {
        positionX : (canvas.width - PADDLE_P1_WIDTH ) / 2,
        positionY : (canvas.height - PADDLE_P1_HEIGHT) - PADDLE_MARGIN_BOTTOM
    }
    paddlePlayerTwo = {
        positionX : (canvas.width - PADDLE_P2_WIDTH ) / 2,
        positionY :  PADDLE_P2_HEIGHT
    }
}
//************ Collision Paddle ************/

function collisionWidthPaddleP1(){
    //************ Collision Ball / Joueur 1 ************/
    if(ball.positionX + ball.radius > paddlePlayerOne.positionX && 
    ball.positionX - ball.radius < paddlePlayerOne.positionX + PADDLE_P1_WIDTH &&
    ball.positionY + ball.radius > paddlePlayerOne.positionY){
        PADDLE_P1_COLLISION.play()
        //************ Trigonométrie P1 ************/

        let collidePointP1 = ball.positionX - (paddlePlayerOne.positionX + PADDLE_P1_WIDTH / 2);
        collidePointP1 = collidePointP1 / (PADDLE_P1_WIDTH / 2);

        let anglecollidePointP1 = collidePointP1 * Math.PI / 3;

        ball.dx = velocity  * Math.sin(anglecollidePointP1)
        ball.dy = -velocity * Math.cos(anglecollidePointP1)
    }
};
function collisionWidthPaddleP2(){
    //************ Collision Ball / Joueur 2 ************/
    if(ball.positionX + ball.radius > paddlePlayerTwo.positionX && 
        ball.positionX - ball.radius < paddlePlayerTwo.positionX + PADDLE_P2_WIDTH &&
        ball.positionY - ball.radius < paddlePlayerTwo.positionY){
            PADDLE_P2_COLLISION.play()
            //************ Trigonométrie P2 ************/
        let collidePointP2 = ball.positionX - (paddlePlayerTwo.positionX + PADDLE_P2_WIDTH / 2);
        collidePointP2 = collidePointP2 / (PADDLE_P2_WIDTH / 2);

        let anglecollidePointP2 = collidePointP2 * Math.PI / 3;

        ball.dx = velocity * Math.sin(anglecollidePointP2)
        ball.dy = velocity * Math.cos(anglecollidePointP2)
        }
};

// Fin de partie
function endGame(){
        if(countScoreP1 >= 10 || countScoreP2 >= 10) {
        BG_GAME.pause();
        GAME_OVER.play();
        gameOver = true;
        btnRejouer.classList.add('active');
    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawBall();
    moveBall();
    drawPaddlePlayerOne();
    drawPaddlePlayerTwo();
    movePaddlePlayerOne();
    movePaddlePlayerTwo();
    collisionWidthPaddleP1();
    collisionWidthPaddleP2();

    if(!gameOver)requestAnimationFrame(animate)
};
animate()