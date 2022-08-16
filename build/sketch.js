globalThis.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
globalThis.setup = function () {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
};
globalThis.draw = function () {
    background('#281d3a');
};
//# sourceMappingURL=sketch.js.map