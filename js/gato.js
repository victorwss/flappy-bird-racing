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
        return this.mundo.passarinho.x < this.x;
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
        } else if (mundo.passarinho.vivo && this.x < mundo.passarinho.x + 300) {
            this.#quieto = false;
            this.#pulou = true;
            this.#balao = new Balao(5, this.lingua.miau);
            this.mundo.callbacks.gato();
            const dx = mundo.passarinho.x - this.x;
            const dy = mundo.passarinho.y - this.y;
            const s = Math.sqrt(dx ** 2 + dy ** 2);
            const v = randomInt(100, 700);
            this.#vy = v * dy / s;
            this.#vx = v * dx / s;
            this.#pulos--;
        }
    }

    destruir() {
        this.mundo.destruir(this);
    }

    desenhar(ctx) {

        const px = this.x - this.mundo.offX;
        const py = this.y - this.mundo.offY;

        const desenharCorpo = () => {
            ctx.beginPath();
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.ellipse(0, 0, this.raio, this.raio, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.raio, 0);
            ctx.stroke();
        };

        const desenharBalao = () => {
            this.#balao.desenhar(ctx, px + this.raio + 5, py);
        };

        ctx.save();
        try {
            ctx.translate(px, py);
            if (this.#espelhar) ctx.scale(-1, 1);
            ctx.rotate(this.#inclinacao);
            desenharCorpo();
            //ctx.fillStyle = "black";
            //ctx.textAlign = "center";
            //ctx.fillText(`${this.#vx},${this.#vy}`, 0, 0);
        } finally {
            ctx.restore();
        }
        desenharBalao();
    }
}