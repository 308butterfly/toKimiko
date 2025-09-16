const canvas = document.getElementById("spriteCanvas");
const ctx = canvas.getContext("2d");

const sprite = new Image();
sprite.src = "./assets/images/watermelon3Char.png";

let frame = 0;
let frameCount = 10;
let frameWidth = 32;
let frameHeight = 32;
let frameDelay = 5;
let frameTick = 0;

let scale = 1;
let speed = 2;
let x = 0, y = 0;
let dx = 0, dy = 0;
let moving = false;

function resizeCanvas() {
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // center sprite
    x = (canvas.width - frameWidth * scale) / 2;
    y = (canvas.height - frameHeight * scale) / 2;
}



window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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


// --- Swipe handling ---
let touchStartX = 0, touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;

    let dxSwipe = touchEndX - touchStartX;
    let dySwipe = touchEndY - touchStartY;

    if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
        // horizontal swipe
        if (dxSwipe > 30) {
            if (dx === -speed) {
                // currently moving left, swipe right = stop
                dx = 0; moving = false; frame = 0;
            } else {
                dx = speed; dy = 0; moving = true;
            }
        } else if (dxSwipe < -30) {
            if (dx === speed) {
                // currently moving right, swipe left = stop
                dx = 0; moving = false; frame = 0;
            } else {
                dx = -speed; dy = 0; moving = true;
            }
        }
    } else {
        // vertical swipe
        if (dySwipe > 30) {
            if (dy === -speed) {
                // currently moving up, swipe down = stop
                dy = 0; moving = false; frame = 0;
            } else {
                dy = speed; dx = 0; moving = true;
            }
        } else if (dySwipe < -30) {
            if (dy === speed) {
                // currently moving down, swipe up = stop
                dy = 0; moving = false; frame = 0;
            } else {
                dy = -speed; dx = 0; moving = true;
            }
        }
    }
}, { passive: false });


canvas.addEventListener("touchcancel", () => {
    dx = 0; dy = 0; moving = false; frame = 0;
});

// --- Game Loop ---
function update() {
    if (moving) {
        x += dx;
        y += dy;

        // clamp inside screen
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > canvas.width - frameWidth * scale) x = canvas.width - frameWidth * scale;
        if (y > canvas.height - frameHeight * scale) y = canvas.height - frameHeight * scale;

        frameTick++;
        if (frameTick >= frameDelay) {
            frame = (frame + 1) % frameCount;
            frameTick = 0;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        sprite,
        frame * frameWidth, 0, frameWidth, frameHeight,
        x, y, frameWidth * scale, frameHeight * scale
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
