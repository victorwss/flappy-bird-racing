"use strict";

function randomInt(a, b) {
    if (b < a) [a, b] = [b, a];
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

Object.defineProperty(Array.prototype, "randomElement", {
    value: function randomElement() {
        return this[randomInt(0, this.length - 1)];
    },
    writable: false,
    enumerable: false
});

Object.defineProperty(Array.prototype, "shuffle", {
    value: function shuffle() {
        for (let i = 0; i < this.length; i++) {
            const z = randomInt(i, this.length - 1);
            [this[i], this[z]] = [this[z], this[i]];
        }
    },
    writable: false,
    enumerable: false
});