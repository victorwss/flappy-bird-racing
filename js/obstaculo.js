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
    get texto    () { return `${this.numero}`; }
    get posicao  () { throw new Error()      ; }
    get corPlaca () { return this.fase.claro ; }
    get corBarra () { return this.fase.medio ; }
    get corTexto () { return this.fase.escuro; }
    get irritante() { return this.#irritante ; }

    comIrritante() {
        if (this.irritante) return;
        this.#irritante = ([true, false].randomElement())
                ? new Tartaruga(this.mundo, (this.x1 + this.x2) / 2, this.y1)
                : new Gato(this.mundo, (this.x1 + this.x2) / 2, this.y1);
        //this.irritante.moveXY(0, -this.irritante.raio);
    }

    desenharPlaca(ctx) {
        const [m, mt] = [this.mundo, ctx.measureText(this.texto)];
        const [x, y, w, h] = [this.x1 - m.offX, this.y1 - m.offY, this.x2 - this.x1, this.y2 - this.y1];
        const vr = this.textoYC(mt);
        ctx.fillStyle = this.corPlaca;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, vr, Math.max(13, (mt.width + 5) / 2), 13, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    desenharBarra(ctx) {
        const m = this.mundo;
        const [x, y, w, h] = [this.x1 - m.offX, this.y1 - m.offY, this.x2 - this.x1, this.y2 - this.y1];
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.corBarra;
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
    }

    desenharTexto(ctx) {
        const t = this.texto;
        const [m, mt] = [this.mundo, ctx.measureText(t)];
        const [x, y, w, h] = [this.x1 - m.offX, this.y1 - m.offY, this.x2 - this.x1, this.y2 - this.y1];
        const ty = this.textoY(mt);
        ctx.fillStyle = this.corTexto;
        ctx.textAlign = "center";
        ctx.fillText(t, x + w / 2, ty);
    }

    desenhar(ctx) {
        ctx.save();
        try {
            ctx.font = "22px serif";
            this.desenharBarra(ctx);
            this.desenharPlaca(ctx);
            this.desenharTexto(ctx);
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

    desenhar(ctx) {
        this.ob1.desenhar(ctx);
        this.ob2.desenhar(ctx);
    }
}

class Chao extends Obstaculo {

    constructor(mundo) {
        super(mundo, -MUITO_GRANDE, MUITO_GRANDE, mundo.alturaChao, MUITO_GRANDE);
    }

    get camada() { return -1; }
    get enquadrado() { return true; }

    desenhar(ctx) {
        ctx.save();
        try {
            ctx.fillStyle = "green";
            ctx.strokeStyle = "green";
            ctx.fillRect(0, this.mundo.alturaChao, this.mundo.largura, this.mundo.altura - this.mundo.alturaChao);
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

    desenhar(ctx) {
        ctx.save();
        try {
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "yellow";
            ctx.fillRect(0, 0, this.mundo.largura, this.mundo.alturaTeto);
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

    get texto () { return this.lingua.fase(this.fase.numero); }

    posicionar(passarinho) {
        this.passarinho.gotoSobre(this);
    }

    desenharPlaca(ctx) {
        const [m, mt] = [this.mundo, ctx.measureText(this.texto)];
        const [x, y, w, h] = [this.x1 - m.offX, this.y1 - m.offY, this.x2 - this.x1, this.y2 - this.y1];
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

    constructor(mundo, x1, y1, numero, fase, escala, posicao, cor) {
        super(mundo, x1, x1 + Math.max(fase.larguraObstaculos, 65), y1, mundo.alturaChao - 30, numero, fase);
        this.#escala = escala;
        this.#posicao = posicao;
        this.#cor = cor;
    }

    get corBarra() { return this.#cor      ; }
    get corTexto() { return "black"        ; }

    get posicao () { return this.#posicao  ; }

    get texto() {
        const v = 100 * this.h * this.#escala;
        const fator = (v < 100 && v > -100) ? 2 : (v < 1000 && v > -1000) ? 1 : 0;
        return "" + (Math.round(10 ** fator * this.h * this.#escala) / 10 ** fator);
    }

    desenharPlaca(ctx) {
    }
}

class Chart extends GameObject {
    #barras;
    #irritantes;
    #fase;
    #texto;

    constructor(mundo, x1, minQ, maxQ, minT, maxT, numero, espacos, fase) {
        super(mundo);
        this.#barras = [];
        this.#irritantes = [];
        this.#texto = mundo.lingua.chart;
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

    get enquadrado() { return this.xp2 >= -400 && this.xp1 < this.mundo.largura + 400 && this.yp1 >= 0 && this.yp2 < this.mundo.altura; }

    tick(deltaT) {
        this.#barras.forEach(b => b.tick(deltaT));
    }

    #desenharTexto(ctx) {
        ctx.font = "30px serif";
        ctx.fillStyle = "black";
        const m = this.mundo;
        const x = this.x1 - m.offX;
        const ty = this.y1 + 50;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(this.#texto, x + this.w / 2, ty);
    }

    desenhar(ctx) {
        let xp1 = this.xp1 - 30;
        let xp2 = this.xp2 + 30;
        const yp1 = this.yp1 + 10;
        const yp2 = this.yp2 + 10;
        const w = xp2 - xp1;

        ctx.save();
        try {
            ctx.font = "30px serif";
            const mt = ctx.measureText(this.#texto);
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
        this.#barras.forEach(b => b.desenhar(ctx));

        ctx.save();
        try {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.xp1, this.barras[0].yp2);
            ctx.lineTo(this.xp2, this.barras[0].yp2);
            ctx.stroke();
        } finally {
            ctx.restore();
        }
        this.#desenharTexto(ctx);
    }
}