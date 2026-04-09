const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const W = canvas.width;
const H = canvas.height;

// --- Config ---
const GRAVITY = 0.4;
const FLAP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2.5;
const PIPE_INTERVAL = 1800; // ms

// --- State ---
let bird, pipes, score, bestScore, state, lastPipeTime, animFrame;

const STATES = { IDLE: 0, PLAYING: 1, DEAD: 2 };

function resetGame() {
  bird = {
    x: 80,
    y: H / 2,
    vy: 0,
    width: 34,
    height: 24,
    rotation: 0,
  };
  pipes = [];
  score = 0;
  bestScore = bestScore || 0;
  state = STATES.IDLE;
  lastPipeTime = 0;
}

function flap() {
  if (state === STATES.IDLE) {
    state = STATES.PLAYING;
  }
  if (state === STATES.PLAYING) {
    bird.vy = FLAP;
  }
  if (state === STATES.DEAD) {
    resetGame();
    state = STATES.IDLE;
  }
}

// Input
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') flap();
});
canvas.addEventListener('click', flap);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });

function spawnPipe() {
  const minTop = 60;
  const maxTop = H - PIPE_GAP - 60;
  const topH = Math.random() * (maxTop - minTop) + minTop;
  pipes.push({
    x: W,
    topH,
    bottomY: topH + PIPE_GAP,
    passed: false,
  });
}

function checkCollision() {
  const bx = bird.x - bird.width / 2 + 4;
  const by = bird.y - bird.height / 2 + 4;
  const bw = bird.width - 8;
  const bh = bird.height - 8;

  if (by <= 0 || by + bh >= H) return true;

  for (const p of pipes) {
    const inX = bx + bw > p.x && bx < p.x + PIPE_WIDTH;
    const inTop = by < p.topH;
    const inBottom = by + bh > p.bottomY;
    if (inX && (inTop || inBottom)) return true;
  }
  return false;
}

function update(ts) {
  if (state === STATES.PLAYING) {
    // Bird physics
    bird.vy += GRAVITY;
    bird.y += bird.vy;
    bird.rotation = Math.min(Math.max(bird.vy * 3, -25), 70);

    // Spawn pipes
    if (ts - lastPipeTime > PIPE_INTERVAL) {
      spawnPipe();
      lastPipeTime = ts;
    }

    // Move pipes & score
    for (const p of pipes) {
      p.x -= PIPE_SPEED;
      if (!p.passed && p.x + PIPE_WIDTH < bird.x) {
        p.passed = true;
        score++;
        if (score > bestScore) bestScore = score;
      }
    }
    pipes = pipes.filter(p => p.x + PIPE_WIDTH > 0);

    // Collision
    if (checkCollision()) {
      state = STATES.DEAD;
    }
  }
}

// --- Drawing helpers ---
function drawSky() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#70c5ce');
  grad.addColorStop(1, '#c9e8ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawGround() {
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, H - 20, W, 20);
  ctx.fillStyle = '#5dbe58';
  ctx.fillRect(0, H - 28, W, 10);
}

function drawPipe(p) {
  // Top pipe
  ctx.fillStyle = '#3ab54a';
  ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topH);
  // Top pipe cap
  ctx.fillStyle = '#2d8f3b';
  ctx.fillRect(p.x - 4, p.topH - 20, PIPE_WIDTH + 8, 20);

  // Bottom pipe
  ctx.fillStyle = '#3ab54a';
  ctx.fillRect(p.x, p.bottomY, PIPE_WIDTH, H - p.bottomY);
  // Bottom pipe cap
  ctx.fillStyle = '#2d8f3b';
  ctx.fillRect(p.x - 4, p.bottomY, PIPE_WIDTH + 8, 20);
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate((bird.rotation * Math.PI) / 180);

  // Body
  ctx.fillStyle = '#f9d71c';
  ctx.beginPath();
  ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.fillStyle = '#f0a500';
  ctx.beginPath();
  ctx.ellipse(-4, 4, 10, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(8, -5, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(10, -5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(11, -6, 1, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#f07800';
  ctx.beginPath();
  ctx.moveTo(14, -1);
  ctx.lineTo(22, 2);
  ctx.lineTo(14, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.strokeText(score, W / 2, 70);
  ctx.fillText(score, W / 2, 70);
}

function drawOverlay(title, sub) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';

  ctx.font = 'bold 52px Arial';
  ctx.strokeText(title, W / 2, H / 2 - 40);
  ctx.fillText(title, W / 2, H / 2 - 40);

  ctx.font = '22px Arial';
  ctx.strokeText(sub, W / 2, H / 2 + 10);
  ctx.fillText(sub, W / 2, H / 2 + 10);
}

function drawDeadScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, W, H);

  // Score box
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 120, H / 2 - 120, 240, 200, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Game Over', W / 2, H / 2 - 78);

  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, W / 2, H / 2 - 38);
  ctx.fillText(`Best: ${bestScore}`, W / 2, H / 2 - 8);

  ctx.fillStyle = '#f9d71c';
  ctx.strokeStyle = '#d4a800';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 80, H / 2 + 30, 160, 44, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.fillText('Play Again', W / 2, H / 2 + 59);
}

// --- Main loop ---
function loop(ts) {
  update(ts);

  drawSky();
  pipes.forEach(drawPipe);
  drawGround();
  drawBird();

  if (state === STATES.PLAYING || state === STATES.DEAD) {
    drawScore();
  }

  if (state === STATES.IDLE) {
    drawOverlay('Flappy Bird', 'Press Space / Tap to start');
  }

  if (state === STATES.DEAD) {
    drawDeadScreen();
  }

  animFrame = requestAnimationFrame(loop);
}

resetGame();
animFrame = requestAnimationFrame(loop);
