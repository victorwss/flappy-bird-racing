"use strict";

class BibliotecaImagens {
    #nomes;
    #imagens;
    #loaders;

    constructor(nomes) {
        this.#nomes = [...nomes];
        this.#imagens = {};
        this.#loaders = {};

        for (const src of nomes) {
            this.#loaders[src] = new Promise((resolve, reject) => {
                let img = new Image();
                this.#imagens[src] = img;
                img.onload = () => {
                    resolve(img);
                }
                img.onerror = reject;
                img.src = src;
            });
        }
    }

    async aguardarImagens() {
        for (const src in this.#loaders) {
            await this.#loaders[src];
        }
    }

    imagem(nome) {
        const img = this.#imagens[nome];
        if (!img) throw new Error(nome);
        return img;
    }
}