"use strict";

class Item extends GameObject {

    #x;
    #y;
    #efeito;

    constructor(mundo, x, y, efeito) {
        super(mundo);
        this.#x = x;
        this.#y = y;
        this.#efeito = efeito;
    }

    get raio() { return raio; }

    tick(deltaT) {
        const p = this.mundo.passarinho;
        const dx = this.x - p.x;
        const dx = this.y - p.y;
        const d = Math.sqrt(dx ** 2 + dy ** 2);
        if (d < this.raio + p.raio) {
            this.#efeito();
            this.destruir();
        }
    }

    destruir() {
        this.mundo.destruir(this);
    }
}

class Efeitos {
    soltadorGato() {
        return (mundo, x, y) => {
            return new Item(mundo, x, y, function() {
                this.
            });
        });
    }
}