"use strict";

const TEMPO_FLAP = 0.1;
const IMPULSO_FLAP = -200;
const IMPULSO_MAXIMO = -1200;
const RAIO_PASSARINHO = 20;
const VELOCIDADE_TERMINAL = 4000;
const DISTANCIA_PERNAS = 5;

class Passarinho extends GameObject {
    #x;
    #y;
    #vy;
    #vivo;
    #asas;
    #cor;
    #corOlho;
    #balao;
    #tempoMorte;
    #pousado;
    #checkpoint;

    get x      () { return this.#x                         ; }
    get y      () { return this.#y                         ; }
    get raio   () { return RAIO_PASSARINHO                 ; }
    get vivo   () { return this.#vivo                      ; }
    get vx     () { return this.pousado ? 0 : this.mundo.vx; }
    get vy     () { return this.pousado ? 0 : this.#vy     ; }
    get pousado() { return this.#pousado                   ; }
    get pernas () { return DISTANCIA_PERNAS                ; }
    get x1     () { return this.#x - this.raio             ; }
    get y1     () { return this.#y - this.raio             ; }
    get x2     () { return this.#x + this.raio             ; }
    get y2     () { return this.#y + this.raio             ; }

    constructor(plataforma, cor, corOlho) {
        super(plataforma.mundo);
        this.#balao = new Balao(10, this.lingua.saudacao);
        this.#cor = cor;
        this.#corOlho = corOlho;
        this.gotoSobre(plataforma);
    }

    get #inclinacao() {
        if (this.mundo.ganhou) return 0;
        const [vx, vy] = [this.vx, this.vy];
        if (!this.vivo && vy === 0) return Math.PI / 2;
        const hipotenusa = Math.sqrt(vx ** 2 + vy ** 2);
        if (hipotenusa === 0) return 0;
        const seno = vy / hipotenusa;
        return Math.asin(seno);
    }

    flap() {
        if (!this.vivo || this.#asas !== 0) return;
        this.#asas = TEMPO_FLAP;
        this.#pousado = null;
        this.#pousado = null;
    }

    gotoXY(x, y) {
        this.#x = x;
        this.#y = y;
        this.#vy = 0;
    }

    set checkpoint(plataforma) {
        this.#checkpoint = plataforma;
    }

    gotoSobre(plataforma) {
        this.#x = (plataforma.x1 + plataforma.x2) / 2;
        this.#y = plataforma.y1 - this.raio - this.pernas;
        this.#vy = 0;
        this.#pousado = plataforma;
        this.#checkpoint = plataforma;
        this.#vivo = true;
        this.#asas = 0;
        this.#tempoMorte = 0;
    }

    tick(deltaT) {
        if (!this.vivo && this.#tempoMorte < 11) {
            this.#balao = new Balao(1, "" + Math.floor(this.#tempoMorte));
        }
        this.#balao.tick(deltaT);
        const mundo = this.mundo;

        if (mundo.ganhou) {
            this.#voarAoCentro(deltaT);
            return;
        }

        if (this.vivo && this.#asas === TEMPO_FLAP) {
            this.#vy += IMPULSO_FLAP;
            mundo.callbacks.bateuAsas();
        }

        if (this.#tempoMorte > 0) {
            this.#tempoMorte -= deltaT / 1000;
            if (this.#tempoMorte <= 0) {
                this.#tempoMorte = 0;
                this.#balao = new Balao(5, this.lingua.voltei);
                this.gotoSobre(this.#checkpoint);
            }
        }

        this.#asas -= deltaT / 1000;
        if (this.#asas < 0) this.#asas = 0;

        if (!this.vivo || !this.pousado) {
            this.#vy += (mundo.gravidade * deltaT / 1000);
            if (this.#vy > VELOCIDADE_TERMINAL) this.#vy = VELOCIDADE_TERMINAL;
            if (this.#vy < IMPULSO_MAXIMO) this.#vy = IMPULSO_MAXIMO;
            if (this.vivo) this.#x += (this.vx * deltaT / 1000);
            this.#y += (this.#vy * deltaT / 1000);
        }

        this.#testarColisao();

        if (this.#y + this.raio > mundo.alturaChao) {
            this.#y = mundo.alturaChao - this.raio;
            this.#vy = 0;
        }
        if (this.#y - this.raio < mundo.alturaTeto) {
            this.#y = mundo.alturaTeto + this.raio;
            this.#vy = 0;
        }
    }

    #voarAoCentro(deltaT) {
        const mundo = this.mundo;
        const alturaDestino = mundo.alturaDecolar - this.raio - this.pernas;
        this.#vy = 0;
        const dv = this.vx * deltaT / 1000;
        this.#x += dv;
        if (this.#x >= mundo.xmax) this.#x = mundo.xmax;
        if (alturaDestino < this.#y - dv) {
            this.#y -= dv;
            this.#asas = 1;
        } else if (alturaDestino > this.#y + dv) {
            this.#y += dv;
            this.#asas = 1;
        } else {
            this.#y = alturaDestino;
            this.#asas = 0;
        }
    }

    #testarColisao() {
        const mundo = this.mundo;
        if (
            !this.vivo ||
            (!mundo.obstaculos.some(ob => ob !== this.pousado && ob.colide(this, this.#x, this.#y, this.raio)) &&
            !mundo.irritantes.some(ob => ob.colide(this, this.#x, this.#y, this.raio)))
        ) return;
        mundo.callbacks.morreu();
        this.#vivo = false;
        this.#tempoMorte = 15;
        this.#balao = new Balao(5, mundo.lingua.morte);
    }

    passouDeFase(novaFase) {
        if (novaFase.ultima) {
            this.#balao = new Balao(10, this.lingua.vitoria);
        } else {
            this.#balao = new Balao(5, this.lingua.fase(novaFase.numero));
        }
    }

    desenhar(ctx) {

        const px = this.x - this.mundo.offX;
        const py = this.y - this.mundo.offY;

        const desenharCauda = () => {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.#cor;
            ctx.beginPath();
            ctx.moveTo(-this.raio     ,   0);
            ctx.lineTo(-this.raio - 20,  -5);
            ctx.lineTo(-this.raio - 20, -15);
            ctx.lineTo(0, 0);
            ctx.stroke();
            ctx.fill();
        };

        const desenharCorpo = () => {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.raio, this.raio, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        };

        const desenharAsa = (x, y) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.#cor;
            const altura = this.#asas ? -30 : 10;
            ctx.moveTo(x, y);
            ctx.lineTo(x - 15, altura + y);
            ctx.lineTo(x - 25, altura + y);
            ctx.lineTo(x - 20, y);
            ctx.lineTo(x - 10, y);
            ctx.stroke();
            ctx.fill();
        };

        const desenharBico = () => {
            ctx.lineWidth = 1;
            ctx.fillStyle = "rgb(192,64,64)";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.raio, 0);
            ctx.lineTo(this.raio + 8, 5);
            ctx.lineTo(5, 5);
            ctx.moveTo(this.raio + 8, 5);
            ctx.lineTo(this.raio, 10);
            ctx.lineTo(5, 10);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.stroke();
        };

        const desenharOlho = () => {
            /* córnea */
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.ellipse(this.raio / 2, -this.raio / 2, this.raio / 2, this.raio / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            /* pupila */
            if (this.vivo) {
                ctx.strokeStyle = "black";
                ctx.fillStyle = this.#corOlho;
                ctx.beginPath();
                ctx.ellipse(3 * this.raio / 4, -this.raio / 2, this.raio / 4, this.raio / 4, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.strokeStyle = "black";
                ctx.beginPath();
                ctx.moveTo(    this.raio / 4, -3 * this.raio / 4);
                ctx.lineTo(3 * this.raio / 4, -    this.raio / 4);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(    this.raio / 4, -    this.raio / 4);
                ctx.lineTo(3 * this.raio / 4, -3 * this.raio / 4);
                ctx.stroke();
            }
        };

        const desenharPe = x => {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(x    , this.raio - 5);
            ctx.lineTo(x    , this.raio + 5);
            ctx.moveTo(x    , this.raio    );
            ctx.lineTo(x + 5, this.raio + 5);
            ctx.moveTo(x    , this.raio    );
            ctx.lineTo(x - 5, this.raio + 5);
            ctx.stroke();
        };

        const desenharBalao = () => {
            this.#balao.desenhar(ctx, px + this.raio + 5, py);
        };

        ctx.save();
        try {
            ctx.translate(px, py);
            ctx.rotate(this.#inclinacao);
            desenharAsa(-7, 2);
            desenharPe(-5);
            desenharCauda();
            desenharCorpo();
            desenharAsa(-3, 0);
            desenharBico();
            desenharOlho();
            desenharPe(5);
        } finally {
            ctx.restore();
        }
        desenharBalao();
    }
}