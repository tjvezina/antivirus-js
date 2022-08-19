import Matrix from '../3d/matrix.js';
import Mesh from '../3d/mesh.js';
import { TUBE_LENGTH } from '../sketch.js';
export class Actor {
    constructor(mesh, rot, isGood) {
        this.mesh = new Mesh(mesh);
        this.rot = rot;
        this.isGood = isGood;
    }
    draw(camera, lightSource) {
        this.mesh.convert2D(camera);
        this.mesh.draw(lightSource);
    }
}
export class IncomingActor extends Actor {
    constructor(mesh, rot, isGood, speed) {
        super(mesh, rot, isGood);
        this.speed = speed;
        this.posZ = TUBE_LENGTH;
        this.orbitDistance = 18;
    }
    update(worldRot) {
        this.posZ -= this.speed * (deltaTime / 1000);
        if (this.isLeaving) {
            this.orbitDistance -= this.orbitDistance * (deltaTime / 1000);
            this.orbitDistance = constrain(this.orbitDistance, 0, 18);
        }
        if (this.posZ < 0) {
            this.orbitDistance += pow(-(this.posZ / 4), 2);
            if (this.posZ < -25) {
                return false;
            }
        }
        this.mesh.world = Matrix.mult(Matrix.createRotationZ(this.rot + worldRot), Matrix.createTranslation(0, -this.orbitDistance, this.posZ));
        return true;
    }
    pickup() {
        this.isLeaving = true;
        this.speed *= 4;
        this.mesh.color = lerpColor(this.mesh.color, color(255), 0.5);
    }
}
export class ProjectileActor extends Actor {
    constructor(mesh, rot, isGood) {
        super(mesh, rot, isGood);
        this.spin = 0;
        this.speed = 250;
        this.posZ = 0;
        this.orbitDistance = 18;
    }
    update(worldRot) {
        this.posZ += this.speed * (deltaTime / 1000);
        if (this.posZ > TUBE_LENGTH) {
            return false;
        }
        this.mesh.world = Matrix.mult(Matrix.createRotationZ(this.rot + worldRot), Matrix.createTranslation(0, -this.orbitDistance, this.posZ), Matrix.createRotationY(this.spin));
        return true;
    }
}
//# sourceMappingURL=actor.js.map