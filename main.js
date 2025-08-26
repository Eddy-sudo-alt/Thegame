const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Hintergrund laden
const bg = new Image();
bg.src = "lane.PNG"; // dein Bild als Hintergrund

// Basiswerte (alle Creeps starten mit 1/1/1)
let creepStats = {
  A: { hp:1, dmg:1, spd:1 },
  B: { hp:1, dmg:1, spd:1 }
};

class Creep {
  constructor(path, team, color) {
    this.team = team;
    this.path = [...path]; // Wegpunkte
    this.x = this.path[0].x;
    this.y = this.path[0].y;
    this.target = 1; // nächster Wegpunkt
    let s = creepStats[team];
    this.hp = s.hp;
    this.maxHp = s.hp;
    this.dmg = s.dmg;
    this.spd = s.spd;
    this.color = color;
    this.size = 12;
  }

  update() {
    if(this.target >= this.path.length) return;

    let tx = this.path[this.target].x;
    let ty = this.path[this.target].y;
    let dx = tx - this.x, dy = ty - this.y;
    let dist = Math.hypot(dx,dy);

    if(dist < this.spd) {
      this.x = tx; this.y = ty;
      this.target++;
    } else {
      this.x += this.spd * dx/dist;
      this.y += this.spd * dy/dist;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();

    // HP-Bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x-15, this.y-this.size-8, 30, 4);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x-15, this.y-this.size-8, 30*(this.hp/this.maxHp), 4);
  }
}

// Lane-Pfad (unten links → oben rechts)
let lanePathA = [
  {x:60, y:260},  // Spawn Team A
  {x:300, y:160}, // Mitte
  {x:540, y:60}   // Base B
];
let lanePathB = [...lanePathA].reverse();

// Alle Creeps im Spiel
let creeps = [];

// Wellen-Spawner (alle 3 Sekunden 1 Creep pro Seite)
setInterval(() => {
  creeps.push(new Creep(lanePathA,"A","cyan"));
  creeps.push(new Creep(lanePathB,"B","orange"));
}, 3000);

// Upgrade-Funktion
function upgradeCreeps(team) {
  creepStats[team].hp += 1;
  creepStats[team].dmg += 1;
  creepStats[team].spd += 1;
  alert(`Team ${team} Creeps aufgewertet!`);
}

// Kampflogik
function fight(a,b) {
  a.hp -= b.dmg;
  b.hp -= a.dmg;
}

// Game Loop
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  creeps.forEach(c => { c.update(); c.draw(ctx); });

  // Kämpfe prüfen
  for(let i=0;i<creeps.length;i++) {
    for(let j=i+1;j<creeps.length;j++) {
      let a = creeps[i], b = creeps[j];
      if(a.team!==b.team) {
        let d = Math.hypot(a.x-b.x,a.y-b.y);
        if(d < a.size+b.size) {
          fight(a,b);
        }
      }
    }
  }

  // Tote entfernen
  creeps = creeps.filter(c => c.hp > 0);

  requestAnimationFrame(loop);
}
bg.onload = loop;