var trex, trex_running, trex_collided,PLAY=0,END=1,gameState=PLAY;
var ground, invisibleGround, groundImage,gameOver_img,restart_img,gameOver,restart;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,canvas;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOver_img= loadImage("gameOver.png");
  restart_img = loadImage("restart.png")
  
  die = loadSound("die.mp3")
  checkpoint = loadSound("checkPoint.mp3")
  jump = loadSound("jump.mp3")
}

function setup() {
  canvas = createCanvas(600, 200);
  canvas.shapeColor="blue"
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.velocityX=5
  


  
  invisibleGround = createSprite(2000,190,400000000,10);
  invisibleGround.shapeColor="green"
 
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver=createSprite(200,100,20,20)
  gameOver.addImage("over",gameOver_img)
 gameOver.visible=false;
  gameOver.scale=0.5
 
  restart=createSprite(0,140)
  restart.addImage("restart",restart_img);
 restart.visible=false;
  restart.scale=0.5;
  
  
}

function draw() {

  background(180);
  
  textSize(24);
  strokeWeight(1);
  fill("yellow")
  stroke("yellow")
  textFont("Georgia")
  text("Score: "+ score, camera.position.x+100,50);
  
  
  
  if(gameState === PLAY){
    
    score = score + Math.round(getFrameRate()/60);
    
    if(keyDown("space")&&trex.y>=159) {
    trex.velocityY = -15;
      jump.play();
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (invisibleGround.x < 0){
    invisibleGround.x = invisibleGround.width/2;
  }
      trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
       gameState=END
      trex.velocityX=0
      die.play();
      gameOver.x= camera.position.x+100
      restart.x=camera.position.x+100
       }
  
  } 
  else if(gameState===END){
     gameOver.visible=true;
    restart.visible=true;
    invisibleGround.velocityX=0
    trex.velocityY=0
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    trex.changeAnimation("collided",trex_collided);
   
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
    reset();
    trex.velocityX=5  
    }
  
  }
 
  if(score % 100 === 0 && score>0){
    checkpoint.play();
  }
  
  camera.position.x=trex.x
 

  drawSprites();

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.x=camera.position.x+random(500,600)
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
  
  
    cloud.lifetime = 200;
    

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
  
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.x=camera.position.x+random(500,800)
  
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
       
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
 
    obstaclesGroup.add(obstacle);
  }
}



function reset(){
 gameState=PLAY;
gameOver.visible=false;
restart.visible=false;
obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;

}