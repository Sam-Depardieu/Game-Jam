const { show, genItem, initSnake, moveSnake } = require('./snake.js');

const rows = 17;
const cols = 20;
// Crée le tableau rows x cols rempli de '0' (chaînes)
const map = Array.from({ length: rows }, () => Array(cols).fill('0'));

// Initialise le snake et la première pomme
const snake = initSnake(map, 3);
let [pv, ph] = genItem(map); map[pv][ph] = '2';

let score = 0;
let dir = 'right';
const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Configure stdin pour capter les flèches
process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', (key) => {
  if (key === '\u0003') {
    cleanupAndExit();
  }
  if (key === '\u001B[A' && dir !== opposite['up']) dir = 'up';
  if (key === '\u001B[B' && dir !== opposite['down']) dir = 'down';
  if (key === '\u001B[D' && dir !== opposite['left']) dir = 'left';
  if (key === '\u001B[C' && dir !== opposite['right']) dir = 'right';
});

function cleanupAndExit() {
  try { process.stdin.setRawMode(false); } catch (e) {}
  try { process.stdin.pause(); } catch (e) {}
  console.clear();
  show(map);
  console.log('Bye — Final score:', score);
  process.exit();
}

console.clear();
show(map);
console.log('Score:', score);

const TICK = 200; // ms
const tick = setInterval(() => {
  const res = moveSnake(map, snake, dir);
  if (res === false) {
    clearInterval(tick);
    cleanupAndExit();
    console.log('Game over — collision !');
    return;
  }
  if (res === 'eat') {
    score++;
    const [v,h] = genItem(map);
    map[v][h] = '2';
  }
  console.clear();
  show(map);
  console.log('Score:', score);
}, TICK);