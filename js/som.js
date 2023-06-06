"use strict";

const SOM = "mp3";

class Som {
    #levelSet;
    #musica;
    #sonsTocando = {};
    #chave = 0;
    #musicaOn;
    #soundsOn;

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
        this.#musicaOn = this.#soundsOn = true;
        this.#configureToggleButtons();
    }

    #configureToggleButtons() {
        const mon  = document.getElementById("music-on");
        const moff = document.getElementById("music-off");
        const son  = document.getElementById("sound-on");
        const soff = document.getElementById("sound-off");
        mon.onclick = async () => {
            mon.classList.add("selected");
            moff.classList.remove("selected");
            await this.#toggleMusica(true);
        };
        moff.onclick = async () => {
            mon.classList.remove("selected");
            moff.classList.add("selected");
            await this.#toggleMusica(false);
        };
        son.onclick = async () => {
            son.classList.add("selected");
            soff.classList.remove("selected");
            await this.#toggleSound(true);
        };
        soff.onclick = async () => {
            son.classList.remove("selected");
            soff.classList.add("selected");
            await this.#toggleSound(false);
        };
    }

    async pontuou(spec) {
        if (!this.#soundsOn) return;
        // TODO...
    }

    async passouDeFase(spec) {
        if (!this.#soundsOn) return;
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
        if (fase.ultima || fase === spec.mundo.faseInicial) await this.#voarvoar();
    }

    async #stopMusic() {
        this.#musica?.pause();
        this.#musica = null;
        document.getElementById("now-playing").innerHTML = "&nbsp;";
    }

    async #playMusic(name, next) {
        await this.#stopMusic();
        if (!this.#musicaOn) return;
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
        if (!this.#soundsOn) return;
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
        if (!this.#soundsOn) return;
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
        if (!this.#soundsOn) return;
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

    async #toggleSound(v) {
        if (v === this.#soundsOn) return;
        this.#soundsOn = v;
        if (!v) this.silenciar();
    }

    async #toggleMusica(v) {
        if (v === this.#musicaOn) return;
        this.#musicaOn = v;
        if (v) {
            await this.#voarvoar();
        } else {
            await this.#stopMusic();
        }
    }
}