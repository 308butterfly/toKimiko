// const canvas = document.getElementById("spriteCanvas");
// const ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false; // keep pixel art sharp

// const sprite = new Image();
// sprite.src = "./assets/images/watermelon3Char.png";

// let frame = 0;

// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(
//         sprite,
//         frame * 32, 0, 32, 32,   // source frame
//         0, 0, 128, 128           // draw scaled up 4×
//     );
//     frame = (frame + 1) % 8;
//     setTimeout(draw, 200);
// }

// sprite.onload = draw;

const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");

// Load sprite sheet (assume it's 10 frames wide, 1 row tall, 32x32 per frame)
const sprite = new Image();
sprite.src = "./assets/images/watermelon3Char.png";

let frame = 0;
let frameCount = 10; // number of frames
let frameWidth = 32;
let frameHeight = 32;
let frameDelay = 5; // controls animation speed
let frameTick = 0;

let x = 200, y = 200; // character position
let speed = 2;
let moving = false;
let dx = 0, dy = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") { dy = -speed; dx = 0; moving = true; }
  if (e.key === "ArrowDown") { dy = speed; dx = 0; moving = true; }
  if (e.key === "ArrowLeft") { dx = -speed; dy = 0; moving = true; }
  if (e.key === "ArrowRight") { dx = speed; dy = 0; moving = true; }
});

document.addEventListener("keyup", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    dx = 0; dy = 0; moving = false;
    frame = 0; // reset to idle frame
  }
});

function update() {
  if (moving) {
    x += dx;
    y += dy;

    frameTick++;
    if (frameTick >= frameDelay) {
      frame = (frame + 1) % frameCount;
      frameTick = 0;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw character at current frame
  ctx.drawImage(
    sprite,
    frame * frameWidth, 0, frameWidth, frameHeight, // source
    x, y, frameWidth, frameHeight // destination
  );
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

sprite.onload = () => {
  gameLoop();
};
