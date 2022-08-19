import Camera from '../3d/camera.js';
import Matrix from '../3d/matrix.js';
import Mesh from '../3d/mesh.js';
import { TUBE_LENGTH } from '../sketch.js';

// An actor in the game, existing on the inside of a cylinder and moving along its length
export class Actor {
  speed: number;
  posZ: number;
  rot: number;
  orbitDistance: number;
  mesh: Mesh;

  isGood: boolean;

  constructor(mesh: Mesh, rot: number, isGood: boolean) {
    this.mesh = new Mesh(mesh);
    this.rot = rot;
    this.isGood = isGood;
  }

  draw(camera: Camera, lightSource: p5.Vector): void {
    this.mesh.convert2D(camera);
    this.mesh.draw(lightSource);
  }
}

// An incoming actor, moving from the far end of the tube to the player
export class IncomingActor extends Actor {
  isLeaving: boolean;

  constructor(mesh: Mesh, rot: number, isGood: boolean, speed: number) {
    super(mesh, rot, isGood);
    this.speed = speed;
    this.posZ = TUBE_LENGTH;
    this.orbitDistance = 18;
  }

  update(worldRot: number): boolean {
    this.posZ -= this.speed * (deltaTime/1000);

    if (this.isLeaving) {
      this.orbitDistance -= this.orbitDistance * (deltaTime/1000);
      this.orbitDistance = constrain(this.orbitDistance, 0, 18);
    }

    if (this.posZ < 0) {
      this.orbitDistance += pow(-(this.posZ/4), 2);
      if (this.posZ < -25) {
        return false;
      }
    }

    this.mesh.world = Matrix.mult(
      Matrix.createRotationZ(this.rot + worldRot),
      Matrix.createTranslation(0, -this.orbitDistance, this.posZ),
    );

    return true;
  }

  pickup(): void {
    this.isLeaving = true;
    this.speed *= 4;
    this.mesh.color = lerpColor(this.mesh.color, color(255), 0.5);
  }
}

// A projectile, moving from the player to the end of the tube
export class ProjectileActor extends Actor {
  spin = 0;

  constructor(mesh: Mesh, rot: number, isGood: boolean) {
    super(mesh, rot, isGood);
    this.speed = 250;
    this.posZ = 0;
    this.orbitDistance = 18;
  }

  update(worldRot: number): boolean {
    this.posZ += this.speed * (deltaTime/1000);

    if (this.posZ > TUBE_LENGTH) {
      return false;
    }

    this.mesh.world = Matrix.mult(
      Matrix.createRotationZ(this.rot + worldRot),
      Matrix.createTranslation(0, -this.orbitDistance, this.posZ),
      Matrix.createRotationY(this.spin),
    );

    return true;
  }
}
