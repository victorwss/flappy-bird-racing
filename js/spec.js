"use strict";

const TECLAS = ["Space", "Enter", "Numpad5", "KeyQ", "KeyP", "KeyT"];
const SUAVIZACAO_TRANSPARENCIA = 1 / 256;
const X_PASSARINHO = 100;

class SpecSet {
    #items;

    constructor(players, sons) {
        const langs = Object.values(LINGUAS);
        const colors = ["rgb(255,255,64)", "rgb(255,128,128)", "rgb(128,128,255)", "rgb(128,255,128)", "rgb(224,224,224)", "rgb(48,48,48)"];
        const eyes = ["cyan", "lime", "black", "red", "rgb(128,64,0)", "rgb(128,192,64)"];
        langs.shuffle();
        colors.shuffle();
        eyes.shuffle();
        const items = [];
        for (let i = 0; i < players; i++) {
            items.push(new Spec(i, langs[i], colors[i], eyes[i], TECLAS[i], sons));
        }
        this.#items = Object.freeze(items);
    }

    get players() { return this.items.length; }
    get items  () { return this.#items      ; }

    criarPassarinhos(plataforma) {
        for (const spec of this.items) {
            spec.criarPassarinho(plataforma);
        }
    }

    tick(deltaT) {
        for (const spec of this.items) {
            spec.tick(deltaT);
        }
    }

    desenhar() {
        for (const spec of this.items) {
            spec.desenhar();
        }
    }
}

class Spec {

    #mundo;
    #n;
    #lingua;
    #cor;
    #corOlhos;
    #keyName;
    #canvas;
    #sons;
    #passarinho;
    #acumulado;
    #transicao;
    #fase;
    #splash;
    #eraUmaVez;
    #finalFeliz;

    constructor(n, lingua, cor, corOlhos, keyName, sons) {
        this.#sons = sons;
        this.#n = n;
        this.#lingua = lingua;
        this.#cor = cor;
        this.#corOlhos = corOlhos;
        this.#keyName = keyName;
        this.#canvas = document.createElement("canvas");
        this.#transicao = 1;
        this.#eraUmaVez = lingua.eraUmaVez;
        this.#finalFeliz = lingua.finalFeliz;
    }

    get mundo      () { return this.#mundo                      ; }
    get n          () { return this.#n                          ; }
    get lingua     () { return this.#lingua                     ; }
    get keyName    () { return this.#keyName                    ; }
    get canvas     () { return this.#canvas                     ; }
    get passarinho () { return this.#passarinho                 ; }
    get gravidade  () { return this.fase.gravidade              ; }
    get keyNameIntl() { return this.lingua.tecla(this.#keyName) ; }
    get numeroFase () { return this.fase.numero                 ; }
    get fase       () { return this.#fase                       ; }
    get ganhou     () { return this.fase.ultima                 ; }
    get offX       () { return this.#passarinho.x - X_PASSARINHO; }
    get offY       () { return 0                                ; }
    get vx         () { return this.fase.vx                     ; }
    get transicao  () { return this.#transicao                  ; }
    get cor        () { return this.#cor                        ; }
    get corOlhos   () { return this.#corOlhos                   ; }
    get eraUmaVez  () { return this.#eraUmaVez                  ; }
    get finalFeliz () { return this.#finalFeliz                 ; }
    get splash     () { return this.#splash                     ; }

    async passouDeFase() { await this.#sons.passouDeFase(this); }
    async pontuou     () { await this.#sons.pontuou     (this); }
    async bateuAsas   () { await this.#sons.bateuAsas   (this); }
    async morreu      () { await this.#sons.morreu      (this); }
    async gato        () { await this.#sons.gato        (this); }

    criarPassarinho(plataforma) {
        this.#mundo = plataforma.mundo;
        if (!plataforma.fase) throw new Error();
        this.#fase = plataforma.fase;
        this.#acumulado = plataforma.numero - 1;
        this.#passarinho = new Passarinho(plataforma, this);
        this.#canvas.height = this.mundo.altura;
        this.#canvas.width = this.mundo.largura;
        this.#splash = SPLASH_TIME;
        if (this.n === 0) this.passouDeFase();
    }

    get pontos() {
        return this.mundo.pares.reduce((a, p) => a + (this.#passarinho.x - this.#passarinho.raio > p.x2 ? 1 : 0), 0);
    }

    flap() {
        this.#passarinho.flap();
    }

    tick(deltaT) {
        const mundo = this.mundo;

        if (this.#transicao < 1) this.#transicao += SUAVIZACAO_TRANSPARENCIA;
        this.#passarinho.tick(deltaT);

        this.#splash -= deltaT / 1000;
        if (this.#splash < 0) this.#splash = 0;

        const pts = this.pontos;
        if (this.ganhou) return;

        if (pts > this.#acumulado) {
            if (mundo.pares[pts].fase.numero > this.numeroFase) {
                this.#fase = mundo.pares[pts].fase;
                this.#transicao = 0;
                this.#passarinho.checkpoint = mundo.pares[pts];
                this.passouDeFase();
                if (this.ganhou) this.#splash = SPLASH_TIME;
                this.#passarinho.passouDeFase();
            } else {
                this.pontuou();
            }
        }
        this.#acumulado = pts;
    }

    desenhar() {
        const ctx = this.canvas.getContext("2d", { alpha: false });
        this.mundo.desenhar(this, ctx);
    }
}