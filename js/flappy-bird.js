"use strict";

const FASE_INICIAL = 1;
const FASES_ABERTAS = 13;
const SOM = "mp3";
const VELOCIDADE_ANIMACAO = 10;
const MAX_LEVEL = 13;
const MIN_PLAYERS = 1;
const MAX_PLAYERS = 6;

class MundoController {
    #specs;
    #canvases;
    #mundo;
    #fundos;

    constructor(players, fase, calls) {
        this.#fundos = calls.fundos;
        this.#specs = new SpecSet(players, calls.som);

        for (const spec of this.#specs.items) {
            calls.holder.appendChild(spec.canvas);

            spec.canvas.addEventListener("click", event => {
                if (event.defaultPrevented) return;
                spec.flap();
                event.preventDefault();
            }, {capture: true});

            const key = Keyboard.keys[spec.keyName];
            Keyboard.onPress(key, event => spec.flap()/*, {capture: true}*/);
        }

        this.recomecar(fase);
    }

    tick(delta) {
        this.#mundo.tick(delta);
    }

    desenhar() {
        for (const spec of this.#specs.items) {
            const ctx = spec.canvas.getContext("2d", { alpha: false });
            this.#mundo.desenhar(spec, ctx);
        }
    }

    recomecar(fase) {
        this.#mundo = new Mundo(this.#specs, fase, this.#fundos);
    }

    get ganhou() {
        return this.#mundo.ganhou;
    }
}

class FlappyBird {

    #mundo;
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
        this.#mundo = null;

        window.onload = async () => {
            const srcImagens = [];
            for (let i = 1; i <= MAX_LEVEL; i++) {
                srcImagens.push(`img/fase${i}.png`);
            }
            srcImagens.push(`img/fim.png`);
            srcImagens.push(`img/grama.png`);
            srcImagens.push(`img/pedras.png`);
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
        this.#mundo = null;
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
        const fase = this.#game[this.#setEscolhido].levels[this.#faseEscolhida - 1];
        this.#mundo = new MundoController(this.#players, fase, this.#calls);
    }

    #tick() {
        this.#mundo?.tick(VELOCIDADE_ANIMACAO);
    }

    #desenhar() {
        this.#mundo?.desenhar();
    }
}

const flappy = new FlappyBird("flappy-div", GAME);