/* =========================================================
   TEMAS
========================================================= */

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


/* =========================================================
   DIFICULDADE
========================================================= */

const D = {

    Normal: [13, 1],

    Insano: [25, 2]

};


/* =========================================================
   CORES DA COBRA
========================================================= */

const C = [

    '#00ff00',
    '#0096ff',
    '#ff00ff',
    '#ffff00',
    '#ff7800',
    '#ff0000',
    '#00ffff'

];


/* =========================================================
   CONFIGURAÇÕES DO MAPA
========================================================= */

const MAPA_INICIAL = 60;

const MAPA_MINIMO = 20;


/*
   Tamanho visual do mapa.

   0.65 = 65% da menor dimensão
   disponível do jogo.

   Isso deixa o mapa inteiro
   visível sem aquele zoom grande.
*/

const MAPA_TAMANHO_TELA = 1;


let mapSize =
    MAPA_INICIAL;

let mapMin = 0;

let mapMax =
    MAPA_INICIAL - 1;


/* =========================================================
   DADOS SALVOS
========================================================= */

let theme =
    localStorage.snakeTheme || 'Grama';

let diff =
    localStorage.snakeDiff || 'Normal';

let rank =
    JSON.parse(
        localStorage.snakeRank || '[]'
    );

let name =
    localStorage.snakeName || '';


/* =========================================================
   VARIÁVEIS DO JOGO
========================================================= */

let s = [];

let dir = 'RIGHT';

let next = 'RIGHT';

let food = null;

let rgb = null;

let rgbOn = false;

let grow = 0;

let score = 0;

let color = '';

let run = false;

let paused = false;


/* =========================================================
   TEMPO
========================================================= */

let start = 0;

let pausedAt = 0;

let totalPaused = 0;

let gameTime = 0;

let lastMove = 0;


/* =========================================================
   RGB
========================================================= */

let nextRgbScore = 10;


/* =========================================================
   ELEMENTOS
========================================================= */

const $ = id =>
    document.getElementById(id);

const cv =
    $('canvas');

const ctx =
    cv.getContext('2d');


$('name').value =
    name;


/* =========================================================
   COR
========================================================= */

function col(a) {

    return `rgb(
        ${a[0]},
        ${a[1]},
        ${a[2]}
    )`;

}


/* =========================================================
   APLICAR TEMA
========================================================= */

function apply() {

    const t =
        T[theme];


    document.documentElement
        .style
        .setProperty(
            '--bg',
            col(t[0])
        );


    document.documentElement
        .style
        .setProperty(
            '--c1',
            col(t[1])
        );


    document.documentElement
        .style
        .setProperty(
            '--c2',
            col(t[2])
        );


    document.documentElement
        .style
        .setProperty(
            '--border',
            col(t[3])
        );


    document.documentElement
        .style
        .setProperty(
            '--text',
            '#fff'
        );


    $('theme')
        .querySelector('i')
        .textContent =
        theme;


    $('diff')
        .querySelector('i')
        .textContent =
        diff;


    $('dh').textContent =
        diff;

}


apply();


/* =========================================================
   RESIZE
========================================================= */

function resize() {

    const r =
        cv.getBoundingClientRect();


    const d =
        Math.min(
            devicePixelRatio || 1,
            2
        );


    cv.width =
        r.width * d;

    cv.height =
        r.height * d;


    ctx.setTransform(
        d,
        0,
        0,
        d,
        0,
        0
    );

}


/* =========================================================
   ÁREA DO MAPA
========================================================= */

function getMapArea() {

    const r =
        cv.getBoundingClientRect();


    /*
       Pega a menor dimensão
       disponível.
    */

    const menor =
        Math.min(
            r.width,
            r.height
        );


    /*
       Usa apenas 65%.

       Isso é o que reduz
       o zoom.
    */

    const tamanho =
        menor *
        MAPA_TAMANHO_TELA;


    /*
       Cada célula do mapa.
    */

    const cell =
        tamanho /
        mapSize;


    return {

        cell: cell,

        size: tamanho,

        x:
            (r.width - tamanho) /
            2,

        y:
            (r.height - tamanho) /
            2

    };

}


window.onresize = () => {

    resize();

    draw();

};


/* =========================================================
   POSIÇÃO ALEATÓRIA
========================================================= */

function rnd() {

    return {

        x:
            Math.floor(
                Math.random() *
                mapSize
            ),

        y:
            Math.floor(
                Math.random() *
                mapSize
            )

    };

}


/* =========================================================
   OCUPADO
========================================================= */

function occupied(p) {

    return s.some(
        q =>
            q.x === p.x &&
            q.y === p.y
    );

}


/* =========================================================
   SPAWN MAÇÃ
========================================================= */

function spawn() {

    let tentativas = 0;


    do {

        food =
            rnd();

        tentativas++;


        if (
            tentativas > 1000
        ) {

            return;

        }

    } while (
        occupied(food)
    );

}


/* =========================================================
   SPAWN RGB
========================================================= */

function spawnRgb() {

    let tentativas = 0;


    do {

        rgb =
            rnd();

        tentativas++;


        if (
            tentativas > 1000
        ) {

            return;

        }

    } while (

        occupied(rgb) ||

        (
            rgb.x === food.x &&
            rgb.y === food.y
        )

    );

}


/* =========================================================
   RESET
========================================================= */

function reset() {

    mapSize =
        MAPA_INICIAL;


    mapMin = 0;

    mapMax =
        mapSize - 1;


    const c =
        Math.floor(
            mapSize / 2
        );


    const r =
        Math.floor(
            mapSize / 2
        );


    s = [

        {
            x: c,
            y: r
        },

        {
            x: c - 1,
            y: r
        },

        {
            x: c - 2,
            y: r
        }

    ];


    dir =
        'RIGHT';

    next =
        'RIGHT';


    grow = 0;

    score = 0;


    color =
        C[
            Math.floor(
                Math.random() *
                C.length
            )
        ];


    rgbOn = false;

    rgb = null;


    nextRgbScore = 10;


    gameTime = 0;

    totalPaused = 0;

    pausedAt = 0;


    start =
        performance.now();


    lastMove =
        start;


    spawn();

}


/* =========================================================
   DIREÇÃO
========================================================= */

function setDir(d) {

    const opposite = {

        UP: 'DOWN',

        DOWN: 'UP',

        LEFT: 'RIGHT',

        RIGHT: 'LEFT'

    };


    if (
        opposite[dir] !== d
    ) {

        next = d;

    }

}


/* =========================================================
   TECLADO
========================================================= */

window.onkeydown = e => {

    const k =
        e.key.toLowerCase();


    if (
        k === 'arrowup' ||
        k === 'w'
    ) {

        setDir('UP');

    }


    if (
        k === 'arrowdown' ||
        k === 's'
    ) {

        setDir('DOWN');

    }


    if (
        k === 'arrowleft' ||
        k === 'a'
    ) {

        setDir('LEFT');

    }


    if (
        k === 'arrowright' ||
        k === 'd'
    ) {

        setDir('RIGHT');

    }


    if (
        k === 'escape'
    ) {

        togglePause();

    }

};


/* =========================================================
   CONTROLE POR GESTOS
========================================================= */

let sx = 0;

let sy = 0;


cv.ontouchstart = e => {

    sx =
        e.touches[0].clientX;

    sy =
        e.touches[0].clientY;

};


cv.ontouchmove = e => {

    e.preventDefault();

};


cv.ontouchend = e => {

    const x =
        e.changedTouches[0].clientX -
        sx;


    const y =
        e.changedTouches[0].clientY -
        sy;


    if (
        Math.max(
            Math.abs(x),
            Math.abs(y)
        ) < 25
    ) {

        return;

    }


    if (
        Math.abs(x) >
        Math.abs(y)
    ) {

        setDir(
            x > 0
                ? 'RIGHT'
                : 'LEFT'
        );

    } else {

        setDir(
            y > 0
                ? 'DOWN'
                : 'UP'
        );

    }

};


/* =========================================================
   DIMINUIR MAPA
========================================================= */

function shrinkMap() {

    if (
        mapSize <=
        MAPA_MINIMO
    ) {

        return;

    }


    /*
       Diminui 2 células
       por minuto.
    */

    mapSize -= 2;


    mapMin = 0;

    mapMax =
        mapSize - 1;


    /*
       Maçã fora do mapa.
    */

    if (

        !food ||

        food.x >= mapSize ||

        food.y >= mapSize

    ) {

        spawn();

    }


    /*
       RGB fora do mapa.
    */

    if (

        rgbOn &&
        rgb &&

        (
            rgb.x >= mapSize ||
            rgb.y >= mapSize
        )

    ) {

        spawnRgb();

    }


    /*
       Cobra fora do novo mapa.
    */

    if (
        s.some(
            p =>
                p.x >= mapSize ||
                p.y >= mapSize
        )
    ) {

        end();

    }

}


/* =========================================================
   MOVIMENTO
========================================================= */

function move() {

    dir =
        next;


    const h = {
        ...s[0]
    };


    if (
        dir === 'UP'
    ) {

        h.y--;

    }


    if (
        dir === 'DOWN'
    ) {

        h.y++;

    }


    if (
        dir === 'LEFT'
    ) {

        h.x--;

    }


    if (
        dir === 'RIGHT'
    ) {

        h.x++;

    }


    /*
       COLISÃO
    */

    if (

        h.x < 0 ||

        h.x >= mapSize ||

        h.y < 0 ||

        h.y >= mapSize ||

        s.some(
            (p, i) =>
                i &&
                p.x === h.x &&
                p.y === h.y
        )

    ) {

        end();

        return;

    }


    s.unshift(h);


    /* =====================================================
       MAÇÃ NORMAL
    ===================================================== */

    if (

        h.x === food.x &&
        h.y === food.y

    ) {

        /*
           Normal = +1
           Insano = +2
        */

        score +=
            D[diff][1];


        /*
           Crescimento acompanha
           os pontos ganhos.
        */

        grow +=
            D[diff][1];


        color =
            C[
                Math.floor(
                    Math.random() *
                    C.length
                )
            ];


        spawn();


        /*
           RGB aparece a cada
           10 pontos.
        */

        if (

            !rgbOn &&
            score >= nextRgbScore

        ) {

            rgbOn = true;

            spawnRgb();

            nextRgbScore += 10;

        }

    }


    /* =====================================================
       MAÇÃ RGB
    ===================================================== */

    if (

        rgbOn &&
        rgb &&

        h.x === rgb.x &&
        h.y === rgb.y

    ) {

        /*
           Normal = +5
           Insano = +10
        */

        score +=
            5 *
            D[diff][1];


        grow +=
            5 *
            D[diff][1];


        color =
            C[
                Math.floor(
                    Math.random() *
                    C.length
                )
            ];


        rgbOn = false;

        rgb = null;


        spawn();

    }


    /* =====================================================
       CRESCIMENTO
    ===================================================== */

    if (
        grow > 0
    ) {

        grow--;

    } else {

        s.pop();

    }

}


/* =========================================================
   DESENHAR
========================================================= */

function draw() {

    const r =
        cv.getBoundingClientRect();


    const t =
        T[theme];


    const area =
        getMapArea();


    const cell =
        area.cell;


    /*
       FUNDO
    */

    ctx.clearRect(
        0,
        0,
        r.width,
        r.height
    );


    ctx.fillStyle =
        col(t[0]);


    ctx.fillRect(
        0,
        0,
        r.width,
        r.height
    );


    /*
       MAPA
    */

    for (
        let y = 0;
        y < mapSize;
        y++
    ) {

        for (
            let x = 0;
            x < mapSize;
            x++
        ) {

            ctx.fillStyle =
                (x + y) % 2
                    ? col(t[2])
                    : col(t[1]);


            ctx.fillRect(

                area.x +
                x * cell,

                area.y +
                y * cell,

                Math.ceil(cell) + 1,

                Math.ceil(cell) + 1

            );

        }

    }


    /*
       BORDA
    */

    ctx.strokeStyle =
        col(t[3]);


    ctx.lineWidth =
        Math.max(
            2,
            cell * 0.08
        );


    ctx.strokeRect(

        area.x + 1,

        area.y + 1,

        area.size - 2,

        area.size - 2

    );


    /* =====================================================
       MAÇÃ
    ===================================================== */

    if (food) {

        ctx.fillStyle =
            '#ff3c3c';


        ctx.fillRect(

            area.x +
            food.x * cell +
            cell * 0.12,

            area.y +
            food.y * cell +
            cell * 0.12,

            cell * 0.76,

            cell * 0.76

        );

    }


    /* =====================================================
       RGB
    ===================================================== */

    if (
        rgbOn &&
        rgb
    ) {

        ctx.fillStyle =
            `rgb(
                ${Math.random() * 255 | 0},
                ${Math.random() * 255 | 0},
                ${Math.random() * 255 | 0}
            )`;


        ctx.fillRect(

            area.x +
            rgb.x * cell +
            cell * 0.10,

            area.y +
            rgb.y * cell +
            cell * 0.10,

            cell * 0.80,

            cell * 0.80

        );

    }


    /* =====================================================
       COBRA
    ===================================================== */

    s.forEach(
        (p, i) => {

            const px =
                area.x +
                p.x * cell;


            const py =
                area.y +
                p.y * cell;


            ctx.fillStyle =
                color;


            ctx.fillRect(

                px +
                cell * 0.05,

                py +
                cell * 0.05,

                cell * 0.90,

                cell * 0.90

            );


            /*
               OLHOS
            */

            if (
                i === 0
            ) {

                ctx.fillStyle =
                    '#111';


                const olho =
                    Math.max(
                        2,
                        cell * 0.13
                    );


                ctx.fillRect(

                    px +
                    cell * 0.25,

                    py +
                    cell * 0.25,

                    olho,

                    olho

                );


                ctx.fillRect(

                    px +
                    cell * 0.65,

                    py +
                    cell * 0.25,

                    olho,

                    olho

                );

            }

        }
    );

}


/* =========================================================
   HUD
========================================================= */

function hud() {

    $('score')
        .textContent =
        score;


    $('time')
        .textContent =
        Math.floor(
            gameTime
        ) + 's';


    const label =
        document.querySelector(
            '#wrap label'
        );


    if (label) {

        label.textContent =
            `MAPA ${mapSize}×${mapSize}`;

    }

}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

function loop(now) {

    if (!run) {

        return;

    }


    if (!paused) {

        /*
           TIMER REAL
        */

        gameTime =
            (
                now -
                start -
                totalPaused
            ) / 1000;


        if (
            gameTime < 0
        ) {

            gameTime = 0;

        }


        /*
           MOVIMENTO
        */

        if (

            now -
            lastMove >=
            1000 /
            D[diff][0]

        ) {

            lastMove =
                now;

            move();

        }


        /*
           REDUÇÃO DO MAPA
           A CADA 60 SEGUNDOS
        */

        const reducoes =
            Math.floor(
                gameTime / 60
            );


        const tamanhoEsperado =
            Math.max(

                MAPA_MINIMO,

                MAPA_INICIAL -
                reducoes * 2

            );


        if (
            tamanhoEsperado <
            mapSize
        ) {

            shrinkMap();

        }


        hud();

        draw();

    }


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   COMEÇAR
========================================================= */

function begin() {

    name =
        $('name')
            .value
            .trim()
            .slice(
                0,
                12
            );


    if (!name) {

        return;

    }


    localStorage.snakeName =
        name;


    reset();


    run = true;

    paused = false;


    $('home')
        .classList
        .add('hide');


    $('ranking')
        .classList
        .add('hide');


    $('game')
        .classList
        .remove('hide');


    resize();


    const now =
        performance.now();


    lastMove =
        now;


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   FIM DE JOGO
========================================================= */

function end() {

    if (!run) {

        return;

    }


    run = false;


    rank.push({

        name,

        score,

        time:
            Math.floor(
                gameTime
            )

    });


    rank.sort(
        (a, b) => {

            if (
                b.score !==
                a.score
            ) {

                return (
                    b.score -
                    a.score
                );

            }


            return (
                b.time -
                a.time
            );

        }
    );


    rank =
        rank.slice(
            0,
            20
        );


    localStorage.snakeRank =
        JSON.stringify(
            rank
        );


    setTimeout(
        () => {

            alert(
                `Fim de jogo!\n\n` +
                `${name}: ${score} pontos\n` +
                `Tempo: ${Math.floor(gameTime)}s`
            );


            home();

        },
        50
    );

}


/* =========================================================
   HOME
========================================================= */

function home() {

    run = false;

    paused = false;


    $('overlay')
        .classList
        .add('hide');


    $('game')
        .classList
        .add('hide');


    $('ranking')
        .classList
        .add('hide');


    $('home')
        .classList
        .remove('hide');

}


/* =========================================================
   RANKING
========================================================= */

function showRank() {

    $('home')
        .classList
        .add('hide');


    $('game')
        .classList
        .add('hide');


    $('ranking')
        .classList
        .remove('hide');


    $('scores').innerHTML =

        rank.length

            ? rank
                .map(
                    (r, i) => {

                        const safeName =
                            String(
                                r.name
                            )
                            .replace(
                                /[<>&]/g,
                                ''
                            );


                        const tempo =
                            r.time !== undefined
                                ? `${r.time}s`
                                : '—';


                        return `

                            <div class="row">

                                <span>
                                    ${i + 1}.
                                    ${safeName}
                                </span>

                                <b>
                                    ${r.score}
                                    pts
                                    ·
                                    ${tempo}
                                </b>

                            </div>

                        `;

                    }
                )
                .join('')

            : `

                <div class="row">

                    <span>
                        Nenhuma partida.
                    </span>

                    <b>
                        —
                    </b>

                </div>

            `;

}


/* =========================================================
   PAUSA
========================================================= */

function togglePause() {

    if (!run) {

        return;

    }


    /*
       PAUSAR
    */

    if (!paused) {

        paused = true;


        pausedAt =
            performance.now();


        $('overlay')
            .classList
            .remove('hide');


        return;

    }


    /*
       CONTINUAR
    */

    const agora =
        performance.now();


    totalPaused +=
        agora -
        pausedAt;


    paused = false;


    lastMove =
        agora;


    $('overlay')
        .classList
        .add('hide');

}


/* =========================================================
   BOTÕES
========================================================= */

$('play').onclick =
    begin;


$('rank').onclick =
    showRank;


$('back').onclick =
    home;


$('menu').onclick = () => {

    if (run) {

        togglePause();

    } else {

        home();

    }

};


$('pause').onclick =
    togglePause;


$('pause2').onclick =
    togglePause;


$('cont').onclick =
    togglePause;


$('reset').onclick = () => {

    reset();

    paused = false;


    $('overlay')
        .classList
        .add('hide');


    lastMove =
        performance.now();

};


$('tomenu').onclick =
    home;


/* =========================================================
   NOME
========================================================= */

$('name').oninput =
    e => {

        localStorage.snakeName =
            e.target.value;

    };


/* =========================================================
   TEMA
========================================================= */

$('theme').onclick = () => {

    const a =
        Object.keys(T);


    theme =
        a[
            (
                a.indexOf(theme) +
                1
            ) %
            a.length
        ];


    localStorage.snakeTheme =
        theme;


    apply();

    draw();

};


/* =========================================================
   DIFICULDADE
========================================================= */

$('diff').onclick = () => {

    const a =
        Object.keys(D);


    diff =
        a[
            (
                a.indexOf(diff) +
                1
            ) %
            a.length
        ];


    localStorage.snakeDiff =
        diff;


    apply();

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

resize();

reset();

draw();
