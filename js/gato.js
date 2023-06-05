"use strict";

const RAIO_GATO = 40;

class Gato extends GameObject {

    #x;
    #y;
    #vx;
    #vy;
    #quieto;
    #pulos;
    #pulou;
    #balao;
    #cor;
    #corOlhos;

    get x     () { return this.#x            ; }
    get y     () { return this.#y            ; }
    get vx    () { return this.#vx           ; }
    get vy    () { return this.#vy           ; }
    get x1    () { return this.#x - this.raio; }
    get y1    () { return this.#y - this.raio; }
    get x2    () { return this.#x + this.raio; }
    get y2    () { return this.#y + this.raio; }
    get raio  () { return RAIO_GATO          ; }
    get camada() { return 0                  ; }
    get enquadrado() { return true; }

    constructor(mundo, x, y) {

        super(mundo);
        if (y > mundo.alturaChao) throw new Error(y);
        this.#x = x;
        this.#y = y - this.raio;
        this.#vx = 0;
        this.#vy = 0;
        this.#quieto = true;
        this.#pulou = false;
        this.#pulos = randomInt(3, 10);
        this.#balao = new Balao(0, "");
        if (this.#x < this.raio) throw new Error();
        if (this.#y > this.mundo.alturaChao - this.raio) throw new Error();
        if (this.#y < this.mundo.alturaTeto - this.raio) throw new Error();

        const colors = ["rgb(144,96,64)", "rgb(128,128,128)", "rgb(224,224,224)", "rgb(32,32,32)"];
        const eyes = ["rgb(144,144,64)", "rgb(64,128,192)", "rgb(128,192,64)"];
        this.#cor = colors.randomElement();
        this.#corOlhos = eyes.randomElement();
    }

    moveXY(deltaX, deltaY) {
        this.#x += deltaX;
        this.#y += deltaY;
        if (this.#y > this.mundo.alturaChao - this.raio) this.#y = this.mundo.alturaChao - this.raio;
    }

    get #inclinacao() {
        if (!this.#pulou) return 0;
        const [vx, vy] = [this.vx, this.vy];
        const hipotenusa = Math.sqrt(vx ** 2 + vy ** 2);
        if (hipotenusa === 0) return 0;
        const seno = vy / hipotenusa;
        return Math.asin(seno);
    }

    get #espelhar() {
        const escolher = (a, b) => {
            if (a === null) return b;
            const da = Math.abs(this.x - a.x);
            const db = Math.abs(this.x - b.x);
            if (a.vivo !== b.vivo) return a.vivo ? a : b;
            return da < db ? da : db;
        };

        const passarinho = this.mundo.specs.items.map(spec => spec.passarinho).shuffle().reduce(escolher, null);
        return passarinho && passarinho.x < this.x;
    }

    colide(oq, x, y, raio) {
        if (oq === this) return false;
        const dx = x - this.#x;
        const dy = y - this.#y;
        const d = Math.sqrt(dx ** 2 + dy ** 2);
        const bateu = d <= raio + this.raio;
        if (bateu) this.#balao = new Balao(10, ["😹", "🐱", "😼", "😽", "😺"].randomElement());
        return bateu;
    }

    get quieto() {
        return this.#quieto;
    }

    tick(deltaT) {
        const gravidadeParaGatos = 200;
        const mundo = this.mundo;
        this.#balao.tick(deltaT);
        if (this.#pulou) {
            this.#quieto = false;
            this.#vy += (gravidadeParaGatos * deltaT / 1000);
            this.#x += (this.vx * deltaT / 1000);
            this.#y += (this.vy * deltaT / 1000);
            if (this.#pulos && this.#y + this.raio > mundo.alturaChao) {
                this.#y = mundo.alturaChao - this.raio;
                this.#pulou = false;
            }
            if (!this.#pulos && this.#y - this.raio > mundo.altura) {
                this.destruir();
            }
        } else {
            const passarinho = mundo.specs.items
                    .map(spec => spec.passarinho)
                    .filter(p => p.vivo && Math.abs(this.x - p.x) < 300)
                    .shuffle()
                    .reduce((acc, p) => acc === null ? p : Math.abs(this.x - p.x) < Math.abs(this.x - acc.x) ? p : acc, null);
            if (passarinho) {
                this.#quieto = false;
                this.#pulou = true;
                this.#balao = new Balao(5, passarinho.lingua.miau);
                passarinho.spec.gato();
                const dx = passarinho.x - this.x;
                const dy = passarinho.y - this.y;
                const s = Math.sqrt(dx ** 2 + dy ** 2);
                const v = randomInt(100, 700);
                this.#vy = v * dy / s;
                this.#vx = v * dx / s;
                this.#pulos--;
            }
        }
    }

    destruir() {
        this.mundo.destruir(this);
    }

    desenhar(spec, ctx) {

        const px = this.x - spec.offX;
        const py = this.y - spec.offY;

        if (px === 0 || px !== px || px === undefined || px === null) throw new Error();
        if (py === 0 || py !== py || py === undefined || py === null) throw new Error();

        const desenharPatasAbaixo = sinal => {
            try {
                ctx.save();
                ctx.strokeStyle = "black";

                for (const i of [1, 2]) {
                    const topo = i === 1 ? 0 : this.raio / 2;
                    ctx.beginPath();
                    ctx.moveTo(sinal * i * this.raio / 4            , topo     );
                    ctx.lineTo(sinal * i * this.raio / 4            , this.raio);
                    ctx.lineTo(sinal * i * this.raio / 4 - 9 * sinal, this.raio);
                    ctx.lineTo(sinal * i * this.raio / 4 - 9 * sinal, topo     );
                    ctx.fill();
                    ctx.stroke();
                }
            } finally {
                ctx.restore();
            }
        }

        const desenharPupila = () => {
            try {
                ctx.save();
                ctx.strokeStyle = "black";
                ctx.fillStyle = "black";

                ctx.beginPath();
                ctx.ellipse(0, 0, this.raio / 16, this.raio / 16, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            } finally {
                ctx.restore();
            }
        }

        const desenharOlho = sinal => {
            try {
                ctx.save();
                ctx.translate(sinal * this.raio / 6, -this.raio / 6);

                ctx.fillStyle = this.#corOlhos;

                ctx.beginPath();
                ctx.ellipse(0, 0, this.raio / 8, this.raio / 8, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                desenharPupila();
            } finally {
                ctx.restore();
            }
        };

        const desenharCabeca = () => {
            try {
                ctx.save();
                ctx.translate(0, -this.raio * 0.8);

                ctx.beginPath();
                ctx.ellipse(0, 0, this.raio / 2, this.raio / 2, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "pink";
                ctx.beginPath();
                ctx.moveTo(-5, 2);
                ctx.lineTo( 0, 7);
                ctx.lineTo( 5, 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                for (const i of [1, -1]) {
                    ctx.beginPath();
                    ctx.moveTo(i *  0,  7);
                    ctx.lineTo(i *  6, 12);
                    ctx.lineTo(i * 12,  7);
                    ctx.stroke();
                    for (const j of [3, 6, 9]) {
                        ctx.beginPath();
                        ctx.moveTo(i * 12, j);
                        ctx.lineTo(i * 25, j);
                        ctx.stroke();
                    }

                    ctx.fillStyle = this.#cor;
                    ctx.beginPath();
                    ctx.moveTo(i *  7, -16);
                    ctx.lineTo(i * 20, -27);
                    ctx.lineTo(i * 17, -10);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "pink";
                    ctx.beginPath();
                    ctx.moveTo(i * 12, -16);
                    ctx.lineTo(i * 17, -21);
                    ctx.lineTo(i * 15, -15);
                    ctx.fill();
                    ctx.stroke();
                }

                desenharOlho(1);
                desenharOlho(-1);
            } finally {
                ctx.restore();
            }
        };

        const desenharCauda = () => {
            ctx.beginPath();
            ctx.moveTo(this.raio * 0.5 , this.raio *  0.7 );
            ctx.lineTo(this.raio * 0.9 , this.raio *  0.7 );
            ctx.lineTo(this.raio * 1.1 , this.raio *  0.5 );
            ctx.lineTo(this.raio * 1.1 , this.raio * -0.2 );
            ctx.lineTo(this.raio * 1.2 , this.raio * -0.3 );
            ctx.lineTo(this.raio * 1.1 , this.raio * -0.4 );
            ctx.lineTo(this.raio * 0.95, this.raio * -0.3 );
            ctx.lineTo(this.raio * 0.95, this.raio *  0.4 );
            ctx.lineTo(this.raio * 0.8 , this.raio *  0.55);
            ctx.lineTo(this.raio * 0.4 , this.raio *  0.55);
            ctx.fill();
            ctx.stroke();
        };

        const desenharCorpo = () => {
            ctx.fillStyle = this.#cor;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;

            desenharCauda();

            ctx.beginPath();
            ctx.ellipse(0, 0, this.raio * 0.8, this.raio, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            desenharCabeca();
            desenharPatasAbaixo(1);
            desenharPatasAbaixo(-1);

            /* ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.raio, 0);
            ctx.stroke();*/
        };

        const desenharBalao = () => {
            this.#balao.desenhar(ctx, px + this.raio + 5, py);
        };

        try {
            ctx.save();
            ctx.translate(px, py);
            if (this.#espelhar) ctx.scale(-1, 1);
            ctx.rotate(this.#inclinacao);
            desenharCorpo();
        } finally {
            ctx.restore();
        }
        desenharBalao();
    }
}