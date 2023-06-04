"use strict";

const FASE_INICIAL = 1;
const FASES_ABERTAS = 13;
const TECLAS = ["Space", "Enter", "Numpad5", "KeyQ", "KeyP", "KeyT"];
const MIN_PLAYERS = 2;
const MAX_PLAYERS = TECLAS.length;
const SOM = "mp3";
const VELOCIDADE_ANIMACAO = 10;
const MAX_LEVEL = 13;

class MundoController {
    #lingua;
    #canvas;
    #mundo;
    #fundos;
    #sons;
    #teclaPular;
    #cor;
    #corOlho;

    constructor(lingua, fase, calls, numero, teclaPular, cor, corOlho) {
        this.#sons = calls.som.de(numero);
        this.#fundos = calls.fundos;
        this.#teclaPular = teclaPular;
        this.#lingua = lingua;
        this.#cor = cor;
        this.#corOlho = corOlho;

        const canvas = document.createElement("canvas");
        this.#canvas = canvas;
        calls.holder.appendChild(canvas);

        canvas.addEventListener("click", event => {
            if (event.defaultPrevented) return;
            this.#mundo.flap();
            event.preventDefault();
        }, {capture: true});

        const key = Keyboard.keys[teclaPular];
        Keyboard.onPress(key, event => this.#mundo.flap()/*, {capture: true}*/);

        this.recomecar(fase);
    }

    tick(delta) {
        this.#mundo.tick(delta);
    }

    desenhar() {
        const ctx = this.#canvas.getContext("2d", { alpha: false });
        this.#mundo.desenhar(ctx);
    }

    recomecar(fase) {
        this.#mundo = new Mundo(this.#lingua, fase, this.#fundos, this.#sons, this.#teclaPular, this.#cor, this.#corOlho);
        this.#canvas.height = this.#mundo.altura;
        this.#canvas.width = this.#mundo.largura;
    }

    get ganhou() {
        return this.#mundo.ganhou;
    }
}

class FlappyBird {

    #mundos;
    #calls;
    #game;
    #setEscolhido;
    #players;
    #faseEscolhida;

    constructor(canvasHolder, game) {
        this.#game = game;
        this.#setEscolhido = "";
        this.#players = MIN_PLAYERS;
        this.#faseEscolhida = 0;

        const holder = document.getElementById(canvasHolder);
        this.#mundos = [];

        window.onload = async () => {
            const srcImagens = [];
            for (let i = 1; i <= MAX_LEVEL; i++) {
                srcImagens.push(`img/fase${i}.png`);
            }
            srcImagens.push(`img/fim.png`);
            const fundos = new BibliotecaImagens(srcImagens);
            await fundos.aguardarImagens();

            this.#calls = Object.freeze({
                holder: holder,
                som: new Som(),
                fundos: fundos,
            });

            this.#criarBotoes();
            this.recomecar("", 2, 0);
            mainLoop(VELOCIDADE_ANIMACAO, () => this.#tick(), () => this.#desenhar());
        };
    }

    #criarBotoes() {
        const set = document.getElementById("level-set");
        set.innerHTML = "";
        for (const name in GAME) {
            const txt = `<button type="button" id="jogo-${name}" onclick="flappy.levelSet = '${name}';">${name}</button>`;
            set.innerHTML += txt;
        }

        const players = document.getElementById("players");
        players.innerHTML = "";
        for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
            const txt = `<button type="button" ${i === 2 ? 'class="selected"' : ""} id="jogadores-${i}" onclick="flappy.players = ${i};">${i}</button>`;
            players.innerHTML += txt;
        }
    }

    set levelSet(name) {
        const levelSet = this.#game[name];

        const levels = document.getElementById("levels");
        levels.innerHTML = "";
        for (let i = 1; i <= levelSet.length; i++) {
            const txt = `<button type="button" ${levelSet.levels[i - 1].open ? "" : 'disabled="disabled"'} id="recomecar-${i}" onclick="flappy.fase = ${i};">${i}</button>`;
            levels.innerHTML += txt;
        }
        this.recomecar(name, this.#players, 0);
    }

    set fase(fase) {
        this.recomecar(this.#setEscolhido, this.#players, fase);
    }

    set players(players) {
        this.recomecar(this.#setEscolhido, players, this.#faseEscolhida);
    }

    #limpar() {
        this.#calls.som.silenciar();
        this.#calls.holder.innerHTML = "";
        this.#mundos = [];
    }

    #ficarAzul() {
        const levelButtons = document.querySelectorAll("#levels button");
        const playerButtons = document.querySelectorAll("#players button");
        const levelSetButtons = document.querySelectorAll("#level-set button");

        [...levelButtons, ...playerButtons, ...levelSetButtons].forEach(b => b.classList.remove("selected"));

        [...levelButtons].filter(b => b.innerHTML === `${this.#faseEscolhida}`).forEach(b => b.classList.add("selected"));
        [...playerButtons].filter(b => b.innerHTML === `${this.#players}`).forEach(b => b.classList.add("selected"));
        [...levelSetButtons].filter(b => b.id === "jogo-" + this.#setEscolhido).forEach(b => b.classList.add("selected"));
    }

    recomecar(setEscolhido, players, faseEscolhida) {
        this.#limpar();

        this.#setEscolhido = setEscolhido;
        this.#players = players;
        this.#faseEscolhida = faseEscolhida;
        this.#ficarAzul();

        if (setEscolhido === "") {
            document.getElementById("click-acima").style.display = "block";
            document.getElementById("click-acima").innerHTML = "Choose the level set above.";
        } else if (faseEscolhida === 0) {
            document.getElementById("click-acima").style.display = "block";
            document.getElementById("click-acima").innerHTML = "Now, select the starting level.";
        } else {
            document.getElementById("click-acima").style.display = "none";
            this.#comecarJogo();
        }
    }

    #comecarJogo() {
        this.#limpar();

        const langs = Object.values(LINGUAS);
        const colors = ["rgb(255,255,64)", "rgb(255,128,128)", "rgb(128,128,255)", "rgb(128,255,128)", "rgb(224,224,224)", "rgb(48,48,48)"];
        const eyes = ["cyan", "lime", "black", "red", "rgb(128,64,0)", "rgb(128,192,64)"];
        langs.shuffle();
        colors.shuffle();
        eyes.shuffle();
        for (let i = 0; i < this.#players; i++) {
            const mundo = new MundoController(
                langs[i],
                this.#game[this.#setEscolhido].levels[this.#faseEscolhida - 1],
                this.#calls,
                i,
                TECLAS[i],
                colors[i],
                eyes[i]
            );
            this.#mundos.push(mundo);
        }
    }

    #tick() {
        this.#mundos.forEach(mundo => mundo.tick(VELOCIDADE_ANIMACAO));
    }

    #desenhar() {
        this.#mundos.forEach(mundo => mundo.desenhar());
    }
}

const flappy = new FlappyBird("flappy-div", GAME);