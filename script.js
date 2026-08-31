/* =========================================================
   SUPABASE
========================================================= */
const SUPABASE_URL = 'https://yfijtchpwohulhzamlre.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5kL_MJ5oYHzD0X5OCecCmQ_TZ5h-HiI';

async function salvarRanking(nome, pontuacao, tempo, modo) {
    try {
        const resposta = await fetch(`${SUPABASE_URL}/rest/v1/ranking`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ nome, pontuacao, tempo, modo, dificuldade: diff })
        });
        if (!resposta.ok) console.error('Erro ao salvar ranking:', await resposta.text());
    } catch (erro) {
        console.error('Erro de conexão com Supabase:', erro);
    }
}

async function carregarRanking(modo) {
    try {
        const resposta = await fetch(
            `${SUPABASE_URL}/rest/v1/ranking_melhores?select=nome,pontuacao,tempo,dificuldade,modo,criado_em&modo=eq.${encodeURIComponent(modo)}&order=pontuacao.desc,criado_em.asc&limit=50`,
            { method: 'GET', headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        if (!resposta.ok) { console.error('Erro ao carregar ranking:', await resposta.text()); return null; }
        return await resposta.json();
    } catch (erro) {
        console.error('Erro de conexão com Supabase:', erro);
        return null;
    }
}

/* =========================================================
   TEMAS
========================================================= */
const T = {
    Dark:      [[10, 10, 15], [25, 25, 35], [45, 45, 55], [230, 230, 230]],
    Grama:     [[4, 20, 4], [12, 45, 12], [18, 65, 18], [140, 200, 140]],
    Oceano:    [[0, 15, 40], [0, 45, 90], [0, 80, 130], [180, 230, 255]],
    Lava:      [[45, 8, 5], [100, 25, 15], [150, 45, 15], [255, 170, 80]],
    Galaxia:   [[8, 6, 30], [25, 18, 65], [50, 30, 95], [180, 140, 230]],
    Neon:      [[5, 8, 15], [10, 35, 45], [20, 55, 65], [120, 220, 220]],
    Gelo:      [[5, 18, 30], [25, 70, 95], [40, 100, 130], [160, 210, 225]],
    Floresta:  [[5, 18, 7], [15, 50, 20], [25, 75, 30], [130, 190, 135]],
    Deserto:   [[35, 25, 10], [90, 70, 30], [130, 100, 45], [235, 205, 145]],
    Cyberpunk: [[10, 5, 20], [40, 10, 60], [70, 15, 100], [255, 60, 220]],
    Outono:    [[25, 12, 5], [80, 40, 15], [120, 60, 20], [235, 155, 65]],
    Monocromo: [[10, 10, 10], [40, 40, 40], [70, 70, 70], [225, 225, 225]],
    PorDoSol:  [[30, 10, 20], [80, 20, 40], [130, 40, 50], [255, 150, 90]],
    Menta:     [[5, 20, 15], [10, 50, 35], [15, 75, 55], [140, 230, 190]],
    Vinho:     [[20, 5, 10], [60, 10, 25], [90, 15, 40], [230, 120, 150]],
    Esmeralda: [[3, 20, 12], [8, 55, 30], [12, 80, 45], [110, 230, 150]],
    Ametista:  [[15, 5, 25], [45, 15, 70], [70, 25, 105], [190, 140, 230]],
    Cobre:     [[20, 10, 5], [70, 35, 15], [110, 55, 25], [230, 150, 90]]
};

/* =========================================================
   DIFICULDADE
========================================================= */
const D = { Normal: [13, 1], Insano: [25, 2] };

/* =========================================================
   MULTIPLICADOR DE VALOR DA MAÇÃ (afeta pontos e, por
   consequência, o XP ganho no fim da partida, já que
   totalXP soma o score da partida)
========================================================= */
const MULTIPLICADOR_MACA = 1;

/* =========================================================
   CORES DA COBRA
========================================================= */
const C = ['#00ff00', '#0096ff', '#ff00ff', '#ffff00', '#ff7800', '#ff0000', '#00ffff'];

/* =========================================================
   MODOS DE MAPA
========================================================= */
const MAPMODES = ['Classico', 'SemParede', 'Infinito', 'Velocidade', 'Tempo', 'Obstaculos', 'Caos', 'Espelho'];
const MAPMODE_LABEL = {
    Classico: 'Clássico', SemParede: 'Sem Parede', Infinito: 'Infinito', Velocidade: 'Velocidade',
    Tempo: 'Tempo', Obstaculos: 'Obstáculos', Caos: 'Caos', Espelho: 'Espelho'
};
const LIMITE_TEMPO_MODO = 60;

function modoEncolheMapa() {
    return mapMode === 'Classico' || mapMode === 'SemParede' || mapMode === 'Obstaculos';
}
function quantidadeMacas() {
    return (mapMode === 'Classico') ? 4 : 2;
}

/* =========================================================
   SKINS DA COBRA
========================================================= */
const SKIN_INFO = {
    Solida:    { nome: 'Sólida', custo: 0, nivel: 1 },
    Listrada:  { nome: 'Listrada', custo: 0, nivel: 1 },
    Retro:     { nome: 'Retrô', custo: 40, nivel: 4 },
    Gradiente: { nome: 'Gradiente', custo: 60, nivel: 4 },
    Gelo:      { nome: 'Gelo', custo: 90, nivel: 6 },
    Neon:      { nome: 'Neon', custo: 100, nivel: 6 },
    Espinhada: { nome: 'Espinhada', custo: 120, nivel: 8 },
    Camuflada: { nome: 'Camuflada', custo: 140, nivel: 8 },
    Fantasma:  { nome: 'Fantasma', custo: 150, nivel: 10 },
    ArcoIris:  { nome: 'Arco-íris', custo: 180, nivel: 10 },
    Dourada:   { nome: 'Dourada', custo: 200, nivel: 11 },
    Metalica:  { nome: 'Metálica', custo: 220, nivel: 12 },
    Toxica:    { nome: 'Tóxica', custo: 240, nivel: 13 },
    Fogo:      { nome: 'Fogo', custo: 260, nivel: 14 },
    Estelar:   { nome: 'Estelar', custo: 300, nivel: 15 },
    Cristal:   { nome: 'Cristal', custo: 320, nivel: 16 },
    Sombria:   { nome: 'Sombria', custo: 350, nivel: 17 },
    Aurora:    { nome: 'Aurora', custo: 380, nivel: 18 },
    Vulcanica: { nome: 'Vulcânica', custo: 420, nivel: 19 },
    Eletrica:  { nome: 'Elétrica', custo: 460, nivel: 20 },
    Prateada:  { nome: 'Prateada', custo: 500, nivel: 21 },
    Sanguinea: { nome: 'Sanguínea', custo: 550, nivel: 22 },
    Realeza:   { nome: 'Realeza', custo: 600, nivel: 23 },
    Marinha:   { nome: 'Marinha', custo: 650, nivel: 24 },
    Celestial: { nome: 'Celestial', custo: 700, nivel: 25 },
    Colossal:  { nome: 'Colossal (2x2)', custo: 1000, nivel: 30 },
    Fenix:     { nome: 'Fênix', custo: 1200, nivel: 32 },
    Dragao:    { nome: 'Dragão Ancestral', custo: 1500, nivel: 35 },
    Cavaleiro: { nome: 'Cavaleiro Medieval', custo: 2000, nivel: 36 },
    Runico:    { nome: 'Rúnico Ancestral', custo: 2100, nivel: 37 },
    CircuitoNeon: { nome: 'Circuito Neon', custo: 2400, nivel: 40 },
    Samurai:   { nome: 'Samurai Carmesim', custo: 2600, nivel: 42 },
    Titanio:   { nome: 'Titânio', custo: 2150, nivel: 39 },
    Plasma:    { nome: 'Plasma', custo: 2450, nivel: 41 },
    Obsidiana: { nome: 'Obsidiana', custo: 2700, nivel: 43 },
    Quimera:   { nome: 'Quimera', custo: 2950, nivel: 44 },
    Vazio:     { nome: 'Vazio', custo: 3300, nivel: 46 },
    Lendario:  { nome: 'Lendário', custo: 5000, nivel: 50 }
};
const SKINS = Object.keys(SKIN_INFO);

/* =========================================================
   ESCALA DAS SKINS (quantas células de largura/altura cada
   segmento ocupa — sempre um quadrado NxN, física e visual
   batendo). 1 = padrão (a maioria das skins).
========================================================= */
const SKIN_ESCALA = {
    Colossal: 2,
};

function escalaAtual() {
    return SKIN_ESCALA[skin] || 1;
}

/* =========================================================
   CONFIGURAÇÕES DO MAPA
========================================================= */
const MAPA_INICIAL = 75;
const MAPA_MINIMO = 20;
const MAPA_TAMANHO_TELA = 1;
let mapSize = MAPA_INICIAL;

/* =========================================================
   DADOS SALVOS
========================================================= */
let theme = localStorage.snakeTheme || 'Grama';
let diff = localStorage.snakeDiff || 'Normal';
let rank = JSON.parse(localStorage.snakeRank || '[]');
let name = localStorage.snakeName || '';
let mapMode = localStorage.snakeMapMode || 'Classico';
let skin = localStorage.snakeSkin || 'Solida';

if (skin === 'Cogumelo') {
    skin = 'Solida';
    localStorage.snakeSkin = skin;
}

/* =========================================================
   MOEDAS / XP / SKINS POSSUÍDAS
========================================================= */
let coins = parseInt(localStorage.snakeCoins || '0', 10) || 0;
let totalXP = parseInt(localStorage.snakeXP || '0', 10) || 0;
let ownedSkins = new Set(JSON.parse(localStorage.snakeOwnedSkins || '["Solida","Listrada"]'));
let coinsThisRun = 0;

function playerLevel() { return 1 + Math.floor(totalXP / 100); }
function skinDesbloqueada(nomeSkin) {
    return ownedSkins.has(nomeSkin) || playerLevel() >= SKIN_INFO[nomeSkin].nivel;
}

/* =========================================================
   OBSTÁCULOS / NÍVEL
========================================================= */
let obstacles = new Set();
let level = 1;

/* =========================================================
   VARIÁVEIS DO JOGO
========================================================= */
let s = [];
let prevS = [];               // posição anterior de cada segmento, p/ animação suave
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

/* ---------------- tempo ---------------- */
let start = 0;
let pausedAt = 0;
let totalPaused = 0;
let gameTime = 0;
let lastMove = 0;

/* ---------------- rgb ---------------- */
let nextRgbScore = 20;

/* ---------------- modo velocidade ---------------- */
let velocidadeExtraApple = 0;

/* ---------------- modo caos ---------------- */
let proximoEventoCaos = 0;
let efeitoTemporario = null;
let mensagemEvento = '';
let mensagemEventoAte = 0;

/* =========================================================
   ELEMENTOS
========================================================= */
const $ = id => document.getElementById(id);
const cv = $('canvas');
const ctx = cv.getContext('2d');
$('name').value = name;

/* =========================================================
   COR
========================================================= */
function col(a) { return `rgb(${a[0]}, ${a[1]}, ${a[2]})`; }

function hexParaRgb(hex) {
    const v = hex.replace('#', '');
    return [parseInt(v.substring(0, 2), 16), parseInt(v.substring(2, 4), 16), parseInt(v.substring(4, 6), 16)];
}
function corEscura(hex) {
    const a = hexParaRgb(hex);
    return `rgb(${a[0] * 0.45 | 0}, ${a[1] * 0.45 | 0}, ${a[2] * 0.45 | 0})`;
}
function misturarComPreto(hex, fator) {
    const a = hexParaRgb(hex), f = 1 - fator;
    return `rgb(${a[0] * f | 0}, ${a[1] * f | 0}, ${a[2] * f | 0})`;
}

/* =========================================================
   DESENHAR SEGMENTO DA COBRA (por skin)
========================================================= */
function desenharSegmento(px, py, cell, i, tamanho) {
    const m = cell * 0.05;
    const tam = cell * 0.90;

    if (skin === 'Listrada') {
        ctx.fillStyle = (i % 2 === 0) ? color : corEscura(color);
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Gradiente') {
        const t2 = tamanho > 1 ? i / (tamanho - 1) : 0;
        ctx.fillStyle = misturarComPreto(color, t2 * 0.65);
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Neon') {
        ctx.shadowBlur = cell * 0.6;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Retro') {
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
        const espinho = cell * 0.18;
        ctx.beginPath();
        ctx.moveTo(px, py + cell / 2 - espinho);
        ctx.lineTo(px - espinho, py + cell / 2);
        ctx.lineTo(px, py + cell / 2 + espinho);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + cell, py + cell / 2 - espinho);
        ctx.lineTo(px + cell + espinho, py + cell / 2);
        ctx.lineTo(px + cell, py + cell / 2 + espinho);
        ctx.closePath(); ctx.fill();

    } else if (skin === 'Fantasma') {
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, cell * 0.06);
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'ArcoIris') {
        const matiz = (i * 18 + Date.now() / 15) % 360;
        ctx.fillStyle = `hsl(${matiz}, 80%, 55%)`;
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Metalica') {
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
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
        const onda = Math.sin(Date.now() / 90 + i) * 0.5 + 0.5;
        const fogoCores = [[255, 60, 0], [255, 150, 0], [255, 220, 60]];
        const idx = onda * (fogoCores.length - 1);
        const baixo = fogoCores[Math.floor(idx)];
        const alto = fogoCores[Math.min(fogoCores.length - 1, Math.ceil(idx))];
        const frac = idx - Math.floor(idx);
        const r = (baixo[0] + (alto[0] - baixo[0]) * frac) | 0;
        const g = (baixo[1] + (alto[1] - baixo[1]) * frac) | 0;
        const b = (baixo[2] + (alto[2] - baixo[2]) * frac) | 0;
        ctx.shadowBlur = cell * 0.5;
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Camuflada') {
        const tons = ['#3a4d2b', '#5a6b3a', '#2e3b22', '#6f7a4a'];
        ctx.fillStyle = tons[(i * 7 + Math.floor(px + py)) % tons.length];
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Dourada') {
        const brilho = Math.sin(Date.now() / 200 + i * 0.6) * 0.5 + 0.5;
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
        grad.addColorStop(0, '#7a5a10');
        grad.addColorStop(0.5, `rgba(255, 215, 90, ${0.6 + brilho * 0.4})`);
        grad.addColorStop(1, '#7a5a10');
        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = '#fff2b0';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Toxica') {
        const pulso = Math.sin(Date.now() / 150 + i * 0.8) * 0.5 + 0.5;
        ctx.shadowBlur = cell * (0.3 + pulso * 0.4);
        ctx.shadowColor = '#7cff2b';
        ctx.fillStyle = '#4ea60f';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.fillStyle = `rgba(180, 255, 60, ${0.3 + pulso * 0.4})`;
        ctx.fillRect(px + cell * 0.3, py + cell * 0.3, cell * 0.25, cell * 0.25);

    } else if (skin === 'Estelar') {
        ctx.fillStyle = '#140a2e';
        ctx.fillRect(px + m, py + m, tam, tam);
        const semente = (i * 9301 + 49297) % 233280;
        for (let e = 0; e < 3; e++) {
            const s1 = (semente * (e + 1) * 9301) % 233280;
            const s2 = (semente * (e + 3) * 49297) % 233280;
            const ex = px + m + (s1 / 233280) * tam;
            const ey = py + m + (s2 / 233280) * tam;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ex, ey, Math.max(1, cell * 0.08), Math.max(1, cell * 0.08));
        }

    } else if (skin === 'Cristal') {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#b39dff';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#eae0ff';
        ctx.lineWidth = Math.max(1, cell * 0.05);
        ctx.beginPath();
        ctx.moveTo(px + cell * 0.5, py + m);
        ctx.lineTo(px + tam + m, py + cell * 0.5);
        ctx.lineTo(px + cell * 0.5, py + tam + m);
        ctx.lineTo(px + m, py + cell * 0.5);
        ctx.closePath(); ctx.stroke();

    } else if (skin === 'Sombria') {
        ctx.fillStyle = (i % 3 === 0) ? '#1a1a22' : '#050508';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(140, 120, 200, 0.35)';
        ctx.lineWidth = Math.max(1, cell * 0.04);
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Aurora') {
        const matiz = (i * 12 + Date.now() / 40) % 360;
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = `hsl(${matiz}, 70%, 70%)`;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.globalAlpha = 1;

    } else if (skin === 'Vulcanica') {
        ctx.fillStyle = '#1a0a05';
        ctx.fillRect(px + m, py + m, tam, tam);
        const brilho = Math.sin(Date.now() / 120 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, ${(80 + brilho * 80) | 0}, 0, ${0.5 + brilho * 0.5})`;
        ctx.fillRect(px + cell * 0.35, py + cell * 0.35, cell * 0.3, cell * 0.3);

    } else if (skin === 'Eletrica') {
        const pulso = Math.sin(Date.now() / 80 + i * 1.1) * 0.5 + 0.5;
        ctx.shadowBlur = cell * (0.4 + pulso * 0.5);
        ctx.shadowColor = '#7ad0ff';
        ctx.fillStyle = '#1e6fbf';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.fillStyle = `rgba(220, 240, 255, ${0.4 + pulso * 0.5})`;
        ctx.fillRect(px + cell * 0.4, py + m, cell * 0.2, tam);

    } else if (skin === 'Prateada') {
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
        grad.addColorStop(0, '#b8b8c0');
        grad.addColorStop(0.5, '#f4f4f8');
        grad.addColorStop(1, '#8c8c94');
        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Sanguinea') {
        const pulso = Math.sin(Date.now() / 160 + i * 0.7) * 0.5 + 0.5;
        ctx.shadowBlur = cell * (0.25 + pulso * 0.35);
        ctx.shadowColor = '#a00010';
        ctx.fillStyle = '#6a0010';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.fillStyle = `rgba(255, 20, 40, ${0.3 + pulso * 0.3})`;
        ctx.fillRect(px + cell * 0.3, py + cell * 0.3, cell * 0.25, cell * 0.25);

    } else if (skin === 'Realeza') {
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
        grad.addColorStop(0, '#3a0a5c');
        grad.addColorStop(0.5, '#7a2fc0');
        grad.addColorStop(1, '#ffd75a');
        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = '#ffe89a';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Marinha') {
        const onda = Math.sin(Date.now() / 150 + i * 0.6) * 0.5 + 0.5;
        const a1 = [0, 40, 90], a2 = [0, 130, 180];
        const r = (a1[0] + (a2[0] - a1[0]) * onda) | 0;
        const g = (a1[1] + (a2[1] - a1[1]) * onda) | 0;
        const b = (a1[2] + (a2[2] - a1[2]) * onda) | 0;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(px + m, py + m, tam, tam);

    } else if (skin === 'Celestial') {
        ctx.fillStyle = '#0a1030';
        ctx.fillRect(px + m, py + m, tam, tam);
        const semente = (i * 5501 + 13001) % 199999;
        for (let e = 0; e < 3; e++) {
            const s1 = (semente * (e + 1) * 7013 + Date.now() / 500) % 199999;
            const s2 = (semente * (e + 2) * 3011) % 199999;
            const ex = px + m + (s1 / 199999) * tam;
            const ey = py + m + (s2 / 199999) * tam;
            ctx.fillStyle = '#bcd8ff';
            ctx.fillRect(ex, ey, Math.max(1, cell * 0.08), Math.max(1, cell * 0.08));
        }

    } else if (skin === 'Colossal') {
        /* Ocupa fisicamente um bloco 2x2 (célula
           atual + as 3 vizinhas: direita, baixo e
           diagonal) — o desenho é um quadrado do
           mesmo tamanho da hitbox real. */
        const tamanhoQuadrado = (cell * 2) - (m * 2);

        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tamanhoQuadrado, tamanhoQuadrado);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = Math.max(1, cell * 0.05);
        ctx.strokeRect(px + m, py + m, tamanhoQuadrado, tamanhoQuadrado);

    } else if (skin === 'Fenix') {
        const pulso = Math.sin(Date.now() / 100 + i * 0.5) * 0.5 + 0.5;
        const cx = px + cell / 2, cy = py + cell / 2;

        const grad = ctx.createRadialGradient(cx, cy, cell * 0.05, cx, cy, cell * 0.55);
        grad.addColorStop(0, '#fff6d0');
        grad.addColorStop(0.35, '#ffb020');
        grad.addColorStop(0.7, '#ff5500');
        grad.addColorStop(1, `rgba(160, 20, 0, ${0.35 + pulso * 0.3})`);

        ctx.shadowBlur = cell * (0.5 + pulso * 0.4);
        ctx.shadowColor = '#ff6a00';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, cell * 0.44, 0, Math.PI * 2);
        ctx.fill();

        for (let k = 0; k < 2; k++) {
            const ang = ((i * 47 + k * 180 + Date.now() / 18) % 360) * Math.PI / 180;
            const dist = cell * 0.4;
            const fx = cx + Math.cos(ang) * dist;
            const fy = cy + Math.sin(ang) * dist;
            ctx.fillStyle = 'rgba(255, 225, 140, 0.85)';
            ctx.fillRect(fx, fy, cell * 0.09, cell * 0.09);
        }

    } else if (skin === 'Dragao') {
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
        grad.addColorStop(0, '#0a2e1a');
        grad.addColorStop(0.5, '#1c5c34');
        grad.addColorStop(1, '#0a2e1a');
        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);

        ctx.fillStyle = 'rgba(255, 215, 90, 0.28)';
        ctx.beginPath();
        ctx.arc(px + cell * 0.3, py + cell * 0.32, cell * 0.11, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + cell * 0.68, py + cell * 0.62, cell * 0.11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffd75a';
        ctx.beginPath();
        ctx.moveTo(px + cell * 0.5 - cell * 0.13, py + m);
        ctx.lineTo(px + cell * 0.5, py - cell * 0.16);
        ctx.lineTo(px + cell * 0.5 + cell * 0.13, py + m);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 215, 90, 0.5)';
        ctx.lineWidth = Math.max(1, cell * 0.04);
        ctx.strokeRect(px + m, py + m, tam, tam);


        ctx.fillStyle = '#fff3d6';
        ctx.fillRect(px + m, py + m + capaAltura, tamanhoQuadrado, tamanhoQuadrado - capaAltura);
        ctx.strokeStyle = 'rgba(120, 90, 40, 0.4)';
        ctx.lineWidth = Math.max(1, cell * 0.03);
        ctx.strokeRect(px + m, py + m + capaAltura, tamanhoQuadrado, tamanhoQuadrado - capaAltura);

        // boné (parte de cima)
        const gradCapa = ctx.createLinearGradient(px, py, px, py + capaAltura);
        gradCapa.addColorStop(0, '#ff7a6a');
        gradCapa.addColorStop(1, '#c81e1e');
        ctx.shadowBlur = cell * 0.25;
        ctx.shadowColor = '#ff3c3c';
        ctx.fillStyle = gradCapa;
        ctx.fillRect(px + m, py + m, tamanhoQuadrado, capaAltura);
        ctx.shadowBlur = 0;

        // pintinhas brancas
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.beginPath(); ctx.arc(px + tamanhoQuadrado * 0.28, py + m + capaAltura * 0.4, cell * 0.13, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + tamanhoQuadrado * 0.7, py + m + capaAltura * 0.55, cell * 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + tamanhoQuadrado * 0.5, py + m + capaAltura * 0.18, cell * 0.09, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = Math.max(1, cell * 0.05);
        ctx.strokeRect(px + m, py + m, tamanhoQuadrado, tamanhoQuadrado);

    } else if (skin === 'Cavaleiro') {
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
        grad.addColorStop(0, '#9aa0ac');
        grad.addColorStop(0.5, '#d4d9e2');
        grad.addColorStop(1, '#5c616c');
        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = Math.max(1, cell * 0.05);
        ctx.strokeRect(px + m, py + m, tam, tam);
        if (i % 3 === 0) {
            ctx.fillStyle = '#b3121c';
            ctx.fillRect(px + cell * 0.44, py + cell * 0.18, cell * 0.12, cell * 0.64);
            ctx.fillRect(px + cell * 0.22, py + cell * 0.42, cell * 0.56, cell * 0.12);
        }

    } else if (skin === 'CircuitoNeon') {
        ctx.fillStyle = '#050b12';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.shadowBlur = cell * 0.4;
        ctx.shadowColor = '#00eaff';
        ctx.strokeStyle = '#00eaff';
        ctx.lineWidth = Math.max(1, cell * 0.05);
        ctx.beginPath();
        ctx.moveTo(px + m, py + cell * 0.5);
        ctx.lineTo(px + cell * 0.4, py + cell * 0.5);
        ctx.lineTo(px + cell * 0.4, py + m);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px + cell * 0.6, py + tam + m);
        ctx.lineTo(px + cell * 0.6, py + cell * 0.5);
        ctx.lineTo(px + tam + m, py + cell * 0.5);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00eaff';
        ctx.beginPath();
        ctx.arc(px + cell * 0.4, py + cell * 0.5, cell * 0.06, 0, Math.PI * 2);
        ctx.fill();

    } else if (skin === 'Samurai') {
        ctx.fillStyle = (i % 2 === 0) ? '#c81e2e' : '#f5f0e6';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = Math.max(1, cell * 0.06);
        ctx.strokeRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(255, 215, 90, 0.7)';
        ctx.lineWidth = Math.max(1, cell * 0.03);
        ctx.beginPath();
        ctx.moveTo(px + m, py + cell * 0.5);
        ctx.lineTo(px + tam + m, py + cell * 0.5);
        ctx.stroke();

    } else if (skin === 'Runico') {
        ctx.fillStyle = '#2b2b33';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + m, py + m, tam, tam);
        ctx.shadowBlur = cell * 0.35;
        ctx.shadowColor = '#c878ff';
        ctx.strokeStyle = 'rgba(200, 120, 255, 0.85)';
        ctx.lineWidth = Math.max(1, cell * 0.045);
        const cx = px + cell / 2, cy = py + cell / 2, rr = cell * 0.22;
        ctx.beginPath();
        ctx.moveTo(cx, cy - rr);
        ctx.lineTo(cx + rr, cy);
        ctx.lineTo(cx, cy + rr);
        ctx.lineTo(cx - rr, cy);
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;

    } else if (skin === 'Titanio') {
        const grad = ctx.createLinearGradient(px, py, px + cell, py + cell);
        grad.addColorStop(0, '#3a4048');
        grad.addColorStop(0.5, '#8a95a3');
        grad.addColorStop(1, '#20242a');
        ctx.fillStyle = grad;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(160, 190, 210, 0.6)';
        ctx.lineWidth = Math.max(1, cell * 0.04);
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Plasma') {
        const pulso = Math.sin(Date.now() / 90 + i * 0.9) * 0.5 + 0.5;
        const cx = px + cell / 2, cy = py + cell / 2;
        const grad = ctx.createRadialGradient(cx, cy, cell * 0.05, cx, cy, cell * 0.5);
        grad.addColorStop(0, '#f0d0ff');
        grad.addColorStop(0.4, '#b040ff');
        grad.addColorStop(1, `rgba(60, 0, 120, ${0.3 + pulso * 0.3})`);
        ctx.shadowBlur = cell * (0.4 + pulso * 0.4);
        ctx.shadowColor = '#b040ff';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, cell * 0.42, 0, Math.PI * 2);
        ctx.fill();

    } else if (skin === 'Obsidiana') {
        ctx.fillStyle = '#0a0a0d';
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(150, 100, 255, 0.4)';
        ctx.lineWidth = Math.max(1, cell * 0.04);
        ctx.strokeRect(px + m, py + m, tam, tam);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.moveTo(px + cell * 0.2, py + cell * 0.2);
        ctx.lineTo(px + cell * 0.45, py + cell * 0.2);
        ctx.lineTo(px + cell * 0.25, py + cell * 0.45);
        ctx.closePath();
        ctx.fill();

    } else if (skin === 'Quimera') {
        const cores = ['#ff5050', '#50ff90', '#5090ff', '#ffe050'];
        ctx.fillStyle = cores[(i + Math.floor(px + py)) % cores.length];
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = Math.max(1, cell * 0.04);    
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else if (skin === 'Vazio') {
        ctx.fillStyle = '#000';
        ctx.fillRect(px + m, py + m, tam, tam);
        const pulso = Math.sin(Date.now() / 130 + i) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(120, 60, 200, ${0.4 + pulso * 0.4})`;
        ctx.lineWidth = Math.max(1, cell * 0.06);
        ctx.beginPath();
        ctx.arc(px + cell / 2, py + cell / 2, cell * (0.15 + pulso * 0.15), 0, Math.PI * 2);
        ctx.stroke();

    } else if (skin === 'Lendario') {
        const matiz = (i * 20 + Date.now() / 10) % 360;
        ctx.shadowBlur = cell * 0.7;
        ctx.shadowColor = `hsl(${matiz}, 100%, 60%)`;
        ctx.fillStyle = `hsl(${matiz}, 100%, 60%)`;
        ctx.fillRect(px + m, py + m, tam, tam);
        ctx.strokeStyle = '#fff8d0';
        ctx.lineWidth = Math.max(1, cell * 0.05);
        ctx.strokeRect(px + m, py + m, tam, tam);

    } else {
        ctx.fillStyle = color;
        ctx.fillRect(px + m, py + m, tam, tam);
    }
}

/* =========================================================
   APLICAR TEMA
========================================================= */
function apply() {
    const t = T[theme];
    document.documentElement.style.setProperty('--bg', col(t[0]));
    document.documentElement.style.setProperty('--c1', col(t[1]));
    document.documentElement.style.setProperty('--c2', col(t[2]));
    document.documentElement.style.setProperty('--border', col(t[3]));
    document.documentElement.style.setProperty('--text', '#fff');
    $('dh').textContent = diff;
}
apply();

/* =========================================================
   RESIZE
========================================================= */
function resize() {
    const r = cv.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * d;
    cv.height = r.height * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
}

function getMapArea() {
    const r = cv.getBoundingClientRect();
    const menor = Math.min(r.width, r.height);
    const tamanho = menor * MAPA_TAMANHO_TELA;
    const cell = tamanho / mapSize;
    return { cell, size: tamanho, x: (r.width - tamanho) / 2, y: (r.height - tamanho) / 2 };
}

window.onresize = () => { resize(); draw(); };

/* =========================================================
   POSIÇÃO ALEATÓRIA / TEMPO
========================================================= */
function rnd() {
    const margem = 3;

    return {
        x: Math.floor(margem + Math.random() * (mapSize - margem * 2)),
        y: Math.floor(margem + Math.random() * (mapSize - margem * 2))
    };
}

function formatarTempo(segundos) {
    const s = Math.max(0, Math.floor(segundos || 0));
    const m = Math.floor(s / 60), r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
}

function obsKey(x, y) { return x + ',' + y; }
function isObstacle(p) { return obstacles.has(obsKey(p.x, p.y)); }

function normalizarCelula(c) {
    if (mapMode !== 'SemParede') return c;
    let x = c.x, y = c.y;
    if (x < 0) x = mapSize - 1;
    if (x >= mapSize) x = 0;
    if (y < 0) y = mapSize - 1;
    if (y >= mapSize) y = 0;
    return { x, y };
}
function celulasOcupadasPorSegmento(p) {
    const escala = escalaAtual();
    const base = [];

    for (let dx = 0; dx < escala; dx++) {
        for (let dy = 0; dy < escala; dy++) {
            base.push({
                x: p.x + dx,
                y: p.y + dy
            });
        }
    }

    return base.map(normalizarCelula);
}
function occupied(p) {
    return s.some(q => celulasOcupadasPorSegmento(q).some(c => c.x === p.x && c.y === p.y)) ||
        isObstacle(p) ||
        foods.some(f => f.x === p.x && f.y === p.y) ||
        (rgbOn && rgb && rgb.x === p.x && rgb.y === p.y);
}

/* =========================================================
   MODO OBSTÁCULOS
========================================================= */
function ajustarObstaculos() {
    obstacles.forEach(chave => {
        const [ox, oy] = chave.split(',').map(Number);
        if (ox >= mapSize || oy >= mapSize) obstacles.delete(chave);
    });
    const centro = Math.floor(mapSize / 2);
    const qtdAlvo = Math.floor(mapSize * mapSize * 0.025);
    let tentativas = 0;
    while (obstacles.size < qtdAlvo && tentativas < 500) {
        tentativas++;
        const p = rnd();
        if (Math.abs(p.x - centro) < 4 && Math.abs(p.y - centro) < 4) continue;
        if (occupied(p)) continue;
        obstacles.add(obsKey(p.x, p.y));
    }
}
function prepararModoMapa() { if (mapMode === 'Obstaculos') ajustarObstaculos(); }

/* =========================================================
   VELOCIDADE
========================================================= */
function velocidadeAtual() {
    const base = D[diff][0];
    const fatorNivel = (mapMode === 'Velocidade') ? 1.4 : 0.8;
    let bonus = (level - 1) * fatorNivel;
    bonus += velocidadeExtraApple;
    if (efeitoTemporario && efeitoTemporario.tipo === 'velocidade' && gameTime < efeitoTemporario.ate) bonus += 6;
    return Math.min(base + bonus, base + 18);
}

/* =========================================================
   MODO CAOS
========================================================= */
function agendarProximoEventoCaos() { proximoEventoCaos = gameTime + 15 + Math.random() * 10; }

function dispararEventoCaos() {
    const eventos = ['velocidade', 'macaFugitiva', 'espelho'];
    const tipo = eventos[Math.floor(Math.random() * eventos.length)];
    if (tipo === 'velocidade') {
        efeitoTemporario = { tipo: 'velocidade', ate: gameTime + 4 };
        mensagemEvento = '⚡ Rajada de velocidade!';
    } else if (tipo === 'macaFugitiva') {
        if (foods.length) {
            const idx = Math.floor(Math.random() * foods.length);
            const nova = spawnUmaMaca();
            if (nova) foods[idx] = nova;
        }
        mensagemEvento = '🍎 Maçã fugitiva!';
    } else if (tipo === 'espelho') {
        efeitoTemporario = { tipo: 'espelho', ate: gameTime + 4 };
        mensagemEvento = '🔀 Controles invertidos!';
    }
    mensagemEventoAte = gameTime + 2.5;
    agendarProximoEventoCaos();
}

/* =========================================================
   MODO ESPELHO
========================================================= */
function direcaoAtiva(d) {
    const espelhoAtivo = mapMode === 'Espelho' ||
        (efeitoTemporario && efeitoTemporario.tipo === 'espelho' && gameTime < efeitoTemporario.ate);
    if (!espelhoAtivo) return d;
    const inverso = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    return inverso[d];
}

/* =========================================================
   SPAWN MAÇÃ / RGB
========================================================= */
function spawnUmaMaca() {
    let tentativas = 0, p;
    do {
        p = rnd();
        tentativas++;
        if (tentativas > 1000) return null;
    } while (occupied(p));
    return p;
}
function preencherMacas() {
    const alvo = quantidadeMacas();
    while (foods.length < alvo) {
        const p = spawnUmaMaca();
        if (!p) { if (run) end(); return; }
        foods.push(p);
    }
    if (foods.length > alvo) foods.length = alvo;
}
function spawnRgb() {
    const p = spawnUmaMaca();
    if (!p) { rgbOn = false; rgb = null; return; }
    rgb = p;
}

/* =========================================================
   RESET
========================================================= */
function reset() {
    mapSize = MAPA_INICIAL;
    const c = Math.floor(mapSize / 2), r = Math.floor(mapSize / 2);

    const escala = escalaAtual();

    s = [
        { x: c, y: r },
        { x: c - escala, y: r },
        { x: c - escala * 2, y: r }
    ];

    prevS = s.map(seg => ({ ...seg })); // evita "salto" visual no primeiro frame

    dir = 'RIGHT';
    next = 'RIGHT';
    grow = 0;
    score = 0;
    coinsThisRun = 0;
    color = C[Math.floor(Math.random() * C.length)];
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
    proximoEventoCaos = 15 + Math.random() * 10;
    start = performance.now();
    lastMove = start;
    obstacles = new Set();
    foods = [];
    prepararModoMapa();
    preencherMacas();
}
/* =========================================================
   DIREÇÃO / TECLADO / GESTOS / D-PAD
========================================================= */
function setDir(d) {
    const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (opposite[dir] !== d) next = d;
}

window.onkeydown = e => {
    const k = e.key.toLowerCase();
    if (k === 'arrowup' || k === 'w') setDir(direcaoAtiva('UP'));
    if (k === 'arrowdown' || k === 's') setDir(direcaoAtiva('DOWN'));
    if (k === 'arrowleft' || k === 'a') setDir(direcaoAtiva('LEFT'));
    if (k === 'arrowright' || k === 'd') setDir(direcaoAtiva('RIGHT'));
    if (k === 'escape') togglePause();
};

let sx = 0, sy = 0;
cv.ontouchstart = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
cv.ontouchmove = e => { e.preventDefault(); };
cv.ontouchend = e => {
    const x = e.changedTouches[0].clientX - sx;
    const y = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(x), Math.abs(y)) < 25) return;
    if (Math.abs(x) > Math.abs(y)) setDir(direcaoAtiva(x > 0 ? 'RIGHT' : 'LEFT'));
    else setDir(direcaoAtiva(y > 0 ? 'DOWN' : 'UP'));
};

function configurarDpad() {
    const botoes = [
        { id: 'dpadUp', direcao: 'UP' }, { id: 'dpadDown', direcao: 'DOWN' },
        { id: 'dpadLeft', direcao: 'LEFT' }, { id: 'dpadRight', direcao: 'RIGHT' }
    ];
    botoes.forEach(b => {
        const btn = $(b.id);
        if (!btn) return;
        const acionar = e => { e.preventDefault(); setDir(direcaoAtiva(b.direcao)); };
        btn.addEventListener('touchstart', acionar, { passive: false });
        btn.addEventListener('click', acionar);
    });
}
configurarDpad();

/* =========================================================
   DIMINUIR MAPA
========================================================= */
function shrinkMap() {
    if (mapSize <= MAPA_MINIMO) return;
    mapSize -= 2;
    prepararModoMapa();
    foods = foods.filter(f => f.x < mapSize && f.y < mapSize && !isObstacle(f));
    preencherMacas();
    if (rgbOn && rgb && (rgb.x >= mapSize || rgb.y >= mapSize || isObstacle(rgb))) spawnRgb();
}

/* =========================================================
   MOVIMENTO
========================================================= */
function move() {
    prevS = s.map(seg => ({ ...seg }));

    dir = next;

    const escala = escalaAtual();
    const h = { ...s[0] };

    if (dir === 'UP') h.y--;
    if (dir === 'DOWN') h.y++;
    if (dir === 'LEFT') h.x--;
    if (dir === 'RIGHT') h.x++;

    if (mapMode === 'SemParede') {
        if (h.x < 0) h.x = mapSize - 1;
        if (h.x >= mapSize) h.x = 0;
        if (h.y < 0) h.y = mapSize - 1;
        if (h.y >= mapSize) h.y = 0;
    } else {
            const foraDosLimites =
                celulasOcupadasPorSegmento(h).some(c =>
                    c.x < 0 ||
                    c.x >= mapSize ||
                    c.y < 0 ||
                    c.y >= mapSize
                );

            if (foraDosLimites) {
                end();
                return;
            }
        }

        const celulasHead = celulasOcupadasPorSegmento(h);

        const colidiuObstaculo = celulasHead.some(c => isObstacle(c));

        /*
        Na Colossal 2x2, quando ela anda uma célula,
        a nova cabeça naturalmente ocupa parte do espaço
        da cabeça anterior.

        Por isso o primeiro segmento antigo é ignorado
        na colisão. Para as outras partes da cobra,
        a colisão continua normal.
        */
        const colidiuCorpo = s.some((p, i) => {
    if (i === 0) return false;

    // Na skin 2x2, ignora o segmento imediatamente atrás da cabeça
            if (escala > 1 && i === 1) return false;

            const celulasCorpo = celulasOcupadasPorSegmento(p);

            return celulasCorpo.some(bc =>
                celulasHead.some(hc =>
                    hc.x === bc.x && hc.y === bc.y
                )
            );
        });

        if (colidiuObstaculo || colidiuCorpo) {
            end();
            return;
        }

        s.unshift(h);

        const idxComida = foods.findIndex(f =>
            celulasHead.some(c => c.x === f.x && c.y === f.y)
        );

        if (idxComida !== -1) {
            score += D[diff][1] * MULTIPLICADOR_MACA;
            grow += D[diff][1] * MULTIPLICADOR_MACA;

            coinsThisRun += 2;

            color = C[Math.floor(Math.random() * C.length)];

            if (mapMode === 'Velocidade') {
                velocidadeExtraApple =
                    Math.min(velocidadeExtraApple + 0.3, 10);
            }

            foods.splice(idxComida, 1);
            preencherMacas();

            if (!rgbOn && score >= nextRgbScore) {
                rgbOn = true;
                spawnRgb();
                nextRgbScore += 10;
            }
        }

        if (
            rgbOn &&
            rgb &&
            celulasHead.some(c =>
                c.x === rgb.x && c.y === rgb.y
            )
        ) {
            score += 5 * D[diff][1] * MULTIPLICADOR_MACA;
            grow += 5 * D[diff][1] * MULTIPLICADOR_MACA;

            coinsThisRun += 4;

            color = C[Math.floor(Math.random() * C.length)];

            rgbOn = false;
            rgb = null;

            if (foods.length) {
                const idxRealoca =
                    Math.floor(Math.random() * foods.length);

                const novaPos = spawnUmaMaca();

                if (novaPos) {
                    foods[idxRealoca] = novaPos;
                }
            }
        }

        if (grow > 0) {
            grow--;
        } else {
            s.pop();
        }
    }

    /* =========================================================
    DESENHAR
    ========================================================= */
    function draw() {
        const r = cv.getBoundingClientRect();
        const t = T[theme];
        const area = getMapArea();
        const cell = area.cell;

        const intervaloAtual = 1000 / velocidadeAtual();
        const tLerp = (paused || !run) ? 1 : Math.min(1, (performance.now() - lastMove) / intervaloAtual);

        ctx.clearRect(0, 0, r.width, r.height);
        ctx.fillStyle = col(t[0]);
        ctx.fillRect(0, 0, r.width, r.height);

        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                ctx.fillStyle = (x + y) % 2 ? col(t[2]) : col(t[1]);
                ctx.fillRect(area.x + x * cell, area.y + y * cell, Math.ceil(cell) + 1, Math.ceil(cell) + 1);
            }
        }

        ctx.strokeStyle = col(t[3]);
        ctx.lineWidth = Math.max(2, cell * 0.08);
        ctx.strokeRect(area.x + 1, area.y + 1, area.size - 2, area.size - 2);

        if (obstacles.size) {
            ctx.fillStyle = 'rgba(90, 90, 100, 0.95)';
            obstacles.forEach(key => {
                const [ox, oy] = key.split(',').map(Number);
                ctx.fillRect(area.x + ox * cell, area.y + oy * cell, Math.ceil(cell) + 1, Math.ceil(cell) + 1);
            });
        }

        foods.forEach(f => {
            ctx.fillStyle = '#ff3c3c';
            ctx.fillRect(area.x + f.x * cell + cell * 0.12, area.y + f.y * cell + cell * 0.12, cell * 0.76, cell * 0.76);
        });

        if (rgbOn && rgb) {
            ctx.save();
            const hue = (performance.now() / 6) % 360;
            ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
            ctx.shadowBlur = cell * 0.6;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fillRect(area.x + rgb.x * cell + cell * 0.10, area.y + rgb.y * cell + cell * 0.10, cell * 0.80, cell * 0.80);
            ctx.restore();
        }

        s.forEach((p, i) => {
            const src = (i === 0) ? prevS[0] : prevS[i - 1];
            let gx = p.x, gy = p.y;
            if (src) {
                let dx = p.x - src.x, dy = p.y - src.y;
                if (dx > mapSize / 2) dx -= mapSize; else if (dx < -mapSize / 2) dx += mapSize;
                if (dy > mapSize / 2) dy -= mapSize; else if (dy < -mapSize / 2) dy += mapSize;
                gx = src.x + dx * tLerp;
                gy = src.y + dy * tLerp;
            }
            const px = area.x + gx * cell;
            const py = area.y + gy * cell;

            ctx.save();
            desenharSegmento(px, py, cell, i, s.length);
            ctx.restore();

            if (i === 0) {
                ctx.fillStyle = '#111';
                const olho = Math.max(2, cell * 0.13);
                ctx.fillRect(px + cell * 0.25, py + cell * 0.25, olho, olho);
                ctx.fillRect(px + cell * 0.65, py + cell * 0.25, olho, olho);
            }
        });
    }

    /* =========================================================
    HUD
    ========================================================= */
    function hud() {
        $('score').textContent = score;

        if (mapMode === 'Tempo') {
            $('time').textContent = Math.max(0, Math.ceil(LIMITE_TEMPO_MODO - gameTime)) + 's';
        } else {
            $('time').textContent = Math.floor(gameTime) + 's';
        }

        $('lvl').textContent = 'Nível ' + level;

        if (mapMode === 'Caos' && gameTime < mensagemEventoAte) {
            $('toastEvento').textContent = mensagemEvento;
            $('toastEvento').classList.remove('hide');
        } else {
            $('toastEvento').classList.add('hide');
        }

        const label = document.querySelector('#wrap label');
        if (label) label.textContent = `MAPA ${mapSize}×${mapSize} · ${MAPMODE_LABEL[mapMode]}`;
    }

    /* =========================================================
    LOOP PRINCIPAL
    ========================================================= */
    function loop(now) {
        if (!run) return;

        if (!paused) {
            gameTime = (now - start - totalPaused) / 1000;
            if (gameTime < 0) gameTime = 0;

            const novoNivel = 1 + Math.floor(gameTime / 20);
            if (novoNivel !== level) level = novoNivel;

            if (mapMode === 'Tempo' && gameTime >= LIMITE_TEMPO_MODO) { end(); return; }
            if (mapMode === 'Caos' && gameTime >= proximoEventoCaos) dispararEventoCaos();

            if (now - lastMove >= 1000 / velocidadeAtual()) {
                lastMove = now;
                move();
            }

            if (modoEncolheMapa()) {
                const reducoes = Math.floor(gameTime / 60);
                const tamanhoEsperado = Math.max(MAPA_MINIMO, MAPA_INICIAL - reducoes * 2);
                if (tamanhoEsperado < mapSize) shrinkMap();
            }

            hud();
            draw();
        }

        requestAnimationFrame(loop);
    }

    /* =========================================================
    NAVEGAÇÃO ENTRE TELAS
    ========================================================= */
    const TELAS = ['home', 'ranking', 'game', 'menuSkins'];
    function showScreen(id) {
        TELAS.forEach(s => $(s).classList.add('hide'));
        $(id).classList.remove('hide');
    }

    function atualizarStatusJogador() {
        if ($('homeCoins')) $('homeCoins').textContent = coins;
        if ($('homeLevel')) $('homeLevel').textContent = playerLevel();
    }

    /* =========================================================
    COMEÇAR / REINICIAR RODADA
    ========================================================= */
    function startRound() {
        reset();
        run = false;
        paused = false;
        showScreen('game');
        resize();
        draw();
        iniciarContagemRegressiva();
    }

    function begin() {
        name = ($('name').value.trim().slice(0, 12)) || 'Jogador';
        $('name').value = name;
        localStorage.snakeName = name;
        startRound();
    }

    /* =========================================================
    CONTAGEM REGRESSIVA (3, 2, 1)
    ========================================================= */
    function iniciarContagemRegressiva() {
        let restante = 3;
        const elContagem = $('contagem');
        elContagem.textContent = restante;
        elContagem.classList.remove('hide');

        const intervalo = setInterval(() => {
            restante--;
            if (restante > 0) { elContagem.textContent = restante; return; }

            clearInterval(intervalo);
            elContagem.classList.add('hide');

            start = performance.now();
            totalPaused = 0;
            pausedAt = 0;

            const now = performance.now();
            lastMove = now;
            prevS = s.map(seg => ({ ...seg }));

            run = true;
            paused = false;

            requestAnimationFrame(loop);
        }, 1000);
    }

    /* =========================================================
    TELA DE FIM DE JOGO
    ========================================================= */
    function ensureOverlayInfo() {
        let el = document.getElementById('overlayInfo');
        if (!el) {
            el = document.createElement('p');
            el.id = 'overlayInfo';
            el.style.opacity = '0.85';
            el.style.margin = '-8px 0 18px';
            el.style.fontSize = '14px';
            document.querySelector('#overlay h2').insertAdjacentElement('afterend', el);
        }
        return el;
    }

    function showGameOverOverlay() {
        document.querySelector('#overlay h2').textContent = '💀 GAME OVER';
        ensureOverlayInfo().textContent = `${name}: ${score} pts · ${formatarTempo(gameTime)} · +${coinsThisRun} 🪙`;
        $('cont').textContent = '🔁 JOGAR DE NOVO';
        $('reset').classList.add('hide');
        $('overlay').classList.remove('hide');
    }

    function resetOverlayParaPausa() {
        document.querySelector('#overlay h2').textContent = 'PAUSADO';
        const info = document.getElementById('overlayInfo');
        if (info) info.remove();
        $('cont').textContent = '▶ CONTINUAR';
        $('reset').classList.remove('hide');
    }

    /* =========================================================
    FIM DE JOGO
    ========================================================= */
    function end() {
        if (!run) return;
        run = false;

        rank.push({ name, score, time: Math.floor(gameTime), modo: mapMode, diff });
        rank.sort((a, b) => (b.score !== a.score) ? b.score - a.score : b.time - a.time);
        rank = rank.slice(0, 50);
        localStorage.snakeRank = JSON.stringify(rank);

        coins += coinsThisRun;
        totalXP += score;
        localStorage.snakeCoins = coins;
        localStorage.snakeXP = totalXP;

        salvarRanking(name, score, Math.floor(gameTime), mapMode);

        showGameOverOverlay();
    }

    /* =========================================================
    HOME
    ========================================================= */
    function home() {
        run = false;
        paused = false;
        $('overlay').classList.add('hide');
        resetOverlayParaPausa();
        showScreen('home');
        atualizarStatusJogador();
    }

    /* =========================================================
    RANKING (global via Supabase, com fallback local)
    ========================================================= */
    let rankModoSelecionado = null;

    function popularSeletorModoRanking() {
        const select = $('rankModoSelect');
        if (select.options.length === 0) {
            MAPMODES.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = MAPMODE_LABEL[m];
                select.appendChild(opt);
            });
        }
        if (!rankModoSelecionado) rankModoSelecionado = mapMode;
        select.value = rankModoSelecionado;
    }

    function renderRankingLocal() {
        const linhas = rank
            .filter(r => !r.modo || r.modo === rankModoSelecionado)
            .sort((a, b) => (b.score !== a.score) ? b.score - a.score : b.time - a.time)
            .slice(0, 10);

        if (!linhas.length) {
            $('scores').innerHTML = `<div class="row"><span>Nenhuma partida neste modo ainda.</span><b>—</b></div>`;
            return;
        }

        $('scores').innerHTML =
            `<div class="row"><span>📴 Ranking local (sem conexão com o global)</span><b></b></div>` +
            linhas.map((r, i) => {
                const safeName = String(r.name || 'Jogador').replace(/[<>&]/g, '');
                return `<div class="row rankRow"><span>${i + 1}. ${safeName}</span><b>${r.score} pts · ${formatarTempo(r.time)} · ${r.diff || ''}</b></div>`;
            }).join('');
    }

    async function carregarEExibirRanking() {
        $('scores').innerHTML = `<div class="row"><span>Carregando ranking...</span><b>...</b></div>`;

        const rankingGlobal = await carregarRanking(rankModoSelecionado);

        if (!rankingGlobal || !rankingGlobal.length) {
            renderRankingLocal();
            return;
        }

        $('scores').innerHTML = rankingGlobal.map((r, i) => {
            const safeName = String(r.nome).replace(/[<>&]/g, '');
            const dificuldade = String(r.dificuldade || 'Normal').replace(/[<>&]/g, '');
            const tempoFormatado = formatarTempo(r.tempo);
            return `<div class="row rankRow"><span>${i + 1}. ${safeName}</span><b>${r.pontuacao} pts · ${tempoFormatado} · ${dificuldade}</b></div>`;
        }).join('');
    }

    async function showRank() {
        showScreen('ranking');
        popularSeletorModoRanking();
        await carregarEExibirRanking();
    }

    $('rankModoSelect').onchange = () => {
        rankModoSelecionado = $('rankModoSelect').value;
        carregarEExibirRanking();
    };

    /* =========================================================
    PAUSA
    ========================================================= */
    function togglePause() {
        if (!run) return;

        if (!paused) {
            paused = true;
            pausedAt = performance.now();
            resetOverlayParaPausa();
            $('overlay').classList.remove('hide');
            return;
        }

        const agora = performance.now();
        totalPaused += agora - pausedAt;
        paused = false;
        lastMove = agora;
        $('overlay').classList.add('hide');
    }

    /* =========================================================
    BOTÕES
    ========================================================= */
    $('play').onclick = begin;
    $('rank').onclick = showRank;
    $('back').onclick = home;

    $('menu').onclick = () => { if (run) togglePause(); else home(); };
    $('pause').onclick = togglePause;

    $('cont').onclick = () => {
        if (!run) {
            $('overlay').classList.add('hide');
            resetOverlayParaPausa();
            startRound();
        } else {
            togglePause();
        }
    };

    $('reset').onclick = () => {
        reset();
        paused = false;
        $('overlay').classList.add('hide');
        lastMove = performance.now();
    };

    $('tomenu').onclick = home;

    document.querySelectorAll('.voltarMenu').forEach(btn => { btn.onclick = home; });

    /* =========================================================
    NOME
    ========================================================= */
    $('name').oninput = e => { localStorage.snakeName = e.target.value; };

    /* =========================================================
    TEMA (inline na home — grade de swatches)
    ========================================================= */
    function renderTemas() {
        const lista = Object.keys(T);
        $('listaTemas').innerHTML = lista.map(t => {
            const cores = T[t];
            const ativo = (t === theme);
            const corPrincipal = col(cores[1]), corSecundaria = col(cores[2]);
            return `
                <div class="temaSwatch ${ativo ? 'ativa' : ''}" data-tema="${t}" style="background: linear-gradient(135deg, ${corPrincipal}, ${corSecundaria});">
                    <span>${t}</span>
                </div>`;
        }).join('');

        $('listaTemas').querySelectorAll('[data-tema]').forEach(el => {
            el.onclick = () => {
                theme = el.dataset.tema;
                localStorage.snakeTheme = theme;
                apply();
                renderTemas();
            };
        });
    }

    /* =========================================================
    DIFICULDADE (inline na home)
    ========================================================= */
    function renderDificuldades() {
        const lista = Object.keys(D);
        $('listaDificuldades').innerHTML = lista.map(d => {
            const ativo = (d === diff) ? 'ativo' : '';
            return `<button class="opcaoLista ${ativo}" data-diff="${d}">${d}</button>`;
        }).join('');

        $('listaDificuldades').querySelectorAll('[data-diff]').forEach(btn => {
            btn.onclick = () => {
                diff = btn.dataset.diff;
                localStorage.snakeDiff = diff;
                apply();
                renderDificuldades();
            };
        });
    }

    /* =========================================================
    MODO DE MAPA (inline na home)
    ========================================================= */
    function renderModos() {
        $('listaModos').innerHTML = MAPMODES.map(m => {
            const ativo = (m === mapMode) ? 'ativo' : '';
            return `<button class="opcaoLista ${ativo}" data-modo="${m}">${MAPMODE_LABEL[m]}</button>`;
        }).join('');

        $('listaModos').querySelectorAll('[data-modo]').forEach(btn => {
            btn.onclick = () => {
                mapMode = btn.dataset.modo;
                localStorage.snakeMapMode = mapMode;
                apply();
                renderModos();
            };
        });
    }

    /* =========================================================
    MENU: SKINS
    ========================================================= */
    function renderSkins() {
        $('skinsCoins').textContent = coins;
        $('skinsLevel').textContent = playerLevel();

        $('listaSkins').innerHTML = SKINS.map(nomeSkin => {
            const info = SKIN_INFO[nomeSkin];
            const desbloqueada = skinDesbloqueada(nomeSkin);
            const ativa = (nomeSkin === skin);
            let acaoHtml;

            if (ativa) {
                acaoHtml = `<span class="tagSelecionada">SELECIONADA</span>`;
            } else if (desbloqueada) {
                acaoHtml = `<button class="botaoSelecionar" data-selecionar="${nomeSkin}">Selecionar</button>`;
            } else {
                const podeComprar = coins >= info.custo;
                acaoHtml = `
                    <span class="infoBloqueio">Nível ${info.nivel} ou</span>
                    <button class="botaoComprar" data-comprar="${nomeSkin}" ${podeComprar ? '' : 'disabled'}>🪙 ${info.custo}</button>`;
            }

            return `
                <div class="linhaSkin ${ativa ? 'ativa' : ''}">
                    <div class="previaSkin previa-${nomeSkin}"></div>
                    <div class="infoSkin"><b>${info.nome}</b></div>
                    <div class="acaoSkin">${acaoHtml}</div>
                </div>`;
        }).join('');

        $('listaSkins').querySelectorAll('[data-selecionar]').forEach(btn => {
            btn.onclick = () => {
                skin = btn.dataset.selecionar;
                localStorage.snakeSkin = skin;
                apply();
                renderSkins();
            };
        });

        $('listaSkins').querySelectorAll('[data-comprar]').forEach(btn => {
            btn.onclick = () => {
                const nomeSkin = btn.dataset.comprar;
                const info = SKIN_INFO[nomeSkin];
                if (coins < info.custo) return;
                coins -= info.custo;
                ownedSkins.add(nomeSkin);
                localStorage.snakeCoins = coins;
                localStorage.snakeOwnedSkins = JSON.stringify([...ownedSkins]);
                skin = nomeSkin;
                localStorage.snakeSkin = skin;
                apply();
                renderSkins();
            };
        });
    }
    $('openSkins').onclick = () => { renderSkins(); showScreen('menuSkins'); };

    /* =========================================================
    INICIALIZAÇÃO
    ========================================================= */
    resize();
    reset();
    draw();
    atualizarStatusJogador();
    renderTemas();
    renderDificuldades();
    renderModos();
