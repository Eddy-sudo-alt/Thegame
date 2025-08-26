const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Basiswerte
let stats = {
  small: { hp:1, dmg:1, spd:1 },
  big:   { hp:1, dmg:1, spd:1 }
};

class Unit {
  constructor(type, team) {
    this.type = type; // "small" oder "big"
    this.team = team; // "A" oder "B"
    let s = stats[type];
    this.hp = s.hp;
    this.dmg = s.dmg;
    this.spd = s.spd;
    this.size = (type==="small") ? 10 : 20;
    this.x = (team==="A") ? 50 : canvas.width-50;
    this.y = (type==="small") ? 100 : 200;
  }

  draw() {
    ctx.fillStyle = (this.team==="A") ? "cyan" : "orange";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    // HP-Bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x-15, this.y-this.size-8, 30, 4);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x-15, this.y-this.size-8, 30*(this.hp/stats[this.type].hp), 4);
  }

  update() {
    this.x += (this.team==="A" ? this.spd : -this.spd);
  }
}

let units = [];

// Spawns
function spawnWave() {
  // kleine Kreise
  units.push(new Unit("small","A"));
  units.push(new Unit("small","B"));
  // große Kreise
  units.push(new Unit("big","A"));
  units.push(new Unit("big","B"));
}
setInterval(spawnWave, 4000);

// Upgrade
function upgradeUnit(type) {
  stats[type].hp += 1;
  stats[type].dmg += 1;
  stats[type].spd += 1;
  alert(`${type==="small"?"Kleine":"Große"} Kreise verbessert!`);
}

// Kampf-Logik
function fight(a,b) {
  a.hp -= b.dmg;
  b.hp -= a.dmg;
}

// Simpler Prioritäts-Kampf
function checkFights() {
  for (let type of ["small","big"]) {
    let groupA = units.filter(u => u.team==="A" && u.type===type);
    let groupB = units.filter(u => u.team==="B" && u.type===type);
    for (let i=0; i<Math.min(groupA.length,groupB.length); i++) {
      if(groupA[i] && groupB[i]) fight(groupA[i],groupB[i]);
    }
  }
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Update + Draw
  for (let u of units) {
    u.update();
    u.draw();
  }

  // Kämpfen lassen
  checkFights();

  // Tote entfernen
  units = units.filter(u => u.hp>0 && u.x>0 && u.x<canvas.width);

  requestAnimationFrame(gameLoop);
}
gameLoop();