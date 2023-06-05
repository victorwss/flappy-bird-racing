"use strict";

function gradiente(seed) {
    if (seed < 0 || seed >= 1) throw new Error(seed);
    function mix(a, b, bw) {
        const aw = 1 - bw;
        const p = [b[0] * bw + a[0] * aw, b[1] * bw + a[1] * aw, b[2] * bw + a[2] * aw];
        return `rgb(${Math.floor(p[0])},${Math.floor(p[1])},${Math.floor(p[2])})`;
    }
    const colors = [[255,0,0], [128,255,0], [255,255,0], [0,255,0], [0,255,255], [0,0,255], [128,0,255]];
    const [red, orange, yellow, green, cyan, blue, violet] = colors;
    const doubleRainbow = [...colors, ...colors];
    const start = colors.length * seed;
    const stops = [];
    
    for (let i = 0; i < colors.length; i++) {
        stops.push([
            i / colors.length,
            mix(
                doubleRainbow[Math.floor(start + i)    ],
                doubleRainbow[Math.floor(start + i) + 1],
                start % 1
            )
        ]);
        stops.push([
            (i + 1 - start % 1) / colors.length,
            mix(doubleRainbow[Math.floor(start + i) + 1], [0,0,0], 0)
        ]);
    }
    return stops;
}

function radial(ctx, seed, raio) {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 2 * raio);
    const stops = gradiente(seed);
    for (const stop of stops) {
        g.addColorStop(stop[0], stop[1]);
    }
    return g;
}