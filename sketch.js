let unit;
const SIZE = parseInt(prompt('game size:'));
// const SIZE = 3;
const PWB = prompt('play against bot:') == 'yes';
// const PWB = false;

let board = [];
let peices = [];
let u;

let selected;
let player = 1;

function setup() {
    let dim = (windowWidth > windowHeight * 2) ? windowHeight * 1.6 : windowWidth * 0.8;
    createCanvas(dim, dim/2, P2D);

    unit = height / 20;
    u = (unit * 18.5) / SIZE;


    for (let i = 0; i < SIZE; i++) {
        board[i] = [];
        peices[i] = [];
        for (let j = 0; j < SIZE; j++) {
            peices[i][j] = {
                color: i,
                number: j + 1,
            }
        }
    }

    if (PWB && SIZE % 2 == 1) {
        let p = floor(SIZE / 2);
        makeMove(p, p, p, p);
    }
}

function draw() {
    background(100);
    stroke(0);
    line(height, 0, height, height);

    drawBoard();
    drawPeices();
}

function drawBoard() {
    noStroke();
    fill(50);
    rect(unit / 2, unit / 2, unit * 19, unit * 19, unit*3/4);

    fill(100);
    let u = (unit * 18.5) / SIZE;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let x = unit + u * i;
            let y = unit + u * j;
            rect(x, y, u - unit / 2, u - unit/2, unit/2);
            if (board[i][j] != undefined) drawDie(x, y, board[i][j]);
        }
    }
}

function drawPeices() {
    translate(height, 0);

    noStroke();
    fill(50);
    rect(unit / 2, unit / 2, unit * 19, unit * 19, unit*3/4);

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let x = unit + u * i;
            let y = unit + u * j;

            fill((selected != undefined && selected.x == i && selected.y == j) ? 0 : 100);
            rect(x, y, u - unit / 2, u - unit / 2, unit / 2);

            if (peices[i][j] != undefined) drawDie(x, y, peices[i][j]);
        }
    }
}

function drawDie(x, y, die) {
    push();
    translate(x, y);
    colorMode(HSB, 100);
    fill(100/SIZE * die.color, 70, 100);
    colorMode(RGB, 255);

    rect(unit/4, unit/4, u - unit, u - unit, unit/2);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(u * 0.6);
    text(die.number, u/2 - unit/4, u/2 - unit/4);

    pop();
}

function makeMove(c, n, x, y) {
    if (board[x][y] != undefined) return false;

    let check = true;
    for (let i = max(0, x-1); i <= min(SIZE-1,x + 1); i++) {
        for (let j = max(0, y-1); j <= min(SIZE-1, y+1); j++) {
            if (i != x && j != y) continue;

            let curr = board[i][j];
            if (curr == undefined) continue;

            if (curr.color != c && curr.number != n + 1) {
                check = false;
                break;
            }
        }
        if (!check) {
            break;
        }
    }

    if (!check) return false;

    board[x][y] = peices[c][n];
    peices[c][n] = undefined;

    return true;
}

function makeCompMove(c, n, x, y) {
    makeMove(SIZE-c-1, SIZE-n - 1, SIZE-x - 1, SIZE-y - 1);
}

function mousePressed() {
    if (mouseX < height) boardClick(mouseX, mouseY);
    else peicesClick(mouseX - height, mouseY);
}

function boardClick(x, y) {
    if (selected == undefined) return;

    let bx = floor(x / u);
    let by = floor(y / u);

    if (bx >= SIZE || by >= SIZE) return;

    let sx = selected.x;
    let sy = selected.y;

    if (makeMove(sx, sy, bx, by)){
        selected = undefined;
        if (PWB) makeCompMove(sx, sy, bx, by);
        else player = player == 1 ? 2 : 1;

        document.getElementById('player').innerText = 'Player ' + player;
    }
}

function peicesClick(x, y) {
    selected = {
        x: floor(x / u),
        y: floor(y / u),
    }
}

