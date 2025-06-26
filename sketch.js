let pattern;
let gameStart = false;
let gameEnd = false;
let score = 0;

p5playConfig = {
  showMenu: false

function preload() {
  treeImg = loadImage("tree.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  birdImg = loadImage("bird.png");
  back = loadImage("back.png");
  font = loadFont("font.ttf");
}

function setup() {
  createCanvas(400, 225).parent("canvas-container");
  pixelDensity(2);
  pattern = random([0, 1, 2]);
  noStroke();
  noFill();
  textFont(font);
  textAlign(CENTER, CENTER);
  setupNewGame();
}

function setupNewGame() {
  score = 0;
  walls = new Group();
  walls.static = true;
  walls.fill = color(0, 0, 0, 0);

  bird = new Sprite(width / 2 - 50, height / 2, 28, 25);
  bird.fill = color(0, 0, 0, 0);
  // bird.stroke = color(0);

  tree1 = new Sprite(100 - 22.5 - 11.25, height / 2, 45, height);
  tree1.static = true;
  tree1.stroke = color(0, 0, 0, 0);
  tree1.fill = color(0, 0, 0, 0);
  tree1.pattern = random([0, 1, 2]);
  tree1.blocks = [
    new walls.Sprite(tree1.x, 0, 45, 45),
    new walls.Sprite(tree1.x, 0, 45, 45),
  ];
  tree1.collider = "none";
  adjustBlockPosition(tree1);

  tree2 = new Sprite(300, height / 2, 45, height);
  tree2.static = true;
  tree2.stroke = color(0, 0, 0, 0);
  tree2.fill = color(0, 0, 0, 0);
  tree2.pattern = random([0, 1, 2]);
  tree2.blocks = [
    new walls.Sprite(tree2.x, 0, 45, 45),
    new walls.Sprite(tree2.x, 0, 45, 45),
  ];
  tree2.collider = "none";
  adjustBlockPosition(tree2);

  groundSprites = [];
  groundSprites[0] = new walls.Sprite(width / 6, height - 10, width / 3, 20);
  groundSprites[1] = new walls.Sprite(
    width / 6 + width / 3,
    height - 10,
    width / 3,
    20
  );
  groundSprites[2] = new walls.Sprite(
    width / 6 + width / 1.5,
    height - 10,
    width / 3,
    20
  );
  groundSprites[3] = new walls.Sprite(
    width / 6 + width / 1.5 + width / 3,
    height - 10,
    width / 3,
    20
  );
}

function mousePressed() {
  if (!gameStart) {
    gameStart = true;
    bird.vel.x = 2;
    world.gravity.y = 8;
  } else {
    bird.vel.y -= 4.3;
    if(bird.vel.y<-5) bird.vel.y = -4.5;
    if (!gameEnd) jump.play();

    if (gameEnd) {
      world.gravity.y = 0;
      gameEnd = false;
      gameStart = false;
      bird.remove();
      walls.removeAll();
      tree1.remove();
      tree2.remove();
      setupNewGame();
      loop();
      mouseIsPressed = false;
    }
  }
}

function draw() {
  image(back, 0, 0, width, height);
  camera.x = bird.x;
  push();
  translate(width / 2, 0);
  translate(-bird.x, 0);

  showTree(tree1.x - 45 / 2, tree1.pattern);
  showTree(tree2.x - 45 / 2, tree2.pattern);
  if (bird.x - tree1.x > 222.5) {
    tree1.x = bird.x + 245;
    tree1.pattern = random([0, 1, 2]);
    adjustBlockPosition(tree1);
    score++;
    bird.vel.x += 0.1;
  }
  if (bird.x - tree2.x > 222.5) {
    tree2.x = bird.x + 245;
    tree2.pattern = random([0, 1, 2]);
    adjustBlockPosition(tree2);
    score++;
    bird.vel.x += 0.1;
  }
  push();
  translate(bird.x, bird.y);
  rotate(bird.rotation);
  imageMode(CENTER);
  image(birdImg, 0, -8, 40, 48);
  pop();

  pop();
  //ground
  fill("#DED895");
  rect(0, height - 20, width, 20);
  stroke(20);
  strokeWeight(2);
  line(0, height - 20, innerWidth, height - 20);
  stroke("#D5F880");
  line(0, height - 18, innerWidth, height - 18);
  stroke("#558022");
  line(0, height - 16, innerWidth, height - 16);

  noStroke();
  noFill();
  if (gameStart) {
    let rotation = map(bird.vel.y, -4, 4, -60, 90);
    if (rotation < -90) rotation = -89;
    if (rotation > 90) rotation = 89;
    bird.rotation = lerp(bird.rotation, rotation, 0.1);
    //
    for (g_ of groundSprites) {
      if (bird.x - g_.x > width / 2 + width / 6)
        g_.x = bird.x + width / 2 + width / 6;
    }
    //game end
    if (bird.collides(walls) || bird.y < -20) {
      die.play();
      textSize(16);
      stroke(20);
      fill(255);
      text("Restart!", width / 2, 150);
      noFill();
      noStroke();
      noLoop();
      gameEnd = true;
    }
    textSize(36);
    stroke(20);
    fill(255);
    text(score, width / 2, 20);
    noFill();
    noStroke();
  } else {
    textSize(16);
    stroke(20);
    fill(255);
    text("tap to start!", width / 2, 150);
    noFill();
    noStroke();
  }
}

function showTree(x, ran) {
  for (let i = 0; i < 5; i++) {
    let y = i * 45;
    rect(x, y, 45, 45);
    if (i == 4) {
      drawTrunk(x, y, "trunk");
    } else {
      if (i == ran || i == ran + 1) {
        drawTrunk(x, y, "open");
      } else {
        drawTrunk(x, y, "block");
      }
    }
  }
}

function adjustBlockPosition(tree) {
  tree.blocks[0].x = tree.x;
  tree.blocks[1].x = tree.x;
  switch (tree.pattern) {
    case 0:
      tree.blocks[0].y = 45 * 2 + 22.5;
      tree.blocks[1].y = 45 * 3 + 22.5;
      break;
    case 1:
      tree.blocks[0].y = 45 * 0 + 22.5;
      tree.blocks[1].y = 45 * 3 + 22.5;
      break;
    case 2:
      tree.blocks[0].y = 45 * 0 + 22.5;
      tree.blocks[1].y = 45 * 1 + 22.5;
      break;
  }
}

function drawTrunk(x, y, type = "bush") {
  if (type == "bush" || type == "open") {
    if (type == "bush") return;
  }
  //trunk;
  noStroke();
  fill(70, 35, 25);
  rect(x + 17, y, 4, 45);
  rect(x + 25, y, 4, 45);
  fill(159, 89, 52);
  rect(x + 21, y, 4, 45);
  noFill();
  if (type == "trunk") return;
  if (type == "block") image(treeImg.get(0, 48, 200, 194), x - 3, y, 51, 45);
}
