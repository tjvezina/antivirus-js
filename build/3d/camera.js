import { VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';
export default class Camera {
    constructor(pos, dir, fov, aspectRatio) {
        Object.assign(this, { pos, dir, fov, aspectRatio });
    }
}
export function perspectiveProjection(vertex, camera) {
    if (vertex.z < camera.pos.z) {
        return createVector(vertex.x / vertex.x * VIEW_WIDTH + (VIEW_WIDTH / 2), -(vertex.y / vertex.y * VIEW_HEIGHT) + (VIEW_HEIGHT / 2));
    }
    const hyp = p5.Vector.sub(vertex, camera.pos);
    const angle = camera.dir.angleBetween(hyp);
    const adj = hyp.mag() * cos(angle);
    const midToCorner = adj * tan(camera.fov);
    const dir = camera.dir.copy();
    dir.normalize();
    dir.mult(adj);
    const vPos = createVector(vertex.x - camera.pos.x + dir.x, vertex.y - camera.pos.y + dir.y);
    const screenDiagonal = sqrt(VIEW_WIDTH * VIEW_WIDTH + VIEW_HEIGHT * VIEW_HEIGHT);
    const scale = (screenDiagonal / 2) / midToCorner;
    vPos.mult(scale);
    vPos.add(createVector(VIEW_WIDTH / 2, VIEW_HEIGHT / 2));
    vPos.y = VIEW_HEIGHT - vPos.y;
    return vPos;
}
export function isFacingCamera(tri) {
    const a = createVector(tri[0].x - tri[1].x, tri[0].y - tri[1].y, 0);
    const b = createVector(tri[2].x - tri[1].x, tri[2].y - tri[1].y, 0);
    return a.cross(b).z < 0;
}
export function getSurfaceNormal(verts) {
    const a = p5.Vector.sub(verts[0], verts[1]);
    const b = p5.Vector.sub(verts[2], verts[1]);
    return b.cross(a);
}
//# sourceMappingURL=camera.js.map