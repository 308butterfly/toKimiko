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

// document.onload(function(){
//     const upBtn = document.getElementById("upBtn").onclick()
// })

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

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

canvas.addEventListener("touchend", (e) => {
  let touchEndX = e.changedTouches[0].screenX;
  let touchEndY = e.changedTouches[0].screenY;

  let dxSwipe = touchEndX - touchStartX;
  let dySwipe = touchEndY - touchStartY;

  if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
    // Horizontal swipe
    if (dxSwipe > 30) { // swipe right
      dx = speed; dy = 0; moving = true;
    } else if (dxSwipe < -30) { // swipe left
      dx = -speed; dy = 0; moving = true;
    }
  } else {
    // Vertical swipe
    if (dySwipe > 30) { // swipe down
      dy = speed; dx = 0; moving = true;
    } else if (dySwipe < -30) { // swipe up
      dy = -speed; dx = 0; moving = true;
    }
  }
});

// Stop movement if finger is lifted without swiping
canvas.addEventListener("touchcancel", () => {
  dx = 0; dy = 0; moving = false; frame = 0;
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
