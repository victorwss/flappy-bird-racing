"use strict";

const RAIO_TARTARUGA = 25;

class Tartaruga extends GameObject {

    #x;
    #y;
    #a;
    #vx;
    #vy;
    #va;
    #quieto;
    #porrada;
    #balao;

    get x     () { return this.#x            ; }
    get y     () { return this.#y            ; }
    get a     () { return this.#a            ; }
    get vx    () { return this.#vx           ; }
    get vy    () { return this.#vy           ; }
    get va    () { return this.#va           ; }
    get x1    () { return this.#x - this.raio; }
    get y1    () { return this.#y - this.raio; }
    get x2    () { return this.#x + this.raio; }
    get y2    () { return this.#y + this.raio; }
    get raio  () { return RAIO_TARTARUGA     ; }
    get camada() { return 0                  ; }
    get enquadrado() { return true; }

    constructor(mundo, x, y) {
        super(mundo);
        this.#x = x;
        this.#y = y - this.raio;
        this.#a = 0;
        this.#vx = 0;
        this.#vy = 0;
        this.#va = 0;
        this.#quieto = true;
        this.#porrada = 60;
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

    colide(oq, x, y, raio) {
        if (oq === this) return false;
        const dx = x - this.#x;
        const dy = y - this.#y;
        const d = Math.sqrt(dx ** 2 + dy ** 2);
        const bateu = d <= raio + this.raio;
        if (this.quieto && bateu) {
            this.#quieto = false;
            this.#porrada = 60;
            this.#vx += 2 * oq.vx;
            this.#vy += 2 * oq.vy;
        }
        if (bateu) {
            this.#va = Math.sqrt(oq.vx ** 2 + oq.vy ** 2) * [1, -1].randomElement() / this.raio;
            this.#balao = new Balao(10, this.lingua.xingamento);
        }
        return bateu;
    }

    get quieto() {
        return this.#quieto;
    }

    tick(deltaT) {
        this.#balao.tick(deltaT);
        if (this.quieto) return;
        this.#porrada -= deltaT / 1000;

        const mundo = this.mundo;
        if (this.#porrada >= 0) {
            if (this.vy < 0 && this.y < mundo.alturaTeto + mundo.offY + this.raio) this.#vy *= -1;
            if (this.vy > 0 && this.y > mundo.alturaChao + mundo.offY - this.raio) this.#vy *= -1;
            if (this.vx < 0 && this.x <                    mundo.offX + this.raio) this.#vx *= -1;
            if (this.vx > 0 && this.x > mundo.largura    + mundo.offX - this.raio) this.#vx *= -1;
        }
        let dx = this.vx * deltaT / 1000;
        let dy = this.vy * deltaT / 1000;
        let da = this.va * deltaT / 1000;
        this.#x += dx;
        this.#y += dy;

        this.#a += da;
        this.#a %= 2 * Math.PI;
        if (this.#a < 0) this.#a += 2 * Math.PI;

        if (this.#porrada === 0 && (
                this.y >= mundo.altura + mundo.offY - this.raio ||
                this.y < mundo.offY - this.raio ||
                this.x >= mundo.largura + mundo.offX - this.raio ||
                this.x < mundo.offX - this.raio
        )) {
            this.destruir();
        }
    }

    destruir() {
        this.mundo.destruir(this);
    }

    desenhar(ctx) {

        const px = this.x - this.mundo.offX;
        const py = this.y - this.mundo.offY;
        const grau = Math.PI / 180;

        const desenharCorpo = () => {
            ctx.beginPath();
            ctx.fillStyle = "rgb(0,192,0)";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.ellipse(0, 0, this.raio, this.raio, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            for (let i = 0; i < 6; i++) {
                const j = i + 1;
                ctx.beginPath();
                ctx.moveTo(this.raio / 2 * Math.cos(i * 60 * grau), this.raio / 2 * Math.sin(i * 60 * grau));
                ctx.lineTo(this.raio     * Math.cos(i * 60 * grau), this.raio     * Math.sin(i * 60 * grau));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.raio / 2 * Math.cos(i * 60 * grau), this.raio / 2 * Math.sin(i * 60 * grau));
                ctx.lineTo(this.raio / 2 * Math.cos(j * 60 * grau), this.raio / 2 * Math.sin(j * 60 * grau));
                ctx.stroke();
            }
        };

        const desenharPes = () => {
            ctx.fillStyle = "rgb(96,192,0)";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            for (let i = 1; i < 8; i += 2) {
                for (const j of [-5, 0, 5]) {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(this.raio * 1.4 * Math.cos((i * 45 + j) * grau), this.raio * 1.4 * Math.sin((i * 45 + j) * grau));
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(this.raio * 1.2 * Math.cos((i * 45 - 10) * grau), this.raio * 1.2 * Math.sin((i * 45 - 10) * grau));
                ctx.lineTo(this.raio * 1.2 * Math.cos((i * 45 + 10) * grau), this.raio * 1.2 * Math.sin((i * 45 + 10) * grau));
                ctx.lineTo(0, 0);
                ctx.fill();
                ctx.stroke();
            }
        };

        const desenharCabeca = () => {
            ctx.fillStyle = "rgb(96,192,0)";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.raio * 1.3 * Math.cos(- 75 * grau), this.raio * 1.3 * Math.sin(- 75 * grau));
            ctx.lineTo(this.raio * 1.5 * Math.cos(- 90 * grau), this.raio * 1.5 * Math.sin(- 90 * grau));
            ctx.lineTo(this.raio * 1.3 * Math.cos(-105 * grau), this.raio * 1.3 * Math.sin(-105 * grau));
            ctx.moveTo(0, 0);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.ellipse(this.raio * 1.2 * Math.cos(-85 * grau), this.raio * 1.2 * Math.sin(-85 * grau), 2, 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(this.raio * 1.2 * Math.cos(-95 * grau), this.raio * 1.2 * Math.sin(-95 * grau), 2, 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        };

        const desenharCauda = () => {
            ctx.fillStyle = "rgb(96,192,0)";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.raio       * Math.cos( 80 * grau), this.raio       * Math.sin( 80 * grau));
            ctx.lineTo(this.raio * 1.3 * Math.cos( 90 * grau), this.raio * 1.3 * Math.sin( 90 * grau));
            ctx.lineTo(this.raio       * Math.cos(100 * grau), this.raio       * Math.sin(100 * grau));
            ctx.moveTo(0, 0);
            ctx.fill();
            ctx.stroke();
        }

        const desenharBalao = () => {
            this.#balao.desenhar(ctx, px + this.raio + 5, py);
        };

        ctx.save();
        try {
            ctx.translate(px, py);
            ctx.rotate(this.#a);
            desenharPes();
            desenharCabeca();
            desenharCauda();
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