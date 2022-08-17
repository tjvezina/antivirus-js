import { getSurfaceNormal, isFacingCamera, perspectiveProjection } from './camera.js';
export default class Mesh {
    constructor(color) {
        this.vertexList = [];
        this.pointList = [];
        this.polygonList = [];
        this.color = color;
    }
    createCube() {
        const { vertexList, polygonList } = this;
        vertexList.length = 0;
        vertexList.push(createVector(1, 1, 1));
        vertexList.push(createVector(1, 1, -1));
        vertexList.push(createVector(1, -1, 1));
        vertexList.push(createVector(1, -1, -1));
        vertexList.push(createVector(-1, 1, 1));
        vertexList.push(createVector(-1, 1, -1));
        vertexList.push(createVector(-1, -1, 1));
        vertexList.push(createVector(-1, -1, -1));
        polygonList.length = 0;
        polygonList.push(...[
            [0, 1, 3, 2],
            [5, 4, 6, 7],
            [1, 0, 4, 5],
            [2, 3, 7, 6],
            [0, 2, 6, 4],
            [3, 1, 5, 7],
        ]);
    }
    convert2D(camera, winWidth, winHeight) {
        const { vertexList, pointList, world } = this;
        pointList.length = 0;
        vertexList.forEach(vert => {
            pointList.push(perspectiveProjection(this.world.multVec(vert), camera, winWidth, winHeight));
        });
    }
    draw(lightSource) {
        const { polygonList, pointList, vertexList, world } = this;
        for (let polygon = 0; polygon < polygonList.length; polygon++) {
            const next = polygonList[polygon];
            const pt = new Array(next.length);
            const verts = new Array(next.length);
            for (let point = 0; point < next.length; point++) {
                pt[point] = pointList[next[point]];
                verts[point] = world.multVec(vertexList[next[point]]);
            }
            if (isFacingCamera(pt)) {
                const angle = abs(lightSource.angleBetween(getSurfaceNormal(verts)));
                let col;
                if (angle <= PI / 2) {
                    col = lerpColor(lerpColor(color(255), this.color, 0), this.color, sqrt(sqrt(angle / (PI / 2))));
                }
                else {
                    col = lerpColor(this.color, lerpColor(color(0), this.color, 0.15), (angle - PI / 2) / (PI / 2));
                }
                push();
                {
                    fill(col).noStroke();
                    beginShape();
                    {
                        pt.forEach(p => vertex(p.x, p.y));
                    }
                    endShape(CLOSE);
                }
                pop();
            }
        }
    }
}
//# sourceMappingURL=mesh.js.map