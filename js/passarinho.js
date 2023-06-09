"use strict";

const TEMPO_FLAP = 0.1;
const IMPULSO_FLAP = -200;
const IMPULSO_MAXIMO = -1200;
const RAIO_PASSARINHO = 20;
const VELOCIDADE_TERMINAL = 4000;
const DISTANCIA_PERNAS = 5;
const TEMPO_MORTE = 8;
const TEMPO_BALAO_MORREU = 3;
const TEMPO_CONTAGEM = 5;
const TEMPO_VOLTANDO = 2;
const TEMPO_BALAO_VOLTEI = 5;

class Passarinho extends GameObject {
    #x;
    #y;
    #vy;
    #vivo;
    #asas;
    #balao;
    #tempoMorte;
    #pousado;
    #checkpoint;
    #spec;
    #quentura;

    get spec   () { return this.#spec                     ; }
    get lingua () { return this.spec.lingua               ; }
    get x      () { return this.#x                        ; }
    get y      () { return this.#y                        ; }
    get raio   () { return RAIO_PASSARINHO                ; }
    get vivo   () { return this.#vivo                     ; }
    get vx     () { return this.pousado ? 0 : this.spec.vx; }
    get vy     () { return this.pousado ? 0 : this.#vy    ; }
    get pousado() { return this.#pousado                  ; }
    get pernas () { return DISTANCIA_PERNAS               ; }
    get x1     () { return this.#x - this.raio            ; }
    get y1     () { return this.#y - this.raio            ; }
    get x2     () { return this.#x + this.raio            ; }
    get y2     () { return this.#y + this.raio            ; }

    constructor(plataforma, spec) {
        if (plataforma.mundo !== spec.mundo) {
            console.log(plataforma.mundo, spec.mundo);
            throw new Error();
        }

        super(plataforma.mundo);

        this.#spec = spec;
        this.#balao = new Balao(10, this.lingua.saudacao);
        this.gotoSobre(plataforma);
    }

    get #inclinacao() {
        if (this.spec.ganhou) return 0;
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
        this.#x = randomInt(plataforma.x1, plataforma.x2);
        this.#y = plataforma.y1 - this.raio - this.pernas;
        this.#vy = 0;
        this.#pousado = plataforma;
        this.#checkpoint = plataforma;
        this.#vivo = true;
        this.#asas = 0;
        this.#tempoMorte = 0;
        this.#quentura = 5;
    }

    tick(deltaT) {
        if (!this.vivo && this.#tempoMorte <= TEMPO_CONTAGEM) {
            this.#balao = new Balao(1, "" + Math.floor(this.#tempoMorte));
        }
        this.#balao.tick(deltaT);
        const spec = this.spec;

        if (spec.ganhou) {
            this.#voarAoCentro(deltaT);
            return;
        }

        if (this.vivo && this.#asas === TEMPO_FLAP) {
            this.#vy += IMPULSO_FLAP;
            spec.bateuAsas();
        }

        if (this.#quentura > 0) {
            this.#quentura -= deltaT / 1000;
            if (this.#quentura < 0) this.#quentura = 0;
        }

        if (this.#tempoMorte > 0) {
            this.#tempoMorte -= deltaT / 1000;
            if (this.#tempoMorte <= 0) {
                this.#tempoMorte = 0;
                this.#balao = new Balao(TEMPO_BALAO_VOLTEI, this.lingua.voltei);
                this.gotoSobre(this.#checkpoint);
            }
        }

        this.#asas -= deltaT / 1000;
        if (this.#asas < 0) this.#asas = 0;

        if (!this.vivo || !this.pousado) {
            this.#vy += (spec.gravidade * deltaT / 1000);
            if (this.#vy > VELOCIDADE_TERMINAL) this.#vy = VELOCIDADE_TERMINAL;
            if (this.#vy < IMPULSO_MAXIMO) this.#vy = IMPULSO_MAXIMO;
            if (this.vivo) this.#x += (this.vx * deltaT / 1000);
            this.#y += (this.#vy * deltaT / 1000);
        }

        this.#testarColisao();

        if (this.#y + this.raio > this.mundo.alturaChao) {
            this.#y = this.mundo.alturaChao - this.raio;
            this.#vy = 0;
        }
        if (this.#y - this.raio < this.mundo.alturaTeto) {
            this.#y = this.mundo.alturaTeto + this.raio;
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
        if (this.#quentura > 0) return;
        this.spec.morreu();
        this.#vivo = false;
        this.#tempoMorte = TEMPO_MORTE;
        this.#balao = new Balao(TEMPO_BALAO_MORREU, this.lingua.morte);
    }

    passouDeFase() {
        const fase = this.spec.fase;
        if (fase.ultima) {
            this.#balao = new Balao(10, this.lingua.vitoria);
        } else {
            this.#balao = new Balao(5, this.lingua.fase(fase.numero));
        }
    }

    #iridescente(spec, ctx) {
        if (this.#quentura && spec === this.spec) return radial(ctx, this.#quentura % 1, this.raio);
        if (this.vivo || this.#tempoMorte >= TEMPO_VOLTANDO) return null;
        return radial(ctx, this.#tempoMorte / TEMPO_MORTE, this.raio * 3);
    }

    desenhar(spec, ctx) {
        const px = this.x - spec.offX;
        const py = this.y - spec.offY;
        const iris = this.#iridescente(spec, ctx);

        const desenharCauda = () => {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillStyle = iris ?? this.spec.cor;
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
            ctx.fillStyle = iris ?? this.spec.cor;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.raio, this.raio, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        };

        const desenharAsa = (x, y) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillStyle = iris ?? this.spec.cor;
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
            ctx.fillStyle = iris ?? "rgb(192,64,64)";
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
            ctx.fillStyle = iris ?? "white";
            ctx.beginPath();
            ctx.ellipse(this.raio / 2, -this.raio / 2, this.raio / 2, this.raio / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            /* pupila */
            if (this.vivo) {
                ctx.strokeStyle = "black";
                ctx.fillStyle = iris ?? this.spec.corOlhos;
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
            ctx.strokeStyle = iris ?? "red";
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

        const desenharPrincipal = () => {
            ctx.save();
            try {
                if (iris && !this.#quentura) ctx.globalAlpha = 0.5;
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
        };

        desenharPrincipal();
        desenharBalao();
    }
}