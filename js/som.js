"use strict";

class Som {
    #levelSet;
    #musica;
    #sonsTocando = {};
    #chave = 0;

    static #handler(src) {
        return e => {
            if (
                   !(e instanceof DOMException)
                || (!e.message.includes(" aborted ") && !e.message.includes(" interrupted "))
            ) {
                console.error(src, e);
            }
        };
    }

    constructor(levelSet) {
        this.#levelSet = levelSet;
    }

    async pontuou(spec) {
        // TODO...
    }

    async passouDeFase(spec) {
        const fase = spec.fase;
        const chave = this.#chave++;
        const a = new Audio();
        this.#sonsTocando["" + chave] = a;
        a.onended = async () => {
            delete this.#sonsTocando["" + chave];
        };
        a.src = fase.ultima
                ? `${SOM}/${spec.lingua.tagSom}-fim.${SOM}`
                : `${SOM}/${spec.lingua.tagSom}-fase${fase.numero}.${SOM}`;
        fase.openMe();
        document.getElementById("recomecar-" + fase.numero).removeAttribute("disabled");
        await a.play().catch(Som.#handler(a.src));
        if (fase.ultima) await this.#playMusic("voarvoar", async () => {});
        if (fase === spec.mundo.faseInicial) await this.#voarvoar();
    }

    async #playMusic(name, next) {
        this.#musica?.pause();
        document.getElementById("now-playing").innerHTML = "&nbsp;";
        const a = new Audio();
        a.src = `${SOM}/${name}.${SOM}`;
        a.volume = name === "voarvoar" ? 1.0 : 0.3;
        a.onended = async () => {
            if (this.#musica !== a) return;
            this.#musica = null;
            await next();
        };
        document.getElementById("now-playing").innerHTML = name === "voarvoar" ? "&nbsp;" : "Now playing: " + name;
        this.#musica = a;
        await a.play().catch(Som.#handler(a.src));
    }

    async #learnToFly() {
        await this.#playMusic("Foo Fighters - Learn To Fly", async () => await this.#iridescent());
    }

    async #iridescent() {
        await this.#playMusic("Linkin Park - Iridescent", async () => await this.#learnToFly());
    }

    async #voarvoar() {
        await this.#playMusic("voarvoar", async () => await ([true, false].randomElement() ? this.#learnToFly() : this.#iridescent()));
    }

    async bateuAsas(spec) {
        const chave = this.#chave++;
        const a = new Audio();
        this.#sonsTocando["" + chave] = a;
        a.onended = async () => {
            delete this.#sonsTocando["" + chave];
        };
        a.src = `${SOM}/piu${randomInt(1, 8)}.${SOM}`;
        await a.play().catch(Som.#handler(a.src));
    }

    async gato(spec) {
        const chave = this.#chave++;
        const a = new Audio();
        this.#sonsTocando["" + chave] = a;
        a.onended = async () => {
            delete this.#sonsTocando["" + chave];
        };
        a.src = `${SOM}/miau${randomInt(1, 5)}.${SOM}`;
        await a.play().catch(Som.#handler(a.src));
    }

    async morreu(spec) {
        //this.#musica?.pause();
        //document.getElementById("now-playing").innerHTML = "&nbsp;";
        //this.#musica = undefined;
        const chave1 = this.#chave++;
        const plaft = new Audio();
        this.#sonsTocando["" + chave1] = plaft;
        plaft.src = `${SOM}/plaft${randomInt(1, 4)}.${SOM}`;
        plaft.onended = async () => {
            if (!this.#sonsTocando["" + chave1]) return;
            delete this.#sonsTocando["" + chave1];
            const chave2 = this.#chave++;
            const grito = new Audio();
            this.#sonsTocando["" + chave2] = grito;
            grito.onended = async () => {
                delete this.#sonsTocando["" + chave2];
            };
            grito.src = `${SOM}/grito${randomInt(1, 6)}.${SOM}`;
            await grito.play().catch(Som.#handler(grito.src));
        };
        await plaft.play().catch(Som.#handler(plaft.src));
    }

    silenciar() {
        for (const key in this.#sonsTocando) {
            this.#sonsTocando[key].pause();
        }
        this.#sonsTocando = {};
    }
}