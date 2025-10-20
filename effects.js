// Simple canvas effects: floating hearts + falling petals
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d', { alpha: true });
let W = 0, H = 0, running = true;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.floor(innerWidth * dpr);
  H = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();

// Utilities
const rand = (a,b)=>a+Math.random()*(b-a);
const TAU = Math.PI*2;

// Petal particles
class Petal {
  constructor() {
    this.reset(true);
  }
  reset(fromTop=false) {
    this.x = rand(-50, innerWidth+50);
    this.y = fromTop ? rand(-120,-20) : rand(-20, innerHeight+20);
    this.size = rand(10, 20);
    this.speed = rand(15, 35)/60;   // px per frame
    this.swing = rand(0.5, 1.6);
    this.angle = rand(0, TAU);
    this.rot = rand(-0.03, 0.03);
    this.tint = `rgba(255, ${Math.floor(rand(150,210))}, ${Math.floor(rand(200,235))}, ${rand(0.35,0.65)})`;
  }
  step() {
    this.y += this.speed * 60/60;
    this.x += Math.sin(this.angle)*this.swing;
    this.angle += 0.02;
    this.rot += 0.002;
    if (this.y > innerHeight + 40) this.reset(true);
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    const w = this.size, h = this.size*0.6;
    // Draw petal shape: two arcs merging
    ctx.fillStyle = this.tint;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-w*0.4, -h*0.8, -w, -h*0.1, -w*0.2, h*0.9);
    ctx.bezierCurveTo(0, h*1.2, w*0.2, h*0.9, w*0.2, h*0.1);
    ctx.bezierCurveTo(w*0.9, -h*0.5, w*0.2, -h*0.9, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Floating hearts
class Heart {
  constructor() { this.reset(); }
  reset() {
    this.x = rand(0, innerWidth);
    this.y = rand(innerHeight*0.5, innerHeight+80);
    this.size = rand(10, 20);
    this.speed = rand(18, 30)/60;
    this.osc = rand(0.6, 1.4);
    this.phase = rand(0, TAU);
    this.alpha = rand(0.2, 0.5);
    this.color = `rgba(255,120,170,${this.alpha})`;
  }
  step() {
    this.y -= this.speed * 60/60;
    this.x += Math.sin(this.phase += 0.02) * this.osc;
    if (this.y < -40) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    const s = this.size;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // heart path
    ctx.moveTo(0, s*0.35);
    ctx.bezierCurveTo(s*1.2, -s*0.4, s*0.8, -s*1.3, 0, -s*0.6);
    ctx.bezierCurveTo(-s*0.8, -s*1.3, -s*1.2, -s*0.4, 0, s*0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

const petals = Array.from({length: 30}, ()=>new Petal());
const hearts  = Array.from({length: 18}, ()=>new Heart());

function tick() {
  if (!running) return requestAnimationFrame(tick);
  ctx.clearRect(0,0,innerWidth,innerHeight);
  petals.forEach(p=>{ p.step(); p.draw(); });
  hearts.forEach(h=>{ h.step(); h.draw(); });
  requestAnimationFrame(tick);
}
tick();

// Toggle button
document.getElementById('toggleFx')?.addEventListener('click', ()=>{
  running = !running;
  if (running) tick();
  else ctx.clearRect(0,0,innerWidth,innerHeight);
});
