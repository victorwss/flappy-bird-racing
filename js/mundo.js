"use strict";

const [ALTURA_TOTAL, LARGURA_TOTAL] = [500, 750];
const [ALTURA_CHAO, ALTURA_TETO] = [ALTURA_TOTAL - 50, 50];

const SPLASH_TIME = 10;
const SPLASH_RAMPDOWN = 2;

class GameObject {
    #mundo;

    constructor(mundo) {
        this.#mundo = mundo;
    }

    get mundo() { return this.#mundo      ; }
    get x1   () { throw new Error()       ; }
    get y1   () { throw new Error()       ; }
    get x2   () { throw new Error()       ; }
    get y2   () { throw new Error()       ; }
    get w    () { return this.x2 - this.x1; }
    get h    () { return this.y2 - this.y1; }

    xp1(spec) { return this.x1 - spec.offX; }
    yp1(spec) { return this.y1 - spec.offY; }
    xp2(spec) { return this.x2 - spec.offX; }
    yp2(spec) { return this.y2 - spec.offY; }

    enquadrado(spec) {
        return this.xp2(spec) >= 0
            && this.xp1(spec) < this.mundo.largura
            && this.yp1(spec) >= 0
            && this.yp2(spec) < this.mundo.altura;
    }

    tick(deltaT)  { throw new Error(); }
    desenhar(ctx) { throw new Error(); }
}

class Mundo {

    #pares;
    #obstaculos;
    #irritantes;
    #chao;
    #teto;
    #fundos;
    #specs;
    #xmax;
    #levelSet;
    #faseInicial;

    constructor(specs, fase, fundos) {
        this.#chao = new Chao(this);
        this.#teto = new Teto(this);
        this.#fundos = fundos;
        this.#specs = specs;
        this.#levelSet = fase.levelSet;
        this.#faseInicial = fase;

        const fasesSuperadas = fase.numero - 1;
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

        specs.criarPassarinhos(this.#obstaculos[0]);
    }

    destruir(ob) {
        const idx = this.irritantes.indexOf(ob);
        if (idx >= 0) this.irritantes.splice(idx, 1);
    }

    get levelSet     () { return this.#levelSet                         ; }
    get faseInicial  () { return this.#faseInicial                      ; }
    get fundos       () { return this.#fundos                           ; }
    get specs        () { return this.#specs                            ; }
    get alturaChao   () { return ALTURA_CHAO                            ; }
    get alturaTeto   () { return ALTURA_TETO                            ; }
    get alturaCentro () { return (this.alturaTeto + this.alturaChao) / 2; }
    get alturaDecolar() { return this.alturaChao - 100                  ; }
    get altura       () { return ALTURA_TOTAL                           ; }
    get largura      () { return LARGURA_TOTAL                          ; }
    get obstaculos   () { return this.#obstaculos                       ; }
    get irritantes   () { return this.#irritantes                       ; }
    get xmax         () { return this.#xmax                             ; }
    get pares        () { return this.#pares                            ; }

    tick(deltaT) {
        this.pares.forEach(p => p.tick(deltaT));
        this.#specs.tick(deltaT);
        this.#irritantes.forEach(p => p.tick(deltaT));
    }

    #desenharFundo(spec, ctx) {
        try {
            ctx.save();
            const fundo = this.fundos.imagem("img/" + spec.fase.bg);
            const fundoVelho = spec.fase.numero === 1 ? null : this.fundos.imagem("img/" + spec.fase.anterior.bg);

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, this.largura, this.altura);

            ctx.globalAlpha = spec.transicao;
            ctx.drawImage(fundo, 0, this.alturaTeto, this.largura, this.alturaChao - this.alturaTeto);

            if (fundoVelho && spec.transicao < 1) {
                ctx.globalAlpha = 1 - spec.transicao;
                ctx.drawImage(fundoVelho, 0, this.alturaTeto, this.largura, this.alturaChao - this.alturaTeto);
            }
        } finally {
            ctx.restore();
        }
    }

    #desenharSplash(spec, ctx) {
        if (spec.fase.numero !== 1 && !spec.fase.ultima) return;
        const t = spec.splash;
        if (!t) return;
        const alpha = t <               SPLASH_RAMPDOWN ?                t  / SPLASH_RAMPDOWN
                    : t > SPLASH_TIME - SPLASH_RAMPDOWN ? (SPLASH_TIME - t) / SPLASH_RAMPDOWN
                    : 1;
        ctx.save();
        try {
            ctx.globalAlpha = alpha * 0.6;

            const frase = spec.fase.numero === 1 ? spec.eraUmaVez : spec.finalFeliz;
            const partes = frase.split("\n");
            for (let m = 100; m > 10; m--) {
                ctx.font = m + "px 'Custom'";
                const tamanho = partes.map(p => ctx.measureText(p).width).reduce((a, b) => Math.max(a, b), 0);
                if (tamanho < this.largura - 70) break;
            }

            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(25, 25, this.largura - 50, this.altura / 2 - 50, 30);
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(30, 30, this.largura - 60, this.altura / 2 - 60, 30);
            ctx.stroke();
            ctx.fill();

            ctx.strokeStyle = "black";
            ctx.textAlign = "center";
            ctx.lineWidth = 1;
            ctx.fillStyle = spec.cor;

            for (let i = 0; i < partes.length; i++) {
                ctx.strokeText(partes[i], this.largura / 2, (i + 1) * this.altura / 2 / (partes.length + 1));
                ctx.fillText  (partes[i], this.largura / 2, (i + 1) * this.altura / 2 / (partes.length + 1));
            }
        } finally {
            ctx.restore();
        }
    }

    desenhar(spec, ctx) {
        ctx.save();
        try {
            this.#desenharFundo(spec, ctx);
            this.#irritantes.filter(ob => ob.camada === -1 /*&& ob.enquadrado*/).forEach(ob => ob.desenhar(spec, ctx));
            this.#pares.filter(ob => ob.enquadrado).forEach(p => p.desenhar(spec, ctx));
            for (let c = 0; c <= 2; c++) {
                this.#irritantes.filter(ob => ob.camada === c /*&& ob.enquadrado*/).forEach(ob => ob.desenhar(spec, ctx));
            }
            this.#specs.items.filter(s => s.passarinho.spec !== spec).forEach(s => s.passarinho.desenhar(spec, ctx));
            this.#specs.items.filter(s => s.passarinho.spec === spec).forEach(s => s.passarinho.desenhar(spec, ctx));

            const t = spec.lingua.fase(spec.fase.numero);
            const tw1 = ctx.measureText(t);
            ctx.fillStyle = spec.fase.claro;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.roundRect((this.largura - tw1.width - 20) / 2, this.altura - 42, tw1.width + 20, 34, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "black";
            ctx.font = "30px serif";
            ctx.textAlign = "center";
            ctx.fillText(t, this.largura / 2, this.altura - 15);

            const tw2 = ctx.measureText(spec.keyNameIntl);
            ctx.fillStyle = spec.fase.claro;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.roundRect((this.largura - tw2.width - 20) / 2, 8, tw2.width + 20, 34, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(spec.keyNameIntl, this.largura / 2, 33);
            this.#desenharSplash(spec, ctx);
        } finally {
            ctx.restore();
        }
    }
}