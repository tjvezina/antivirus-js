import Camera, { perspectiveProjection } from '../3d/camera.js';
import Matrix from '../3d/matrix.js';
import { TUBE_LENGTH } from '../sketch.js';

const MIN_COUNT = 15;
const MAX_COUNT = 20;
const MIN_LIFE = 0.5;
const MAX_LIFE = 1.0;
const MIN_INIT_SPEED = 1;
const MAX_INIT_SPEED = 3;
const MIN_FINAL_SPEED = 0;
const MAX_FINAL_SPEED = 0;

class Particle {
  life: number;
  age: number;
  initSpeed: number;
  finalSpeed: number;

  direction: p5.Vector;
  position: p5.Vector;

  constructor();
  constructor(life: number, initSpeed: number, finalSpeed: number, direction: p5.Vector);
  constructor(life?: number, initSpeed?: number, finalSpeed?: number, direction?: p5.Vector) {
    this.life = life ?? 0;
    this.age = 0;
    this.initSpeed = initSpeed ?? 0;
    this.finalSpeed = finalSpeed ?? 0;

    this.direction = direction ?? createVector();
    this.position = createVector();
  }

  update(): boolean {
    const { life, age, initSpeed, finalSpeed, direction, position } = this;

    if (age >= life) return false;

    // TODO: Remove type conversions after type definition is corrected
    const movement = p5.Vector.mult(direction, initSpeed + ((finalSpeed - initSpeed) * (age / life))) as unknown as p5.Vector;
    position.add(movement);

    this.age += (deltaTime/1000);

    return true;
  }
}

export default class ParticleExplosion {
  particleCount: number;
  posZ: number;
  orbit: number;

  col = color(255);

  world = new Matrix();

  particleList: Particle[] = [];

  pointList: p5.Vector[] = [];

  constructor(posZ: number, orbit: number, col: p5.Color) {
    this.posZ = posZ;
    this.orbit = orbit;
    this.col = col;

    this.particleCount = floor(random(MIN_COUNT, MAX_COUNT + 1));

    for (let p = 0; p < this.particleCount; p++) {
      const life = random(MIN_LIFE, MAX_LIFE);
      const initSpeed = random(MIN_INIT_SPEED, MAX_INIT_SPEED);
      const finalSpeed = random(MIN_FINAL_SPEED, MAX_FINAL_SPEED);
      const direction = createVector(
        random(-0.5, 0.5),
        random(0.5, 1.0),
        random(-0.5, 0.5),
      ).normalize();

      this.particleList.push(new Particle(life, initSpeed, finalSpeed, direction));
    }
  }

  update(worldRot: number): boolean {
    this.world = Matrix.mult(
      Matrix.createRotationZ(worldRot + this.orbit),
      Matrix.createTranslation(0, -18, this.posZ),
    );

    let particlesLeft = false;

    for (let p = 0; p < this.particleCount; p++) {
      if (this.particleList[p].update()) {
        particlesLeft = true;
      }
    }

    return particlesLeft;
  }

  draw(): void {
    fill(this.col).stroke(this.col).strokeWeight(1);
    this.pointList.forEach(p => {
      circle(p.x, p.y, (TUBE_LENGTH-this.posZ) / 50);
    });
  }

  convert2D(camera: Camera): void {
    this.pointList.length = 0;

    this.particleList.filter(particle => particle.age < particle.life).forEach(particle => {
      this.pointList.push(perspectiveProjection(this.world.multVec(particle.position), camera));
    });
  }
}
