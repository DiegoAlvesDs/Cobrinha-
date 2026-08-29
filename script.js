/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    'https://yfijtchpwohulhzamlre.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_5kL_MJ5oYHzD0X5OCecCmQ_TZ5h-HiI';


async function salvarRanking(nome, pontuacao, tempo, modo) {

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
                            tempo: tempo,
                            modo: modo,
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


async function carregarRanking(modo) {

    try {

        const resposta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/ranking_melhores?select=nome,pontuacao,tempo,dificuldade,modo,criado_em&modo=eq.${encodeURIComponent(modo)}&order=pontuacao.desc,criado_em.asc&limit=50`,
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
    ],

    Deserto: [
        [35, 25, 10],
        [90, 70, 30],
        [130, 100, 45],
        [235, 205, 145]
    ],

    Cyberpunk: [
        [10, 5, 20],
        [40, 10, 60],
        [70, 15, 100],
        [255, 60, 220]
    ],

    Outono: [
        [25, 12, 5],
        [80, 40, 15],
        [120, 60, 20],
        [235, 155, 65]
    ],

    Monocromo: [
        [10, 10, 10],
        [40, 40, 40],
        [70, 70, 70],
        [225, 225, 225]
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
    'Infinito',
    'Velocidade',
    'Tempo',
    'Obstaculos',
    'Caos',
    'Espelho'
];

const MAPMODE_LABEL = {
    Classico: 'Clássico',
    SemParede: 'Sem Parede',
    Infinito: 'Infinito',
    Velocidade: 'Velocidade',
    Tempo: 'Tempo',
    Obstaculos: 'Obstáculos',
    Caos: 'Caos',
    Espelho: 'Espelho'
};


/* =========================================================
   LIMITE DE TEMPO (modo TEMPO)
========================================================= */

const LIMITE_TEMPO_MODO = 60;


/* =========================================================
   MODOS QUE ENCOLHEM O MAPA COM O TEMPO
========================================================= */

function modoEncolheMapa() {

    return (

        mapMode === 'Classico' ||
        mapMode === 'SemParede' ||
        mapMode === 'Obstaculos'

    );

}


/* =========================================================
   QUANTIDADE DE MAÇÃS NO MAPA
========================================================= */

function quantidadeMacas() {

    return (mapMode === 'Classico') ? 4 : 2;

}


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
        custo: 40,
        nivel: 4
    },

    Gradiente: {
        nome: 'Gradiente',
        custo: 60,
        nivel: 4
    },

    Gelo: {
        nome: 'Gelo',
        custo: 90,
        nivel: 6
    },

    Neon: {
        nome: 'Neon',
        custo: 100,
        nivel: 6
    },

    Espinhada: {
        nome: 'Espinhada',
        custo: 120,
        nivel: 8
    },

    Camuflada: {
        nome: 'Camuflada',
        custo: 140,
        nivel: 8
    },

    Fantasma: {
        nome: 'Fantasma',
        custo: 150,
        nivel: 10
    },

    ArcoIris: {
        nome: 'Arco-íris',
        custo: 180,
        nivel: 10
    },

    Dourada: {
        nome: 'Dourada',
        custo: 200,
        nivel: 11
    },

    Metalica: {
        nome: 'Metálica',
        custo: 220,
        nivel: 12
    },

    Toxica: {
        nome: 'Tóxica',
        custo: 240,
        nivel: 13
    },

    Fogo: {
        nome: 'Fogo',
        custo: 260,
        nivel: 14
    },

    Estelar: {
        nome: 'Estelar',
        custo: 300,
        nivel: 15
    }

};

const SKINS =
    Object.keys(SKIN_INFO);


/* =========================================================
   CONFIGURAÇÕES DO MAPA
========================================================= */

const MAPA_INICIAL = 75;

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
   OBSTÁCULOS
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

let foods = [];

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

let nextRgbScore = 20;


/* =========================================================
   MODO VELOCIDADE (bônus por maçã comida)
========================================================= */

let velocidadeExtraApple = 0;


/* =========================================================
   MODO CAOS (eventos aleatórios)
========================================================= */

let proximoEventoCaos = 0;

let efeitoTemporario = null;

let mensagemEvento = '';

let mensagemEventoAte = 0;


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

    } else if (skin === 'Camuflada') {

        const tonsCamuflagem = [
            '#3a4d2b', '#5a6b3a', '#2e3b22', '#6f7a4a'
        ];

        ctx.fillStyle =
            tonsCamuflagem[
                (i * 7 + Math.floor(px + py)) % tonsCamuflagem.length
            ];

        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Dourada') {

        const brilho =
            Math.sin(Date.now() / 200 + i * 0.6) * 0.5 + 0.5;

        const grad =
            ctx.createLinearGradient(px, py, px + cell, py + cell);

        grad.addColorStop(0, '#7a5a10');
        grad.addColorStop(0.5, `rgba(255, 215, 90, ${0.6 + brilho * 0.4})`);
        grad.addColorStop(1, '#7a5a10');

        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.strokeStyle = '#fff2b0';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Toxica') {

        const pulso =
            Math.sin(Date.now() / 150 + i * 0.8) * 0.5 + 0.5;

        ctx.shadowBlur = cell * (0.3 + pulso * 0.4);
        ctx.shadowColor = '#7cff2b';
        ctx.fillStyle = '#4ea60f';

        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.fillStyle =
            `rgba(180, 255, 60, ${0.3 + pulso * 0.4})`;

        ctx.fillRect(
            px + cell * 0.3,
            py + cell * 0.3,
            cell * 0.25,
            cell * 0.25
        );

    } else if (skin === 'Estelar') {

        ctx.fillStyle = '#140a2e';
        ctx.fillRect(px + m, py + m, tam, tam);

        const semente =
            (i * 9301 + 49297) % 233280;

        const numEstrelas = 3;


        for (let e = 0; e < numEstrelas; e++) {

            const s1 =
                (semente * (e + 1) * 9301) % 233280;

            const s2 =
                (semente * (e + 3) * 49297) % 233280;

            const ex =
                px + m + (s1 / 233280) * tam;

            const ey =
                py + m + (s2 / 233280) * tam;

            ctx.fillStyle = '#ffffff';

            ctx.fillRect(ex, ey, Math.max(1, cell * 0.08), Math.max(1, cell * 0.08));

        }

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

/* =========================================================
   FORMATAR TEMPO (M:SS)
========================================================= */

function formatarTempo(segundos) {

    const s =
        Math.max(
            0,
            Math.floor(segundos || 0)
        );

    const m =
        Math.floor(s / 60);

    const r =
        s % 60;

    return (
        m +
        ':' +
        String(r).padStart(2, '0')
    );

}


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

        isObstacle(p) ||

        foods.some(
            f =>
                f.x === p.x &&
                f.y === p.y
        ) ||

        (
            rgbOn &&
            rgb &&
            rgb.x === p.x &&
            rgb.y === p.y
        )

    );

}


/* =========================================================
   MODO OBSTÁCULOS

   Os obstáculos são gerados uma única vez no
   início da partida, em posições que não
   colidem com a cobra. Ao encolher o mapa,
   só removemos os que ficaram fora e
   completamos a quantidade alvo em lugares
   seguros — nunca regeneramos tudo do zero,
   pra um obstáculo nunca aparecer em cima
   da cobra.
========================================================= */

function ajustarObstaculos() {

    obstacles.forEach(
        chave => {

            const partes =
                chave.split(',');

            const ox =
                Number(partes[0]);

            const oy =
                Number(partes[1]);


            if (
                ox >= mapSize ||
                oy >= mapSize
            ) {

                obstacles.delete(chave);

            }

        }
    );


    const centro =
        Math.floor(mapSize / 2);

    const qtdAlvo =
        Math.floor(mapSize * mapSize * 0.025);

    let tentativas = 0;


    while (

        obstacles.size < qtdAlvo &&
        tentativas < 500

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


        if (occupied(p)) {

            continue;

        }


        obstacles.add(
            obsKey(p.x, p.y)
        );

    }

}


/* =========================================================
   PREPARAR MODO DE MAPA
========================================================= */

function prepararModoMapa() {

    if (mapMode === 'Obstaculos') {

        ajustarObstaculos();

    }

}


/* =========================================================
   VELOCIDADE

   Sobe com o nível (tempo de partida), com
   um empurrão extra no modo Velocidade a
   cada maçã comida, e uma rajada temporária
   quando o Caos dispara o evento.
========================================================= */

function velocidadeAtual() {

    const base =
        D[diff][0];

    const fatorNivel =
        (mapMode === 'Velocidade')
            ? 1.4
            : 0.8;

    let bonus =
        (level - 1) * fatorNivel;


    bonus +=
        velocidadeExtraApple;


    if (

        efeitoTemporario &&
        efeitoTemporario.tipo === 'velocidade' &&
        gameTime < efeitoTemporario.ate

    ) {

        bonus += 6;

    }


    return Math.min(
        base + bonus,
        base + 18
    );

}


/* =========================================================
   MODO CAOS

   A cada 15-25s de partida, dispara um
   evento aleatório: rajada de velocidade,
   maçã fugitiva (reposiciona) ou controles
   invertidos por alguns segundos.
========================================================= */

function agendarProximoEventoCaos() {

    proximoEventoCaos =
        gameTime +
        15 +
        Math.random() * 10;

}


function dispararEventoCaos() {

    const eventos =
        ['velocidade', 'macaFugitiva', 'espelho'];

    const tipo =
        eventos[
            Math.floor(
                Math.random() * eventos.length
            )
        ];


    if (tipo === 'velocidade') {

        efeitoTemporario = {
            tipo: 'velocidade',
            ate: gameTime + 4
        };

        mensagemEvento =
            '⚡ Rajada de velocidade!';

    } else if (tipo === 'macaFugitiva') {

        if (foods.length) {

            const idx =
                Math.floor(
                    Math.random() * foods.length
                );

            const nova =
                spawnUmaMaca();


            if (nova) {

                foods[idx] =
                    nova;

            }

        }


        mensagemEvento =
            '🍎 Maçã fugitiva!';

    } else if (tipo === 'espelho') {

        efeitoTemporario = {
            tipo: 'espelho',
            ate: gameTime + 4
        };

        mensagemEvento =
            '🔀 Controles invertidos!';

    }


    mensagemEventoAte =
        gameTime + 2.5;


    agendarProximoEventoCaos();

}


/* =========================================================
   MODO ESPELHO (permanente ou temporário via Caos)
========================================================= */

function direcaoAtiva(d) {

    const espelhoAtivo =

        mapMode === 'Espelho' ||

        (

            efeitoTemporario &&
            efeitoTemporario.tipo === 'espelho' &&
            gameTime < efeitoTemporario.ate

        );


    if (!espelhoAtivo) {

        return d;

    }


    const inverso = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
    };


    return inverso[d];

}


/* =========================================================
   SPAWN MAÇÃ
========================================================= */

function spawnUmaMaca() {

    let tentativas = 0;

    let p;


    do {

        p =
            rnd();

        tentativas++;


        if (
            tentativas > 1000
        ) {

            return null;

        }

    } while (
        occupied(p)
    );


    return p;

}


function preencherMacas() {

    const alvo =
        quantidadeMacas();


    while (
        foods.length < alvo
    ) {

        const p =
            spawnUmaMaca();


        if (!p) {

            /* Mapa lotado: não há mais
               espaço livre para maçãs.
               Em vez de travar, encerramos
               a partida. */

            if (run) {

                end();

            }

            return;

        }


        foods.push(p);

    }


    if (
        foods.length > alvo
    ) {

        foods.length = alvo;

    }

}


/* =========================================================
   SPAWN RGB
========================================================= */

function spawnRgb() {

    const p =
        spawnUmaMaca();


    if (!p) {

        /* Mapa lotado: cancela a
           maçã bônus em vez de
           deixá-la travada numa
           posição antiga. */

        rgbOn = false;

        rgb = null;

        return;

    }


    rgb = p;

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


    nextRgbScore = 20;


    gameTime = 0;

    totalPaused = 0;

    pausedAt = 0;


    level = 1;


    velocidadeExtraApple = 0;

    efeitoTemporario = null;

    mensagemEvento = '';

    mensagemEventoAte = 0;

    proximoEventoCaos =
        15 + Math.random() * 10;


    start =
        performance.now();


    lastMove =
        start;


    obstacles =
        new Set();

    foods = [];

    prepararModoMapa();

    preencherMacas();

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

        setDir(direcaoAtiva('UP'));

    }


    if (
        k === 'arrowdown' ||
        k === 's'
    ) {

        setDir(direcaoAtiva('DOWN'));

    }


    if (
        k === 'arrowleft' ||
        k === 'a'
    ) {

        setDir(direcaoAtiva('LEFT'));

    }


    if (
        k === 'arrowright' ||
        k === 'd'
    ) {

        setDir(direcaoAtiva('RIGHT'));

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
            direcaoAtiva(
                x > 0
                    ? 'RIGHT'
                    : 'LEFT'
            )
        );

    } else {

        setDir(
            direcaoAtiva(
                y > 0
                    ? 'DOWN'
                    : 'UP'
            )
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


    prepararModoMapa();


    foods =
        foods.filter(
            f =>
                f.x < mapSize &&
                f.y < mapSize &&
                !isObstacle(f)
        );

    preencherMacas();


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


    /* Se só um pedaço do RABO ficou fora
       da nova área, não é motivo pra matar
       o jogador — esses segmentos vão
       sumindo sozinhos conforme a cobra
       anda (a cauda é removida a cada
       passo). Só a CABEÇA fora dos limites
       encerra o jogo, e isso já é tratado
       normalmente dentro de move() no
       próximo passo. */

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

    const idxComida =
        foods.findIndex(
            f =>
                f.x === h.x &&
                f.y === h.y
        );


    if (idxComida !== -1) {

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


        if (
            mapMode === 'Velocidade'
        ) {

            velocidadeExtraApple =
                Math.min(
                    velocidadeExtraApple + 0.3,
                    10
                );

        }


        foods.splice(idxComida, 1);

        preencherMacas();


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


        if (foods.length) {

            const idxRealoca =
                Math.floor(
                    Math.random() * foods.length
                );

            const novaPos =
                spawnUmaMaca();


            if (novaPos) {

                foods[idxRealoca] =
                    novaPos;

            }

        }

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
       PEDRAS
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
       MAÇÃS
    ===================================================== */

    foods.forEach(
        f => {

            ctx.fillStyle =
                '#ff3c3c';


            ctx.fillRect(

                area.x +
                f.x * cell +
                cell * 0.12,

                area.y +
                f.y * cell +
                cell * 0.12,

                cell * 0.76,

                cell * 0.76

            );

        }
    );


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


    if (mapMode === 'Tempo') {

        const restante =
            Math.max(
                0,
                Math.ceil(
                    LIMITE_TEMPO_MODO - gameTime
                )
            );

        $('time').textContent =
            restante + 's';

    } else {

        $('time').textContent =
            Math.floor(
                gameTime
            ) + 's';

    }


    $('lvl').textContent =
        'Nível ' + level;


    if (
        mapMode === 'Caos' &&
        gameTime < mensagemEventoAte
    ) {

        $('toastEvento').textContent =
            mensagemEvento;

        $('toastEvento')
            .classList
            .remove('hide');

    } else {

        $('toastEvento')
            .classList
            .add('hide');

    }


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

        }


        if (

            mapMode === 'Tempo' &&
            gameTime >= LIMITE_TEMPO_MODO

        ) {

            end();

            return;

        }


        if (
            mapMode === 'Caos' &&
            gameTime >= proximoEventoCaos
        ) {

            dispararEventoCaos();

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


        if (
            modoEncolheMapa()
        ) {

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
            50
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
        score,
        Math.floor(gameTime),
        mapMode
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

let rankModoSelecionado = null;


function popularSeletorModoRanking() {

    const select =
        $('rankModoSelect');


    if (select.options.length === 0) {

        MAPMODES.forEach(
            m => {

                const opt =
                    document.createElement('option');

                opt.value = m;

                opt.textContent =
                    MAPMODE_LABEL[m];

                select.appendChild(opt);

            }
        );

    }


    if (!rankModoSelecionado) {

        rankModoSelecionado =
            mapMode;

    }


    select.value =
        rankModoSelecionado;

}


async function carregarEExibirRanking() {

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
        await carregarRanking(
            rankModoSelecionado
        );


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


                    const tempoFormatado =
                        formatarTempo(r.tempo);


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
                                ${tempoFormatado}
                                ·
                                ${dificuldade}
                            </b>

                        </div>

                    `;

                }
            )
            .join('');

}


async function showRank() {

    showScreen('ranking');

    popularSeletorModoRanking();

    await carregarEExibirRanking();

}


$('rankModoSelect').onchange = () => {

    rankModoSelecionado =
        $('rankModoSelect').value;

    carregarEExibirRanking();

};


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
