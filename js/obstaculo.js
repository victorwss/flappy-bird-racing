"use strict";

const [FOLGA_CHAO, FOLGA_TETO, MUITO_GRANDE] = [50, 50, 999999];
const CHART_COLORS = ["cyan", "rgb(128,128,255)", "lime", "yellow", "red", "rgb(128,255,128)", "rgb(255,128,0)", "rgb(255,255,128)", "rgb(255,128,128)"];

class Obstaculo extends GameObject {
    #x1;
    #x2;
    #y1;
    #y2;

    constructor(mundo, x1, x2, y1, y2) {
        super(mundo);
        this.#x1 = x1;
        this.#x2 = x2;
        this.#y1 = y1;
        this.#y2 = y2;
    }

    get x1    () { return this.#x1    ; }
    get x2    () { return this.#x2    ; }
    get y1    () { return this.#y1    ; }
    get y2    () { return this.#y2    ; }

    moveY1(deltaM) {
        this.#y1 += deltaM;
    }

    moveY2(deltaM) {
        this.#y2 += deltaM;
    }

    tick(deltaT) {
    }

    colide(oq, xp, yp, r) {
        const [x1, x2, y1, y2] = [this.x1, this.x2, this.y1, this.y2];
        return (xp + r > x1 && xp - r < x2 && yp > y1 && yp < y2)
            || (yp + r > y1 && yp - r < y2 && xp > x1 && xp < x2)
            ||  Math.sqrt((xp - x1) ** 2 + (yp - y1) ** 2) < r
            ||  Math.sqrt((xp - x2) ** 2 + (yp - y1) ** 2) < r
            ||  Math.sqrt((xp - x1) ** 2 + (yp - y2) ** 2) < r
            ||  Math.sqrt((xp - x2) ** 2 + (yp - y2) ** 2) < r;
    }

    desenhar(ctx) {
        throw new Error();
    }
}

class Tubo extends Obstaculo {
    #numero;
    #fase;
    #irritante;

    constructor(mundo, x1, x2, y1, y2, numero, fase) {
        if (y1 > y2) [y1, y2] = [y2, y1];
        super(mundo, x1, x2, y1, y2);
        this.#numero = numero;
        this.#fase = fase;
        this.#irritante = null;
    }

    get numero   () { return this.#numero    ; }
    get fase     () { return this.#fase      ; }
    get posicao  () { throw new Error()      ; }
    get corPlaca () { return this.fase.claro ; }
    get corBarra () { return this.fase.medio ; }
    get corTexto () { return this.fase.escuro; }
    get irritante() { return this.#irritante ; }

    texto(spec) { return `${this.numero}`; }

    comIrritante() {
        if (this.irritante) return;
        this.#irritante = ([true, false].randomElement())
                ? new Tartaruga(this.mundo, (this.x1 + this.x2) / 2, this.y1)
                : new Gato(this.mundo, (this.x1 + this.x2) / 2, this.y1);
    }

    desenharPlaca(spec, ctx) {
        const mt = ctx.measureText(this.texto(spec));
        const [x, y, w, h] = [this.x1 - spec.offX, this.y1 - spec.offY, this.x2 - this.x1, this.y2 - this.y1];
        const vr = this.textoYC(mt);
        ctx.fillStyle = this.corPlaca;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, vr, Math.max(13, (mt.width + 5) / 2), 13, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    #gradiente(ctx, seed) {
        ctx.createLinearGradient(20, 0, 220, 0);
    }

    desenharBarra(spec, ctx) {
        const [x, y, w, h] = [this.x1 - spec.offX, this.y1 - spec.offY, this.x2 - this.x1, this.y2 - this.y1];
        try {
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.corBarra;
            ctx.strokeRect(x, y, w, h);
            ctx.fillRect(x, y, w, h);

            ctx.globalAlpha = 0.5;
        } finally {
            ctx.restore();
        }
    }

    desenharTexto(spec, ctx) {
        const t = this.texto(spec);
        const [x, y, w, h] = [this.x1 - spec.offX, this.y1 - spec.offY, this.x2 - this.x1, this.y2 - this.y1];
        const ty = this.textoY(ctx.measureText(t));
        ctx.fillStyle = this.corTexto;
        ctx.textAlign = "center";
        ctx.fillText(t, x + w / 2, ty);
    }

    desenhar(spec, ctx) {
        ctx.save();
        try {
            ctx.font = "22px serif";
            this.desenharBarra(spec, ctx);
            this.desenharPlaca(spec, ctx);
            this.desenharTexto(spec, ctx);
        } finally {
            ctx.restore();
        }
    }

    textoY(mt) {
        switch (this.posicao) {
            case "top"   : return this.y1 + mt.actualBoundingBoxAscent  + 10;
            case "bottom": return this.y2 - mt.actualBoundingBoxDescent - 10;
            case "center": return (this.y2 + this.y1 - mt.actualBoundingBoxDescent + mt.actualBoundingBoxAscent) / 2;
            default: throw new Error(this.posicao);
        }
    }

    textoYC(mt) {
        switch (this.posicao) {
            case "top"   : return this.y1 + (mt.actualBoundingBoxDescent + mt.actualBoundingBoxAscent) / 2 + 10;
            case "bottom": return this.y2 - (mt.actualBoundingBoxDescent + mt.actualBoundingBoxAscent) / 2 - 10;
            case "center": return (this.y2 + this.y1) / 2;
            default: throw new Error(this.posicao);
        }
    }
}

class ObstaculoSuperior extends Tubo {

    constructor(mundo, x1, y2, numero, fase) {
        super(mundo, x1, x1 + fase.larguraObstaculos, mundo.alturaTeto, y2, numero, fase);
    }

    get posicao() { return "top"; }
}

class ObstaculoInferior extends Tubo {

    constructor(mundo, x1, y1, numero, fase) {
        super(mundo, x1, x1 + fase.larguraObstaculos, y1, mundo.alturaChao, numero, fase);
    }

    get posicao() { return "bottom"; }
}

class Par extends GameObject {
    #ob1;
    #ob2;
    #fase;
    #sentido;

    get ob1 () { return this.#ob1  ; }
    get ob2 () { return this.#ob2  ; }
    get fase() { return this.#fase ; }
    get x1  () { return this.ob1.x1; }
    get x2  () { return this.ob2.x2; }
    get y1  () { return this.ob1.y1; }
    get y2  () { return this.ob2.y2; }

    get irritante() { return this.ob2.irritante; }

    constructor(mundo, fase, x1, numero, comIrritante) {
        super(mundo);
        this.#fase = fase;
        this.#sentido = [-1, 1].randomElement();

        const sobra = mundo.alturaChao - mundo.alturaTeto - fase.espacoVertical - FOLGA_CHAO - FOLGA_TETO;
        const ya = randomInt(0, sobra) + mundo.alturaTeto + FOLGA_TETO;
        const yb = ya + fase.espacoVertical;

        this.#ob1 = new ObstaculoSuperior(mundo, x1, ya, numero, fase);
        this.#ob2 = new ObstaculoInferior(mundo, x1, yb, numero, fase);
        if (comIrritante) this.#ob2.comIrritante();
    }

    tick(deltaT) {
        const [c, t] = [this.mundo.alturaChao, this.mundo.alturaTeto];
        if (this.ob1.y2 < t + FOLGA_TETO || this.ob2.y1 > c - FOLGA_CHAO) this.#sentido *= -1;
        const deltaM = this.#sentido * this.#fase.vy * deltaT / 1000;
        this.ob1.moveY2(deltaM);
        this.ob2.moveY1(deltaM);
        if (this.irritante?.quieto) this.irritante.moveXY(0, deltaM);
        this.ob1.tick(deltaT);
        this.ob2.tick(deltaT);
    }

    desenhar(spec, ctx) {
        this.ob1.desenhar(spec, ctx);
        this.ob2.desenhar(spec, ctx);
    }
}

class Chao extends Obstaculo {

    constructor(mundo) {
        super(mundo, -MUITO_GRANDE, MUITO_GRANDE, mundo.alturaChao, MUITO_GRANDE);
    }

    get camada() { return -1; }
    get enquadrado() { return true; }

    desenhar(spec, ctx) {
        ctx.save();
        try {
            const img = this.mundo.fundos.imagem("img/grama.png");
            ctx.drawImage(
                    img,
                    0, 0, this.mundo.largura, this.mundo.altura - this.mundo.alturaChao,
                    0, this.mundo.alturaChao, this.mundo.largura, this.mundo.altura - this.mundo.alturaChao
            );
        } finally {
            ctx.restore();
        }
    }
}

class Teto extends Obstaculo {

    constructor(mundo) {
        super(mundo, -MUITO_GRANDE, MUITO_GRANDE, -MUITO_GRANDE, mundo.alturaTeto);
    }

    get camada() { return -1; }
    get enquadrado() { return true; }

    desenhar(spec, ctx) {
        ctx.save();
        try {
            const img = this.mundo.fundos.imagem("img/pedras.png");
            ctx.drawImage(
                    img,
                    0, 0, this.mundo.largura, this.mundo.alturaTeto, 0, 0,
                    this.mundo.largura, this.mundo.alturaTeto
            );
        } finally {
            ctx.restore();
        }
    }
}

class Plataforma extends Tubo {

    constructor(mundo, x1, x2, y1, y2, numero, fase) {
        super(mundo, x1, x2, y1, y2, numero, fase);
    }

    get posicao() { return "top"; }

    texto(spec) { return spec.lingua.fase(this.fase.numero); }

    desenharPlaca(spec, ctx) {
        const mt = ctx.measureText(this.texto(spec));
        const [x, y, w, h] = [this.x1 - spec.offX, this.y1 - spec.offY, this.x2 - this.x1, this.y2 - this.y1];
        const vr = this.textoYC(mt);
        ctx.fillStyle = this.corPlaca;
        ctx.beginPath();
        ctx.roundRect(x + w / 2 - mt.width / 2 - 5, vr - 13, mt.width + 10, 26, 8);
        ctx.stroke();
        ctx.fill();
    }
}

class Barra extends Tubo {

    #escala;
    #posicao;
    #cor;
    #negativo;

    constructor(mundo, x1, y1, numero, fase, escala, posicao, cor) {
        const y2 = mundo.alturaChao - 30;
        const negativo = y1 > y2;
        super(mundo, x1, x1 + Math.max(fase.larguraObstaculos, 65), y1, y2, numero, fase);
        this.#escala = escala;
        this.#posicao = posicao;
        this.#cor = cor;
        this.#negativo = negativo;
    }

    get corBarra() { return this.#cor      ; }
    get corTexto() { return "black"        ; }

    get negativo() { return this.#negativo ; }
    get posicao () { return this.#posicao  ; }

    texto(spec) {
        const v = 100 * this.h * this.#escala;
        const fator = (v < 100 && v > -100) ? 2 : (v < 1000 && v > -1000) ? 1 : 0;
        return (this.#negativo ? "-" : "") + (Math.round(10 ** fator * this.h * this.#escala) / 10 ** fator);
    }

    desenharPlaca(spec, ctx) {
    }
}

class Chart extends GameObject {
    #barras;
    #irritantes;
    #fase;
    #textoId;

    constructor(mundo, x1, minQ, maxQ, minT, maxT, numero, espacos, fase) {
        super(mundo);
        this.#barras = [];
        this.#irritantes = [];
        this.#textoId = Lingua.randomChartId;
        this.#fase = fase;

        const posicao = ["top", "bottom", "center"].randomElement();
        const qtd = randomInt(minQ, maxQ);

        let seq = [];
        for (let i = 0; i < qtd; i++) {
            seq.push(i);
        }
        seq.shuffle();
        seq = [seq[0], seq[1], seq[2]];

        const cores = [...CHART_COLORS];
        cores.shuffle();

        const escala = Math.random() * 1000 + 1;
        for (let i = 0; i < qtd; i++) {
            const barra = new Barra(
                mundo,
                x1,
                randomInt(minT, maxT),
                numero,
                fase,
                escala,
                posicao,
                cores[i]
            );
            this.#barras.push(barra);
            if (seq.includes(i)) {
                barra.comIrritante();
                this.#irritantes.push(barra.irritante);
            }
            x1 = barra.x2 + espacos;
        }
    }

    get fase      () { return this.#fase           ; }
    get barras    () { return this.#barras         ; }
    get irritantes() { return this.#irritantes     ; }
    get y1        () { return this.mundo.alturaTeto; }
    get y2        () { return this.mundo.alturaChao; }
    get x1        () { return this.barras[0].x1    ; }
    get x2        () { return this.barras.at(-1).x2; }

    #texto(spec) {
        return spec.lingua.chart(this.#textoId);
    }

    enquadrado(spec) {
        return this.xp2(spec) >= -400
            && this.xp1(spec) < this.mundo.largura + 400
            && this.yp1(spec) >= 0
            && this.yp2(spec) < this.mundo.altura;
    }

    tick(deltaT) {
        this.#barras.forEach(b => b.tick(deltaT));
    }

    #desenharTexto(spec, ctx) {
        ctx.font = "30px serif";
        ctx.fillStyle = "black";
        const x = this.x1 - spec.offX;
        const ty = this.y1 + 50;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(this.#texto(spec), x + this.w / 2, ty);
    }

    desenhar(spec, ctx) {
        let xp1 = this.xp1(spec) - 30;
        let xp2 = this.xp2(spec) + 30;
        const yp1 = this.yp1(spec) + 10;
        const yp2 = this.yp2(spec) + 10;
        const w = xp2 - xp1;

        ctx.save();
        try {
            ctx.font = "30px serif";
            const mt = ctx.measureText(this.#texto(spec));
            if (mt.width + 60 > w) {
                const d = (mt.width - w + 60) / 2;
                xp1 -= d;
                xp2 += d;
            }
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.rect(xp1, yp1, xp2 - xp1, yp2 - yp1);
            ctx.fill();
            ctx.stroke();
        } finally {
            ctx.restore();
        }
        this.#barras.forEach(b => b.desenhar(spec, ctx));

        ctx.save();
        try {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            const b0 = this.barras[0];
            const [x1, x2] = [b0.xp1(spec), this.barras.at(-1).xp2(spec)];
            const y = b0.negativo ? b0.yp1(spec) : b0.yp2(spec);
            ctx.moveTo(x1 - 10, y);
            ctx.lineTo(x2 + 10, y);
            ctx.stroke();
        } finally {
            ctx.restore();
        }
        this.#desenharTexto(spec, ctx);
    }
}