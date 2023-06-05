"use strict";

class Fase {
    #levelSet;
    #espacoVertical;
    #larguraObstaculos;
    #distanciaObstaculos;
    #numeroObstaculos;
    #vy;
    #vx;
    #gravidade;
    #claro;
    #medio;
    #escuro;
    #irritantes;
    #charts;
    #numero;
    #bg;

    get levelSet           () { return this.#levelSet           ; }
    get espacoVertical     () { return this.#espacoVertical     ; }
    get larguraObstaculos  () { return this.#larguraObstaculos  ; }
    get distanciaObstaculos() { return this.#distanciaObstaculos; }
    get numeroObstaculos   () { return this.#numeroObstaculos   ; }
    get gravidade          () { return this.#gravidade          ; }
    get vx                 () { return this.#vx                 ; }
    get vy                 () { return this.#vy                 ; }
    get bg                 () { return this.#bg                 ; }
    get claro              () { return this.#claro              ; }
    get medio              () { return this.#medio              ; }
    get escuro             () { return this.#escuro             ; }
    get irritantes         () { return this.#irritantes         ; }
    get charts             () { return this.#charts             ; }

    constructor(
            levelSet,
            espacoVertical, vx, vy, larguraObstaculos, numeroObstaculos, distanciaObstaculos, gravidade,
            claro, medio, escuro, bg,
            irritantes, charts
    ) {
        this.#levelSet = levelSet;
        this.#espacoVertical = espacoVertical;
        this.#larguraObstaculos = larguraObstaculos;
        this.#distanciaObstaculos = distanciaObstaculos;
        this.#numeroObstaculos = numeroObstaculos;
        this.#vx = vx;
        this.#vy = vy;
        this.#gravidade = gravidade;
        this.#claro = claro;
        this.#medio = medio;
        this.#escuro = escuro;
        this.#irritantes = irritantes;
        this.#charts = charts;
        this.#bg = bg;
    }

    set numero(n)  { this.#numero = n;    }
    get numero()   { return this.#numero; }
    get ultima()   { return this.#numero == this.levelSet.length; }
    get proxima()  { return this.ultima ? null : this.levelSet.levels[this.numero]; }
    get anterior() { return this.numero === 1 ? null : this.levelSet.levels[this.numero - 2]; }

    openMe() {
        if (!this.open) this.levelSet.open = this.numero;
    }

    get open() {
        return this.levelSet.open >= this.numero;
    }
}

class LevelSet {
    #levels;
    #open;

    constructor(levelsCtor) {
        this.#levels = levelsCtor(this);
        Object.freeze(this.levels);

        for (let i = 0; i < this.length; i++) {
            this.levels[i].numero = i + 1;
            Object.freeze(this.levels[i]);
        }

        this.#open = 1;
        Object.seal(this);
    }

    get levels() {
        return this.#levels;
    }

    get length() {
        return this.#levels.length;
    }

    get ultima() {
        return this.#levels.at(-1);
    }

    get open() {
        return this.#open;
    }

    set open(n) {
        this.#open = n;
    }

    openAll() {
        this.#open = this.length;
    }
}

const GAME = (() => {
    function rgb(r, g, b) {
        return `rgb(${r},${g},${b})`;
    }

    const black = "black", green = "lime", red = "red", blue = "blue", yellow = "yellow", cyan = "cyan", white = "white";
    const midgray = rgb(144, 144, 144), lightgreen = rgb(128, 255, 128), brown = rgb(144, 72, 0), darkbrown = rgb(96, 48, 0);
    const darkyellow = rgb(192, 192, 0), lightblue = rgb(128, 128, 255), lightpink = rgb(255, 128, 192), brightpink = rgb(255, 192, 224);
    const brightblue = rgb(192, 192, 255), lightcyan = rgb(128, 255, 255), lightorange = rgb(255, 192, 128), orange = rgb(255, 128, 0);
    const lightred = rgb(255, 128, 128), stdgray = rgb(128, 128, 128), darkgray = rgb(64, 64, 64);

    function test(g) {
        return [
            new Fase(g, 200, 100,  0,  30, 10, 200, 200, white, midgray, black, "fase1.png" , 0, 0),
            new Fase(g, 120, 210, 61,  86,  2, 140, 700, blue , yellow , white, "fase12.png", 1, 1),
            new Fase(g,   0, 100,  0,   1,  1, 200,   0, cyan , green  , blue , "fim.png"   , 0, 0)
        ];
    }

    function easy(g) {
        return [
            new Fase(g, 200, 100,  0,  30, 10, 200, 200, white     , midgray  , black, "fase1.png" , 0, 0), //  10 -  11
            new Fase(g, 190, 110,  0,  36, 11, 190, 220, brightpink, lightpink, black, "fase2.png" , 1, 1), //  12 -  21
            new Fase(g, 180, 120, 10,  42, 12, 180, 240, brightblue, lightblue, black, "fase3.png" , 1, 1), //  22 -  33
            new Fase(g, 170, 130, 15,  48, 13, 170, 260, lightcyan , cyan     , black, "fase4.png" , 2, 2), //  34 -  46
            new Fase(g, 165, 140, 20,  54, 14, 165, 280, lightgreen, green    , black, "fase5.png" , 2, 2), //  47 -  60
            new Fase(g,   0, 100,  0,   1,  1, 200,   0, cyan      , green    , blue , "fim.png"   , 0, 0)  //  61
        ];
    }

    function hard(g) {
        return [
            new Fase(g, 200, 100,  0,  30, 10, 200, 200, white      , midgray   , black, "fase1.png" , 0, 0), //  10 -  11
            new Fase(g, 190, 110,  0,  36, 11, 190, 220, brightpink , lightpink , black, "fase2.png" , 1, 1), //  12 -  21
            new Fase(g, 180, 120, 10,  42, 12, 180, 240, brightblue , lightblue , black, "fase3.png" , 1, 1), //  22 -  33
            new Fase(g, 170, 130, 15,  48, 13, 170, 260, lightcyan  , cyan      , black, "fase4.png" , 2, 2), //  34 -  46
            new Fase(g, 165, 140, 20,  54, 14, 165, 280, lightgreen , green     , black, "fase5.png" , 2, 2), //  47 -  60
            new Fase(g, 160, 150, 25,  60, 17, 165, 300, yellow     , darkyellow, black, "fase6.png" , 3, 2), //  61 -  77
            new Fase(g, 155, 160, 30,  66, 23, 165, 325, lightorange, orange    , black, "fase7.png" , 4, 3), //  78 - 100
            new Fase(g, 150, 170, 35,  72, 25, 160, 350, lightred   , red       , black, "fase8.png" , 5, 3), // 101 - 125
            new Fase(g, 145, 180, 40,  76, 25, 160, 375, brown      , darkbrown , white, "fase9.png" , 6, 3), // 126 - 150
            new Fase(g, 140, 190, 47,  80, 25, 155, 400, stdgray    , darkgray  , white, "fase10.png", 7, 4), // 151 - 175
            new Fase(g, 130, 200, 54,  83, 25, 150, 500, red        , green     , black, "fase11.png", 8, 4), // 176 - 200
            new Fase(g, 120, 210, 61,  86, 25, 140, 600, blue       , yellow    , white, "fase12.png", 9, 4), // 201 - 225
            new Fase(g, 120, 210, 61,  86, 25, 140, 700, blue       , cyan      , white, "fase13.png", 9, 4), // 226 - 250
            new Fase(g,   0, 100,  0,   1,  1, 200,   0, cyan       , green     , blue , "fim.png"   , 0, 0)  // 251
        ];
    }

    const testSet = new LevelSet(test);
    const easySet = new LevelSet(easy);
    const hardSet = new LevelSet(hard);

    return Object.freeze({
        //"Test stuff": testSet,
        "Easy": easySet,
        "Hard": hardSet
    });
})();

function cheat() {
    for (const k in GAME) {
        GAME[k].openAll();
    }
    [...document.querySelectorAll("button")].forEach(b => b.removeAttribute("disabled"));
}