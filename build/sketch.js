import Camera from './3d/camera.js';
import Matrix from './3d/matrix.js';
import Mesh from './3d/mesh.js';
const score = 0;
const scoreInc = 4;
const maxScore = 660;
let gameCamera;
let lightSource;
let worldRot;
let maxSpeed;
let maxShipRot;
let cube;
globalThis.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
globalThis.setup = function () {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    gameCamera = new Camera(createVector(0, 0, -50), createVector(0, 0, 1), PI / 4, width / height);
    lightSource = createVector(0.87, -1.24, -0.92);
    worldRot = PI;
    maxSpeed = PI * 0.05;
    maxShipRot = PI / 4;
    cube = new Mesh(color('#d38929'));
    cube.createCube();
};
globalThis.draw = function () {
    background('#281d3a');
    cube.world = Matrix.createScale(5).mult(Matrix.createRotationX(-0.25).mult(Matrix.createRotationY(millis() / 1000 * TWO_PI / 8)));
    cube.convert2D(gameCamera, width, height);
    cube.draw(lightSource);
};
function roundToTrack(value) {
    let deg = floor(degrees(value));
    while (deg < 0)
        deg += 360;
    return radians(deg - (deg % 20) * 20);
}
function setPanelPos(worldRot) {
    let deg = degrees(worldRot);
    while (deg < 0)
        deg += 360;
    const mod = floor(deg / 20);
    return radians(deg - mod * 20);
}
//# sourceMappingURL=sketch.js.map