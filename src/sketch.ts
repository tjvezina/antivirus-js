import Camera from './3d/camera.js';
import Matrix from './3d/matrix.js';
import Mesh from './3d/mesh.js';

const score = 0;
const scoreInc = 4;
const maxScore = 660;

// const startPoint = createVector(1270, 90);
// const endPoint = createVector(1370, 860);

let gameCamera: Camera;
let lightSource: p5.Vector;

let worldRot: number;
let maxSpeed: number;
let maxShipRot: number;

let cube: Mesh;

globalThis.windowResized = function (): void {
  resizeCanvas(windowWidth, windowHeight);
};

globalThis.setup = function (): void {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  gameCamera = new Camera(createVector(0, 0, -50), createVector(0, 0, 1), PI/4, width/height);
  lightSource = createVector(0.87, -1.24, -0.92);

  worldRot = PI;
  maxSpeed = PI * 0.05;
  maxShipRot = PI/4;

  cube = new Mesh(color('#d38929'));
  cube.createCube();
};

globalThis.draw = function (): void {
  background('#281d3a');

  cube.world = Matrix.createScale(5).mult(
    Matrix.createRotationX(-0.25).mult(
      Matrix.createRotationY(millis()/1000 * TWO_PI / 8),
    ),
  );
  cube.convert2D(gameCamera, width, height);
  cube.draw(lightSource);
};
