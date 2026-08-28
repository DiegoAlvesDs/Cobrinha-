/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    'https://yfijtchpwohulhzamlre.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_5kL_MJ5oYHzD0X5OCecCmQ_TZ5h-HiI';


async function salvarRanking(nome, pontuacao) {

    try {

        const resposta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/ranking`,
                {
                    method: 'POST',

                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization':
                            `Bearer ${SUPABASE_KEY}`,
                        'Content-Type':
                            'application/json',
                        'Prefer':
                            'return=minimal'
                    },

                    body:
                        JSON.stringify({
                            nome: nome,
                            pontuacao: pontuacao,
                            dificuldade: diff
                        })
                }
            );


        if (!resposta.ok) {

            const erro =
                await resposta.text();

            console.error(
                'Erro ao salvar ranking:',
                erro
            );

        }

    } catch (erro) {

        console.error(
            'Erro de conexão com Supabase:',
            erro
        );

    }

}


async function carregarRanking() {

    try {

        const resposta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/ranking?select=nome,pontuacao,dificuldade,criado_em&order=pontuacao.desc,criado_em.asc&limit=20`,
                {
                    method: 'GET',

                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization':
                            `Bearer ${SUPABASE_KEY}`
                    }
                }
            );


        if (!resposta.ok) {

            const erro =
                await resposta.text();

            console.error(
                'Erro ao carregar ranking:',
                erro
            );

            return [];

        }


        return await resposta.json();

    } catch (erro) {

        console.error(
            'Erro de conexão com Supabase:',
            erro
        );

        return [];

    }

}


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
   MODOS DE MAPA
========================================================= */

const MAPMODES = [
    'Classico',
    'SemParede',
    'Obstaculos',
    'Labirinto'
];

const MAPMODE_LABEL = {
    Classico: 'Clássico',
    SemParede: 'Sem Parede',
    Obstaculos: 'Obstáculos',
    Labirinto: 'Labirinto'
};


/* =========================================================
   SKINS DA COBRA
========================================================= */

const SKIN_INFO = {

    Solida: {
        nome: 'Sólida',
        custo: 0,
        nivel: 1
    },

    Listrada: {
        nome: 'Listrada',
        custo: 0,
        nivel: 1
    },

    Retro: {
        nome: 'Retrô',
        custo: 20,
        nivel: 2
    },

    Gradiente: {
        nome: 'Gradiente',
        custo: 30,
        nivel: 2
    },

    Gelo: {
        nome: 'Gelo',
        custo: 45,
        nivel: 3
    },

    Neon: {
        nome: 'Neon',
        custo: 50,
        nivel: 3
    },

    Espinhada: {
        nome: 'Espinhada',
        custo: 60,
        nivel: 4
    },

    Fantasma: {
        nome: 'Fantasma',
        custo: 75,
        nivel: 5
    },

    ArcoIris: {
        nome: 'Arco-íris',
        custo: 90,
        nivel: 5
    },

    Metalica: {
        nome: 'Metálica',
        custo: 110,
        nivel: 6
    },

    Fogo: {
        nome: 'Fogo',
        custo: 130,
        nivel: 7
    }

};

const SKINS =
    Object.keys(SKIN_INFO);


/* =========================================================
   CONFIGURAÇÕES DO MAPA
========================================================= */

const MAPA_INICIAL = 60;

const MAPA_MINIMO = 20;

const MAPA_TAMANHO_TELA = 1;


let mapSize =
    MAPA_INICIAL;


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

let mapMode =
    localStorage.snakeMapMode || 'Classico';

let skin =
    localStorage.snakeSkin || 'Solida';


/* =========================================================
   MOEDAS / XP / SKINS POSSUÍDAS
========================================================= */

let coins =
    parseInt(
        localStorage.snakeCoins || '0',
        10
    );

let totalXP =
    parseInt(
        localStorage.snakeXP || '0',
        10
    );

let ownedSkins =
    new Set(
        JSON.parse(
            localStorage.snakeOwnedSkins ||
            '["Solida","Listrada"]'
        )
    );

let coinsThisRun = 0;


function playerLevel() {

    return (
        1 +
        Math.floor(
            totalXP / 100
        )
    );

}


function skinDesbloqueada(nomeSkin) {

    return (

        ownedSkins.has(nomeSkin) ||

        playerLevel() >=
        SKIN_INFO[nomeSkin].nivel

    );

}


/* =========================================================
   OBSTÁCULOS / LABIRINTO
========================================================= */

let obstacles = new Set();


/* =========================================================
   NÍVEL
========================================================= */

let level = 1;


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
   CORES PARA AS SKINS
========================================================= */

function hexParaRgb(hex) {

    const v =
        hex.replace('#', '');

    return [
        parseInt(v.substring(0, 2), 16),
        parseInt(v.substring(2, 4), 16),
        parseInt(v.substring(4, 6), 16)
    ];

}


function corEscura(hex) {

    const rgbArr =
        hexParaRgb(hex);

    return `rgb(
        ${rgbArr[0] * 0.45 | 0},
        ${rgbArr[1] * 0.45 | 0},
        ${rgbArr[2] * 0.45 | 0}
    )`;

}


function misturarComPreto(hex, fator) {

    const rgbArr =
        hexParaRgb(hex);

    const f =
        1 - fator;

    return `rgb(
        ${rgbArr[0] * f | 0},
        ${rgbArr[1] * f | 0},
        ${rgbArr[2] * f | 0}
    )`;

}


/* =========================================================
   DESENHAR SEGMENTO DA COBRA (por skin)
========================================================= */

function desenharSegmento(px, py, cell, i, tamanho) {

    const m =
        cell * 0.05;

    const tam =
        cell * 0.90;


    if (skin === 'Listrada') {

        ctx.fillStyle =
            (i % 2 === 0)
                ? color
                : corEscura(color);

        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Gradiente') {

        const t2 =
            tamanho > 1
                ? i / (tamanho - 1)
                : 0;

        ctx.fillStyle =
            misturarComPreto(color, t2 * 0.65);

        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Neon') {

        ctx.shadowBlur = cell * 0.6;
        ctx.shadowColor = color;
        ctx.fillStyle = color;

        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Retro') {

        /* Visual pixelado, tipo Nokia:
           bloco sólido com borda grossa */

        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(1, cell * 0.08);
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Gelo') {

        ctx.globalAlpha = 0.75;
        ctx.fillStyle = '#8fdcff';
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#e0faff';
        ctx.lineWidth = Math.max(1, cell * 0.06);
        ctx.strokeRect(px + m * 1.5, py + m * 1.5, tam - m, tam - m);

    } else if (skin === 'Espinhada') {

        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.fillStyle = corEscura(color);

        const espinho =
            cell * 0.18;

        /* Espinhos nas duas laterais do segmento */

        ctx.beginPath();
        ctx.moveTo(px, py + cell / 2 - espinho);
        ctx.lineTo(px - espinho, py + cell / 2);
        ctx.lineTo(px, py + cell / 2 + espinho);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + cell, py + cell / 2 - espinho);
        ctx.lineTo(px + cell + espinho, py + cell / 2);
        ctx.lineTo(px + cell, py + cell / 2 + espinho);
        ctx.closePath();
        ctx.fill();

    } else if (skin === 'Fantasma') {

        ctx.globalAlpha = 0.45;
        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, cell * 0.06);
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'ArcoIris') {

        const matiz =
            (i * 18 + Date.now() / 15) % 360;

        ctx.fillStyle =
            `hsl(${matiz}, 80%, 55%)`;

        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Metalica') {

        const grad =
            ctx.createLinearGradient(px, py, px + cell, py + cell);

        grad.addColorStop(0, '#e8e8ee');
        grad.addColorStop(0.35, misturarComPreto('#e8e8ee', 0.35));
        grad.addColorStop(0.6, '#ffffff');
        grad.addColorStop(1, misturarComPreto('#e8e8ee', 0.55));

        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Fogo') {

        const onda =
            Math.sin(Date.now() / 90 + i) * 0.5 + 0.5;

        const fogoCores = [
            [255, 60, 0],
            [255, 150, 0],
            [255, 220, 60]
        ];

        const idx =
            onda * (fogoCores.length - 1);

        const baixo =
            fogoCores[Math.floor(idx)];

        const alto =
            fogoCores[Math.min(fogoCores.length - 1, Math.ceil(idx))];

        const frac =
            idx - Math.floor(idx);

        const r = (baixo[0] + (alto[0] - baixo[0]) * frac) | 0;
        const g = (baixo[1] + (alto[1] - baixo[1]) * frac) | 0;
        const b = (baixo[2] + (alto[2] - baixo[2]) * frac) | 0;

        ctx.shadowBlur = cell * 0.5;
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.fillStyle = `rgb(${r},${g},${b})`;

        ctx.fillRect(px + m, py + m, tam, tam);

    } else {

        /* Sólida (padrão) */

        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);

    }

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


    const menor =
        Math.min(
            r.width,
            r.height
        );


    const tamanho =
        menor *
        MAPA_TAMANHO_TELA;


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

function obsKey(x, y) {

    return x + ',' + y;

}


function isObstacle(p) {

    return obstacles.has(
        obsKey(p.x, p.y)
    );

}


function occupied(p) {

    return (

        s.some(
            q =>
                q.x === p.x &&
                q.y === p.y
        ) ||

        isObstacle(p)

    );

}


/* =========================================================
   GERAR OBSTÁCULOS / LABIRINTO
========================================================= */

function gerarObstaculos() {

    obstacles =
        new Set();


    if (
        mapMode === 'Obstaculos'
    ) {

        const centro =
            Math.floor(mapSize / 2);

        const qtd =
            Math.floor(mapSize * mapSize * 0.03) +
            Math.floor(level * 1.5);

        let tentativas = 0;


        while (

            obstacles.size < qtd &&
            tentativas < qtd * 40

        ) {

            tentativas++;


            const p =
                rnd();


            if (

                Math.abs(p.x - centro) < 4 &&
                Math.abs(p.y - centro) < 4

            ) {

                continue;

            }


            obstacles.add(
                obsKey(p.x, p.y)
            );

        }

    } else if (
        mapMode === 'Labirinto'
    ) {

        gerarLabirinto();

    }

}


function gerarLabirinto() {

    const margem = 2;


    function dividir(x0, y0, x1, y1) {

        const largura =
            x1 - x0;

        const altura =
            y1 - y0;


        if (
            largura < 6 ||
            altura < 6
        ) {

            return;

        }


        const horizontal =
            largura < altura;


        if (horizontal) {

            const wy =
                y0 + 2 +
                Math.floor(
                    Math.random() *
                    (altura - 4)
                );

            const gap =
                x0 +
                Math.floor(
                    Math.random() *
                    largura
                );


            for (
                let x = x0;
                x <= x1;
                x++
            ) {

                if (
                    x !== gap &&
                    x !== gap + 1
                ) {

                    obstacles.add(
                        obsKey(x, wy)
                    );

                }

            }


            dividir(x0, y0, x1, wy - 1);

            dividir(x0, wy + 1, x1, y1);

        } else {

            const wx =
                x0 + 2 +
                Math.floor(
                    Math.random() *
                    (largura - 4)
                );

            const gap =
                y0 +
                Math.floor(
                    Math.random() *
                    altura
                );


            for (
                let y = y0;
                y <= y1;
                y++
            ) {

                if (
                    y !== gap &&
                    y !== gap + 1
                ) {

                    obstacles.add(
                        obsKey(wx, y)
                    );

                }

            }


            dividir(x0, y0, wx - 1, y1);

            dividir(wx + 1, y0, x1, y1);

        }

    }


    dividir(
        margem,
        margem,
        mapSize - 1 - margem,
        mapSize - 1 - margem
    );


    /* Limpa a área central para a
       cobra não nascer dentro de
       uma parede */

    const centro =
        Math.floor(mapSize / 2);


    for (
        let dx = -3;
        dx <= 3;
        dx++
    ) {

        for (
            let dy = -2;
            dy <= 2;
            dy++
        ) {

            obstacles.delete(
                obsKey(centro + dx, centro + dy)
            );

        }

    }

}


/* =========================================================
   VELOCIDADE (aumenta com o nível)
========================================================= */

function velocidadeAtual() {

    const base =
        D[diff][0];

    const bonus =
        (level - 1) * 0.8;


    return Math.min(
        base + bonus,
        base + 12
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

            /* Mapa lotado: não há mais
               espaço livre para a maçã.
               Em vez de deixar a maçã
               travada numa posição antiga,
               encerramos a partida. */

            food = null;

            if (run) {

                end();

            }

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

            /* Mapa lotado: cancela a
               maçã bônus em vez de
               deixá-la travada numa
               posição antiga. */

            rgbOn = false;

            rgb = null;

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

    coinsThisRun = 0;


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


    level = 1;


    start =
        performance.now();


    lastMove =
        start;


    gerarObstaculos();

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


    mapSize -= 2;


    gerarObstaculos();


    if (

        !food ||

        food.x >= mapSize ||

        food.y >= mapSize ||

        isObstacle(food)

    ) {

        spawn();

    }


    if (

        rgbOn &&
        rgb &&

        (
            rgb.x >= mapSize ||
            rgb.y >= mapSize ||
            isObstacle(rgb)
        )

    ) {

        spawnRgb();

    }


    if (
        s.some(
            p =>
                p.x >= mapSize ||
                p.y >= mapSize ||
                isObstacle(p)
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


    if (
        mapMode === 'SemParede'
    ) {

        /* Modo Sem Parede: atravessa
           a borda e reaparece do
           outro lado */

        if (h.x < 0) {

            h.x = mapSize - 1;

        }

        if (h.x >= mapSize) {

            h.x = 0;

        }

        if (h.y < 0) {

            h.y = mapSize - 1;

        }

        if (h.y >= mapSize) {

            h.y = 0;

        }

    } else if (

        h.x < 0 ||

        h.x >= mapSize ||

        h.y < 0 ||

        h.y >= mapSize

    ) {

        end();

        return;

    }


    if (

        isObstacle(h) ||

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

        score +=
            D[diff][1];


        grow +=
            D[diff][1];


        coinsThisRun += 2;


        color =
            C[
                Math.floor(
                    Math.random() *
                    C.length
                )
            ];


        spawn();


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

        score +=
            5 *
            D[diff][1];


        grow +=
            5 *
            D[diff][1];


        coinsThisRun += 4;


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


    /* =====================================================
       MAPA
    ===================================================== */

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


    /* =====================================================
       BORDA
    ===================================================== */

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
       OBSTÁCULOS / LABIRINTO
    ===================================================== */

    if (obstacles.size) {

        ctx.fillStyle =
            'rgba(90, 90, 100, 0.95)';


        obstacles.forEach(
            key => {

                const partes =
                    key.split(',');

                const ox =
                    Number(partes[0]);

                const oy =
                    Number(partes[1]);


                ctx.fillRect(

                    area.x +
                    ox * cell,

                    area.y +
                    oy * cell,

                    Math.ceil(cell) + 1,

                    Math.ceil(cell) + 1

                );

            }
        );

    }


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


            ctx.save();


            desenharSegmento(
                px,
                py,
                cell,
                i,
                s.length
            );


            ctx.restore();


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


    $('lvl').textContent =
        'Nível ' + level;


    const label =
        document.querySelector(
            '#wrap label'
        );


    if (label) {

        label.textContent =
            `MAPA ${mapSize}×${mapSize} · ${MAPMODE_LABEL[mapMode]}`;

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


        const novoNivel =
            1 +
            Math.floor(
                gameTime / 20
            );


        if (
            novoNivel !== level
        ) {

            level =
                novoNivel;


            if (

                mapMode === 'Obstaculos' ||
                mapMode === 'Labirinto'

            ) {

                /* Fica mais difícil a
                   cada nível: regenera
                   os obstáculos */

                gerarObstaculos();


                if (
                    s.some(
                        p =>
                            isObstacle(p)
                    )
                ) {

                    end();

                    return;

                }

            }

        }


        if (

            now -
            lastMove >=
            1000 /
            velocidadeAtual()

        ) {

            lastMove =
                now;

            move();

        }


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

/* =========================================================
   NAVEGAÇÃO ENTRE TELAS
========================================================= */

const TELAS = [
    'home',
    'ranking',
    'game',
    'menuTema',
    'menuModo',
    'menuDiff',
    'menuSkins'
];


function showScreen(id) {

    TELAS.forEach(
        s => {

            $(s)
                .classList
                .add('hide');

        }
    );


    $(id)
        .classList
        .remove('hide');

}


function atualizarStatusJogador() {

    if ($('homeCoins')) {

        $('homeCoins').textContent =
            coins;

    }


    if ($('homeLevel')) {

        $('homeLevel').textContent =
            playerLevel();

    }

}


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


    showScreen('game');


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


    /* =====================================================
       RANKING LOCAL
    ===================================================== */

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


    /* =====================================================
       MOEDAS E XP
    ===================================================== */

    coins +=
        coinsThisRun;

    totalXP +=
        score;

    localStorage.snakeCoins =
        coins;

    localStorage.snakeXP =
        totalXP;


    /* =====================================================
       RANKING GLOBAL SUPABASE
    ===================================================== */

    salvarRanking(
        name,
        score
    );


    setTimeout(
        () => {

            alert(
                `Fim de jogo!\n\n` +
                `${name}: ${score} pontos\n` +
                `Tempo: ${Math.floor(gameTime)}s\n` +
                `Moedas ganhas: ${coinsThisRun} 🪙`
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


    showScreen('home');


    atualizarStatusJogador();

}


/* =========================================================
   RANKING GLOBAL
========================================================= */

async function showRank() {

    showScreen('ranking');


    $('scores').innerHTML = `

        <div class="row">

            <span>
                Carregando ranking...
            </span>

            <b>
                ...
            </b>

        </div>

    `;


    const rankingGlobal =
        await carregarRanking();


    if (!rankingGlobal.length) {

        $('scores').innerHTML = `

            <div class="row">

                <span>
                    Nenhuma partida.
                </span>

                <b>
                    —
                </b>

            </div>

        `;

        return;

    }


    $('scores').innerHTML =

        rankingGlobal
            .map(
                (r, i) => {

                    const safeName =
                        String(
                            r.nome
                        )
                        .replace(
                            /[<>&]/g,
                            ''
                        );


                    const dificuldade =
                        String(
                            r.dificuldade ||
                            'Normal'
                        )
                        .replace(
                            /[<>&]/g,
                            ''
                        );


                    return `

                        <div class="row">

                            <span>
                                ${i + 1}.
                                ${safeName}
                            </span>

                            <b>
                                ${r.pontuacao}
                                pts
                                ·
                                ${dificuldade}
                            </b>

                        </div>

                    `;

                }
            )
            .join('');

}


/* =========================================================
   PAUSA
========================================================= */

function togglePause() {

    if (!run) {

        return;

    }


    if (!paused) {

        paused = true;


        pausedAt =
            performance.now();


        $('overlay')
            .classList
            .remove('hide');


        return;

    }


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


document
    .querySelectorAll('.voltarMenu')
    .forEach(
        btn => {

            btn.onclick = home;

        }
    );


/* =========================================================
   NOME
========================================================= */

$('name').oninput =
    e => {

        localStorage.snakeName =
            e.target.value;

    };


/* =========================================================
   MENU: TEMA
========================================================= */

function renderTemas() {

    const lista =
        Object.keys(T);


    $('listaTemas').innerHTML =

        lista
            .map(
                t => {

                    const ativo =
                        (t === theme)
                            ? 'ativo'
                            : '';

                    return `
                        <button
                            class="opcaoLista ${ativo}"
                            data-tema="${t}"
                        >
                            ${t}
                        </button>
                    `;

                }
            )
            .join('');


    $('listaTemas')
        .querySelectorAll('[data-tema]')
        .forEach(
            btn => {

                btn.onclick = () => {

                    theme =
                        btn.dataset.tema;

                    localStorage.snakeTheme =
                        theme;

                    apply();

                    home();

                };

            }
        );

}


$('openTema').onclick = () => {

    renderTemas();

    showScreen('menuTema');

};


/* =========================================================
   MENU: DIFICULDADE
========================================================= */

function renderDificuldades() {

    const lista =
        Object.keys(D);


    $('listaDificuldades').innerHTML =

        lista
            .map(
                d => {

                    const ativo =
                        (d === diff)
                            ? 'ativo'
                            : '';

                    return `
                        <button
                            class="opcaoLista ${ativo}"
                            data-diff="${d}"
                        >
                            ${d}
                        </button>
                    `;

                }
            )
            .join('');


    $('listaDificuldades')
        .querySelectorAll('[data-diff]')
        .forEach(
            btn => {

                btn.onclick = () => {

                    diff =
                        btn.dataset.diff;

                    localStorage.snakeDiff =
                        diff;

                    apply();

                    home();

                };

            }
        );

}


$('openDiff').onclick = () => {

    renderDificuldades();

    showScreen('menuDiff');

};


/* =========================================================
   MENU: MODO DE MAPA
========================================================= */

function renderModos() {

    $('listaModos').innerHTML =

        MAPMODES
            .map(
                m => {

                    const ativo =
                        (m === mapMode)
                            ? 'ativo'
                            : '';

                    return `
                        <button
                            class="opcaoLista ${ativo}"
                            data-modo="${m}"
                        >
                            ${MAPMODE_LABEL[m]}
                        </button>
                    `;

                }
            )
            .join('');


    $('listaModos')
        .querySelectorAll('[data-modo]')
        .forEach(
            btn => {

                btn.onclick = () => {

                    mapMode =
                        btn.dataset.modo;

                    localStorage.snakeMapMode =
                        mapMode;

                    apply();

                    home();

                };

            }
        );

}


$('openModo').onclick = () => {

    renderModos();

    showScreen('menuModo');

};


/* =========================================================
   MENU: SKINS (com moedas e nível)
========================================================= */

function renderSkins() {

    $('skinsCoins').textContent =
        coins;

    $('skinsLevel').textContent =
        playerLevel();


    $('listaSkins').innerHTML =

        SKINS
            .map(
                nomeSkin => {

                    const info =
                        SKIN_INFO[nomeSkin];

                    const desbloqueada =
                        skinDesbloqueada(nomeSkin);

                    const ativa =
                        (nomeSkin === skin);


                    let acaoHtml;


                    if (ativa) {

                        acaoHtml =
                            `<span class="tagSelecionada">SELECIONADA</span>`;

                    } else if (desbloqueada) {

                        acaoHtml =
                            `<button class="botaoSelecionar" data-selecionar="${nomeSkin}">Selecionar</button>`;

                    } else {

                        const podeComprar =
                            coins >= info.custo;

                        acaoHtml = `
                            <span class="infoBloqueio">Nível ${info.nivel} ou</span>
                            <button
                                class="botaoComprar"
                                data-comprar="${nomeSkin}"
                                ${podeComprar ? '' : 'disabled'}
                            >
                                🪙 ${info.custo}
                            </button>
                        `;

                    }


                    return `
                        <div class="linhaSkin ${ativa ? 'ativa' : ''}">
                            <div class="previaSkin previa-${nomeSkin}"></div>
                            <div class="infoSkin">
                                <b>${info.nome}</b>
                            </div>
                            <div class="acaoSkin">
                                ${acaoHtml}
                            </div>
                        </div>
                    `;

                }
            )
            .join('');


    $('listaSkins')
        .querySelectorAll('[data-selecionar]')
        .forEach(
            btn => {

                btn.onclick = () => {

                    skin =
                        btn.dataset.selecionar;

                    localStorage.snakeSkin =
                        skin;

                    apply();

                    renderSkins();

                };

            }
        );


    $('listaSkins')
        .querySelectorAll('[data-comprar]')
        .forEach(
            btn => {

                btn.onclick = () => {

                    const nomeSkin =
                        btn.dataset.comprar;

                    const info =
                        SKIN_INFO[nomeSkin];


                    if (coins < info.custo) {

                        return;

                    }


                    coins -=
                        info.custo;

                    ownedSkins.add(
                        nomeSkin
                    );

                    localStorage.snakeCoins =
                        coins;

                    localStorage.snakeOwnedSkins =
                        JSON.stringify(
                            [...ownedSkins]
                        );

                    skin =
                        nomeSkin;

                    localStorage.snakeSkin =
                        skin;

                    apply();

                    renderSkins();

                };

            }
        );

}


$('openSkins').onclick = () => {

    renderSkins();

    showScreen('menuSkins');

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

resize();

reset();

draw();

atualizarStatusJogador();
