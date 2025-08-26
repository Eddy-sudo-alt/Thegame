const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- Einfache Stats ---
let creepStats = { hp: 20, dmg: 2, speed: 1.5 };
let heroStats  = { hp: 100, dmg: 5, speed: 1 };

// --- Spielfiguren ---
class Unit {
  constructor(x, y, hp, dmg, speed, team, type) {
    this.x = x; this.y = y;
    this.hp = hp; this.maxHp = hp;
    this.dmg = dmg; this.speed = speed;
    this.team = team; // "A" oder "B"
    this.type = type; // "creep" oder "hero"
    this.size = type==="hero" ? 18 : 10;
  }
  draw() {
    ctx.fillStyle = (this.team === "A") ? "cyan" : "orange";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();

    // HP-Bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x-15, this.y-this.size-8, 30, 4);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x-15, this.y-this.size-8, 30*(this.hp/this.maxHp), 4);
  }
  update() {
    this.x += (this.team==="A" ? this.speed : -this.speed);
  }
}

let units = [];
function spawnWave() {
  // Creeps
  units.push(new Unit(50,150, creepStats.hp, creepStats.dmg, creepStats.speed, "A","creep"));
  units.push(new Unit(550,150, creepStats.hp, creepStats.dmg, creepStats.speed, "B","creep"));
  // Helden
  if (Math.random()<0.3) {
    units.push(new Unit(50,200, heroStats.hp, heroStats.dmg, heroStats.speed, "A","hero"));
    units.push(new Unit(550,100, heroStats.hp, heroStats.dmg, heroStats.speed, "B","hero"));
  }
}
setInterval(spawnWave, 3000);

// Kampf-Logik
function fight(u1,u2) {
  u1.hp -= u2.dmg;
  u2.hp -= u1.dmg;
}

// --- Upgrade Funktionen ---
function upgradeCreeps() {
  creepStats.hp += 5;
  creepStats.dmg += 1;
  alert("Creeps verbessert!");
}
function upgradeHero() {
  heroStats.hp += 20;
  heroStats.dmg += 2;
  alert("Held verbessert!");
}

// --- Loop ---
function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Update + Draw
  for (let u of units) {
    u.update();
    u.draw();
  }

  // Kämpfe prüfen
  for (let i=0; i<units.length; i++) {
    for (let j=i+1; j<units.length; j++) {
      let a = units[i], b = units[j];
      if (a && b && a.team!==b.team) {
        let dx = a.x-b.x, dy=a.y-b.y;
        if (Math.hypot(dx,dy) < a.size+b.size) {
          fight(a,b);
        }
      }
    }
  }

  // Tote entfernen
  units = units.filter(u => u.hp>0 && u.x>0 && u.x<canvas.width);

  requestAnimationFrame(gameLoop);
}
gameLoop();