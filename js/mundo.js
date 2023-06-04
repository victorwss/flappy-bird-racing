"use strict";

const [ALTURA_TOTAL, LARGURA_TOTAL] = [500, 750];
const [ALTURA_CHAO, ALTURA_TETO] = [ALTURA_TOTAL - 50, 50];
const SUAVIZACAO_TRANSPARENCIA = 1 / 256;
const X_PASSARINHO = 100;

class GameObject {
    #mundo;

    constructor(mundo) {
        this.#mundo = mundo;
    }

    get mundo () { return this.#mundo      ; }
    get lingua() { return this.mundo.lingua; }
    get x1    () { throw new Error() ; }
    get y1    () { throw new Error() ; }
    get x2    () { throw new Error() ; }
    get y2    () { throw new Error() ; }
    get xp1   () { return this.x1 - this.mundo.offX; }
    get yp1   () { return this.y1 - this.mundo.offY; }
    get xp2   () { return this.x2 - this.mundo.offX; }
    get yp2   () { return this.y2 - this.mundo.offY; }
    get w     () { return this.x2 - this.x1; }
    get h     () { return this.y2 - this.y1; }

    get enquadrado() { return this.xp2 >= 0 && this.xp1 < this.mundo.largura && this.yp1 >= 0 && this.yp2 < this.mundo.altura; }

    tick(deltaT)  { throw new Error(); }
    desenhar(ctx) { throw new Error(); }
}

class Mundo {

    #callbacks;
    #passarinho;
    #pares;
    #obstaculos;
    #irritantes;
    #chao;
    #teto;
    #acumulado;
    #fase;
    #transicaoFase;
    #fundos;
    #lingua;
    #nomeTecla;
    #xmax;
    #levelSet;

    constructor(lingua, fase, fundos, callbacks, nomeTecla, cor, corOlho) {
        this.#callbacks = callbacks;
        this.#chao = new Chao(this);
        this.#teto = new Teto(this);
        this.#transicaoFase = 1;
        this.#fundos = fundos;
        this.#lingua = lingua;
        this.#levelSet = fase.levelSet;
        this.#nomeTecla = nomeTecla;
        this.#fase = fase;

        const fasesSuperadas = fase.numero - 1;
        this.#acumulado = 0;
        for (let i = 0; i < fasesSuperadas; i++) {
            this.#acumulado += this.levelSet.levels[i].numeroObstaculos;
        }
        this.#pares = [];
        this.#obstaculos = [];
        this.#irritantes = [ this.#chao, this.#teto ];

        let passou = 0;
        for (let f = 0; f < fasesSuperadas; f++) {
            passou += this.levelSet.levels[f].numeroObstaculos;
        }

        let x = 0;
        for (let f = fasesSuperadas; f < this.levelSet.length; f++) {
            const fase = this.levelSet.levels[f];

            const nn = [];
            const mm = [];
            for (let i = 1; i < fase.numeroObstaculos; i++) {
                nn.push(i);
            }
            nn.shuffle();
            while (mm.length < fase.charts) {
                mm.push(nn.pop());
            }
            while (nn.length > fase.irritantes) {
                nn.pop();
            }

            for (let i = 0; i < fase.numeroObstaculos; i++) {
                x += fase.distanciaObstaculos;
                passou++;
                if (i === 0) {
                    const plat = new Plataforma(this, x, x + 120, this.alturaDecolar, this.alturaDecolar + 40, passou, fase);
                    this.#obstaculos.push(plat);
                    this.#pares.push(plat);
                    x = plat.x2;
                    if (f === this.levelSet.length - 1) this.#xmax = (plat.x1 + plat.x2) / 2;
                } else if (!mm.includes(i)) {
                    const par = new Par(this, fase, x, passou, nn.includes(i));
                    this.#pares.push(par);
                    this.#obstaculos.push(par.ob1, par.ob2);
                    if (par.irritante) this.#irritantes.push(par.irritante);
                    x = par.x2;
                } else {
                    const chart = new Chart(
                        this,
                        x,
                        3, 7,
                        this.alturaTeto + 200, this.alturaChao,
                        passou,
                        [0, 5, 10, 20, 40, 50, 80].randomElement(),
                        fase
                    );
                    this.#pares.push(chart);
                    this.#obstaculos.push(...chart.barras);
                    this.#irritantes.push(...chart.irritantes);
                    x = chart.x2;
                }
            }
        }

        this.#passarinho = new Passarinho(this.#obstaculos[0], cor, corOlho);
        this.#callbacks.passouDeFase(this.fase);
    }

    destruir(ob) {
        const idx = this.irritantes.indexOf(ob);
        if (idx >= 0) this.irritantes.splice(idx, 1);
    }

    get pontos() {
        return this.#pares.reduce((a, p) => a + (this.#passarinho.x - this.#passarinho.raio > p.x2 ? 1 : 0), 0);
    }

    get levelSet     () { return this.#levelSet                         ; }
    get lingua       () { return this.#lingua                           ; }
    get passarinho   () { return this.#passarinho                       ; }
    get callbacks    () { return this.#callbacks                        ; }
    get gravidade    () { return this.fase.gravidade                    ; }
    get alturaChao   () { return ALTURA_CHAO                            ; }
    get alturaTeto   () { return ALTURA_TETO                            ; }
    get alturaCentro () { return (this.alturaTeto + this.alturaChao) / 2; }
    get alturaDecolar() { return this.alturaChao - 100                  ; }
    get altura       () { return ALTURA_TOTAL                           ; }
    get largura      () { return LARGURA_TOTAL                          ; }
    get obstaculos   () { return this.#obstaculos                       ; }
    get irritantes   () { return this.#irritantes                       ; }
    get numeroFase   () { return this.fase.numero                       ; }
    get fase         () { return this.#fase                             ; }
    get ganhou       () { return this.fase.ultima                       ; }
    get offX         () { return this.#passarinho.x - X_PASSARINHO      ; }
    get offY         () { return 0                                      ; }
    get xmax         () { return this.#xmax                             ; }
    get vx           () { return this.fase.vx                           ; }

    flap() {
        this.#passarinho.flap();
    }

    tick(deltaT) {
        if (this.#transicaoFase < 1) this.#transicaoFase += SUAVIZACAO_TRANSPARENCIA;
        this.#pares.forEach(p => p.tick(deltaT));
        this.#passarinho.tick(deltaT);
        this.#irritantes.forEach(p => p.tick(deltaT));
        const pts = this.pontos;
        if (this.ganhou) return;
        if (pts > this.#acumulado) {
            if (this.#pares[pts].fase.numero > this.numeroFase) {
                this.#fase = this.#pares[pts].fase;
                this.#transicaoFase = 0;
                this.#passarinho.checkpoint = this.#pares[pts];
                this.#callbacks.passouDeFase(this.fase);
                this.#passarinho.passouDeFase(this.fase);
            } else {
                this.#callbacks.pontuou();
            }
        }
        this.#acumulado = pts;
    }

    #desenharFundo(ctx) {
        const fundo = this.#fundos.imagem("img/" + this.fase.bg);
        const fundoVelho = this.numeroFase === 1 ? null : this.#fundos.imagem("img/" + this.fase.anterior.bg);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.largura, this.altura);

        ctx.globalAlpha = this.#transicaoFase;
        ctx.drawImage(fundo, 0, this.alturaTeto, this.largura, this.alturaChao - this.alturaTeto);

        if (fundoVelho) {
            ctx.globalAlpha = 1 - this.#transicaoFase;
            ctx.drawImage(fundoVelho, 0, this.alturaTeto, this.largura, this.alturaChao - this.alturaTeto);
        }

        ctx.globalAlpha = 1.0;
    }

    desenhar(ctx) {
        ctx.save();
        try {
            this.#desenharFundo(ctx);
            this.#irritantes.filter(ob => ob.camada === -1 /*&& ob.enquadrado*/).forEach(ob => ob.desenhar(ctx));
            this.#pares.filter(ob => ob.enquadrado).forEach(p => p.desenhar(ctx));
            for (let c = 0; c <= 2; c++) {
                this.#irritantes.filter(ob => ob.camada === c /*&& ob.enquadrado*/).forEach(ob => ob.desenhar(ctx));
            }
            this.#passarinho.desenhar(ctx);
            ctx.fillStyle = "white";
            ctx.font = "30px serif";
            ctx.textAlign = "center";
            const t = this.lingua.fase(this.fase.numero);
            ctx.fillText(t, this.largura / 2, this.altura - 15);
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText(this.lingua.tecla(this.#nomeTecla), 5, 33);
        } finally {
            ctx.restore();
        }
    }
}