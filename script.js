const T = {
    Dark: [
        [10, 10, 15],
        [25, 25, 35],
        [45, 45, 55],
        [230, 230, 230]
    ],

    Grama: [
        [4, 20, 4],
        [12, 45, 12],
        [18, 65, 18],
        [140, 200, 140]
    ],

    Oceano: [
        [0, 15, 40],
        [0, 45, 90],
        [0, 80, 130],
        [180, 230, 255]
    ],

    Lava: [
        [45, 8, 5],
        [100, 25, 15],
        [150, 45, 15],
        [255, 170, 80]
    ],

    Galaxia: [
        [8, 6, 30],
        [25, 18, 65],
        [50, 30, 95],
        [180, 140, 230]
    ],

    Neon: [
        [5, 8, 15],
        [10, 35, 45],
        [20, 55, 65],
        [120, 220, 220]
    ],

    Gelo: [
        [5, 18, 30],
        [25, 70, 95],
        [40, 100, 130],
        [160, 210, 225]
    ],

    Floresta: [
        [5, 18, 7],
        [15, 50, 20],
        [25, 75, 30],
        [130, 190, 135]
    ]
};


const D = {
    Normal: [13, 1],
    Insano: [25, 2]
};


const C = [
    '#00ff00',
    '#0096ff',
    '#ff00ff',
    '#ffff00',
    '#ff7800',
    '#ff0000',
    '#00ffff'
];


let theme = localStorage.snakeTheme || 'Grama';
let diff = localStorage.snakeDiff || 'Normal';
let rank = JSON.parse(localStorage.snakeRank || '[]');
let name = localStorage.snakeName || '';

let s = [];
let dir = 'RIGHT';
let next = 'RIGHT';
let food;
let rgb;
let rgbOn = false;
let grow = 0;
let score = 0;
let color = '';
let run = false;
let paused = false;
let start = 0;
let last = 0;


const $ = id => document.getElementById(id);
const cv = $('canvas');
const ctx = cv.getContext('2d');

$('name').value = name;


function col(a) {
    return `rgb(${a[0]},${a[1]},${a[2]})`;
}


function apply() {
    let t = T[theme];

    document.documentElement.style.setProperty('--bg', col(t[0]));
    document.documentElement.style.setProperty('--c1', col(t[1]));
    document.documentElement.style.setProperty('--c2', col(t[2]));
    document.documentElement.style.setProperty('--border', col(t[3]));
    document.documentElement.style.setProperty('--text', '#fff');

    $('theme').querySelector('i').textContent = theme;
    $('diff').querySelector('i').textContent = diff;
    $('dh').textContent = diff;
}


apply();


const N = 40;
const CELL = 22;
const W = N * CELL;


function resize() {
    let r = cv.getBoundingClientRect();
    let d = Math.min(devicePixelRatio || 1, 2);

    cv.width = r.width * d;
    cv.height = r.height * d;

    ctx.setTransform(d, 0, 0, d, 0, 0);
}


window.onresize = () => {
    resize();
    draw();
};


function rnd() {
    return {
        x: Math.floor(Math.random() * N),
        y: Math.floor(Math.random() * N)
    };
}


function occupied(p) {
    return s.some(q => q.x === p.x && q.y === p.y);
}


function spawn() {
    do {
        food = rnd();
    } while (occupied(food));
}


function spawnRgb() {
    do {
        rgb = rnd();
    } while (
        occupied(rgb) ||
        (rgb.x === food.x && rgb.y === food.y)
    );
}


function reset() {
    let c = Math.floor(N / 2);
    let r = Math.floor(N / 2);

    s = [
        { x: c, y: r },
        { x: c - 1, y: r },
        { x: c - 2, y: r }
    ];

    dir = next = 'RIGHT';
    grow = score = 0;

    color = C[Math.floor(Math.random() * C.length)];

    rgbOn = false;

    spawn();

    start = last = performance.now();
}


function setDir(d) {
    let o = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
    };

    if (o[dir] !== d) {
        next = d;
    }
}


window.onkeydown = e => {
    let k = e.key.toLowerCase();

    if (k === 'arrowup' || k === 'w') {
        setDir('UP');
    }

    if (k === 'arrowdown' || k === 's') {
        setDir('DOWN');
    }

    if (k === 'arrowleft' || k === 'a') {
        setDir('LEFT');
    }

    if (k === 'arrowright' || k === 'd') {
        setDir('RIGHT');
    }

    if (k === 'escape') {
        togglePause();
    }
};


let sx = 0;
let sy = 0;


cv.ontouchstart = e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
};


cv.ontouchmove = e => e.preventDefault();


cv.ontouchend = e => {
    let x = e.changedTouches[0].clientX - sx;
    let y = e.changedTouches[0].clientY - sy;

    if (Math.max(Math.abs(x), Math.abs(y)) < 25) {
        return;
    }

    if (Math.abs(x) > Math.abs(y)) {
        setDir(x > 0 ? 'RIGHT' : 'LEFT');
    } else {
        setDir(y > 0 ? 'DOWN' : 'UP');
    }
};


function move() {
    dir = next;

    let h = { ...s[0] };

    if (dir === 'UP') h.y--;
    if (dir === 'DOWN') h.y++;
    if (dir === 'LEFT') h.x--;
    if (dir === 'RIGHT') h.x++;

    if (
        h.x < 0 ||
        h.x >= N ||
        h.y < 0 ||
        h.y >= N ||
        s.some((p, i) => i && p.x === h.x && p.y === h.y)
    ) {
        end();
        return;
    }

    s.unshift(h);

    if (h.x === food.x && h.y === food.y) {
        score += D[diff][1];
        grow++;

        color = C[Math.floor(Math.random() * C.length)];

        spawn();

        if (score % 10 === 0) {
            rgbOn = true;
            spawnRgb();
        }
    }

    if (rgbOn && h.x === rgb.x && h.y === rgb.y) {
        score += 5 * D[diff][1];
        grow += 5;

        color = C[Math.floor(Math.random() * C.length)];

        rgbOn = false;

        spawn();
    }

    if (grow) {
        grow--;
    } else {
        s.pop();
    }
}


function camera() {
    let r = cv.getBoundingClientRect();

    let x = s[0].x * CELL + CELL / 2 - r.width / 2;
    let y = s[0].y * CELL + CELL / 2 - r.height / 2;

    return {
        x: Math.max(0, Math.min(W - r.width, x)),
        y: Math.max(0, Math.min(W - r.height, y))
    };
}


function draw() {
    let r = cv.getBoundingClientRect();
    let t = T[theme];
    let cam = camera();

    ctx.clearRect(0, 0, r.width, r.height);

    ctx.fillStyle = col(t[0]);
    ctx.fillRect(0, 0, r.width, r.height);

    ctx.save();

    ctx.translate(-cam.x, -cam.y);


    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {

            ctx.fillStyle =
                (x + y) % 2
                    ? col(t[2])
                    : col(t[1]);

            ctx.fillRect(
                x * CELL,
                y * CELL,
                CELL,
                CELL
            );
        }
    }


    ctx.strokeStyle = col(t[3]);
    ctx.lineWidth = 4;

    ctx.strokeRect(
        2,
        2,
        W - 4,
        W - 4
    );


    ctx.fillStyle = '#ff3c3c';

    ctx.fillRect(
        food.x * CELL + 2,
        food.y * CELL + 2,
        CELL - 4,
        CELL - 4
    );


    if (rgbOn) {
        ctx.fillStyle = `rgb(
            ${Math.random() * 255 | 0},
            ${Math.random() * 255 | 0},
            ${Math.random() * 255 | 0}
        )`;

        ctx.fillRect(
            rgb.x * CELL + 2,
            rgb.y * CELL + 2,
            CELL - 4,
            CELL - 4
        );
    }


    s.forEach((p, i) => {
        ctx.fillStyle = color;

        ctx.fillRect(
            p.x * CELL + 1,
            p.y * CELL + 1,
            CELL - 2,
            CELL - 2
        );

        if (i === 0) {
            ctx.fillStyle = '#111';

            ctx.fillRect(
                p.x * CELL + 6,
                p.y * CELL + 6,
                3,
                3
            );

            ctx.fillRect(
                p.x * CELL + 14,
                p.y * CELL + 6,
                3,
                3
            );
        }
    });


    ctx.restore();
}


function hud() {
    $('score').textContent = score;

    $('time').textContent =
        Math.floor((performance.now() - start) / 1000) + 's';
}


function loop(now) {
    if (!run) {
        return;
    }

    if (!paused) {
        if (now - last >= 1000 / D[diff][0]) {
            last = now;
            move();
        }

        hud();
        draw();
    }

    requestAnimationFrame(loop);
}


function begin() {
    name = $('name').value.trim().slice(0, 12);

    if (!name) {
        return;
    }

    localStorage.snakeName = name;

    reset();

    run = true;
    paused = false;

    $('home').classList.add('hide');
    $('ranking').classList.add('hide');
    $('game').classList.remove('hide');

    resize();

    requestAnimationFrame(loop);
}


function end() {
    if (!run) {
        return;
    }

    run = false;

    rank.push({
        name,
        score
    });

    rank.sort((a, b) => b.score - a.score);

    rank = rank.slice(0, 20);

    localStorage.snakeRank = JSON.stringify(rank);

    setTimeout(() => {
        alert(`Fim de jogo!\n${name}: ${score} pontos`);
        home();
    }, 50);
}


function home() {
    run = false;
    paused = false;

    $('overlay').classList.add('hide');
    $('game').classList.add('hide');
    $('ranking').classList.add('hide');
    $('home').classList.remove('hide');
}


function showRank() {
    $('home').classList.add('hide');
    $('game').classList.add('hide');
    $('ranking').classList.remove('hide');

    $('scores').innerHTML = rank.length
        ? rank
            .map(
                (r, i) =>
                    `<div class="row">
                        <span>${i + 1}. ${r.name.replace(/[<>&]/g, '')}</span>
                        <b>${r.score}</b>
                    </div>`
            )
            .join('')
        : `<div class="row">
                <span>Nenhuma partida.</span>
                <b>—</b>
            </div>`;
}


function togglePause() {
    if (!run) {
        return;
    }

    paused = !paused;

    $('overlay').classList.toggle('hide', !paused);

    if (!paused) {
        last = performance.now();
    }
}


$('play').onclick = begin;
$('rank').onclick = showRank;
$('back').onclick = home;

$('menu').onclick = () => run ? togglePause() : home();

$('pause').onclick = togglePause;
$('pause2').onclick = togglePause;
$('cont').onclick = togglePause;

$('reset').onclick = () => {
    reset();
    paused = false;
    $('overlay').classList.add('hide');
};

$('tomenu').onclick = home;

$('name').oninput = e =>
    localStorage.snakeName = e.target.value;


$('theme').onclick = () => {
    let a = Object.keys(T);

    theme = a[(a.indexOf(theme) + 1) % a.length];

    localStorage.snakeTheme = theme;

    apply();
    draw();
};


$('diff').onclick = () => {
    let a = Object.keys(D);

    diff = a[(a.indexOf(diff) + 1) % a.length];

    localStorage.snakeDiff = diff;

    apply();
};


resize();
reset();
draw();
