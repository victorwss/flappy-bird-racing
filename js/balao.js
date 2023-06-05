"use strict";

const DISTANCIA = 30;
const MARGEM = 10;

class Balao {
    #texto;
    #vida;

    constructor(vida, texto) {
        this.#texto = texto;
        this.#vida = vida;
    }

    get vida() { return this.#vida; }

    tick(deltaT) {
        if (this.#vida <= 0) return;
        this.#vida -= deltaT / 1000;
    }

    desenhar(ctx, x, y) {
        if (this.#vida <= 0) return;
        ctx.save();
        try {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.font = "20px serif";
            ctx.textAlign = "left";
            ctx.lineWidth = 1;

            const partes = this.#texto.split("\n");
            const medida = partes.map(p => ctx.measureText(p));
            const medida2 = ctx.measureText("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
            const width = medida.reduce((a, b) => Math.max(a, b.width), 0);
            const padding = 10;
            const lineHeight = Math.abs(medida2.actualBoundingBoxAscent) - Math.abs(medida2.actualBoundingBoxDescent);
            const height = partes.length * lineHeight + padding * (partes.length - 1);
            /*const medida = ctx.measureText(this.#texto);
            const medida2 = ctx.measureText("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
            const width = medida.width;
            const height = Math.abs(medida2.actualBoundingBoxAscent) - Math.abs(medida2.actualBoundingBoxDescent);*/

            ctx.beginPath();
            ctx.roundRect(x + DISTANCIA, y - MARGEM - height / 2, width + 2 * MARGEM, height + 2 * MARGEM, 8);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + DISTANCIA + 1, y - 5);
            ctx.lineTo(x, y);
            ctx.lineTo(x + DISTANCIA + 1, y + 5);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            const off = (partes.length - 1) / 2;
            for (const i in partes) {
                ctx.fillText(
                    partes[i],
                    x + DISTANCIA + MARGEM + width / 2,
                    y + (i - off) * (lineHeight + padding) + Math.abs(medida2.actualBoundingBoxAscent) / 2
                );
            }
        } finally {
            ctx.restore();
        }
    }
}