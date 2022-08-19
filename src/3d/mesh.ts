import Camera, { getSurfaceNormal, isFacingCamera, perspectiveProjection } from './camera.js';
import Matrix from './matrix.js';

export default class Mesh {
  // Object-space vertex positions
  vertexList: p5.Vector[] = [];
  // Screen-space vertex positions
  pointList: p5.Vector[] = [];
  // Vertex index groups, which form the mesh's polygons
  polygonList: number[][] = [];

  world = new Matrix();
  color = color(255);

  constructor(color: p5.Color);
  constructor(toCopy: Mesh);
  constructor(arg: p5.Color | Mesh) {
    if (arg instanceof p5.Color) {
      this.color = arg;
    } else {
      this.color = arg.color;
      this.world = new Matrix(arg.world);
      this.vertexList = arg.vertexList.map(vert => vert.copy());
      this.pointList = arg.pointList.map(point => point.copy());
      this.polygonList = arg.polygonList.map(polygon => [...polygon]);
    }
  }

  createCube(): void {
    const { vertexList, polygonList } = this;

    vertexList.length = 0;
    vertexList.push(createVector(1, 1, 1)); // RUF 0
    vertexList.push(createVector(1, 1, -1)); // RUB 1
    vertexList.push(createVector(1, -1, 1)); // RDF 2
    vertexList.push(createVector(1, -1, -1)); // RDB 3
    vertexList.push(createVector(-1, 1, 1)); // LUF 4
    vertexList.push(createVector(-1, 1, -1)); // LUB 5
    vertexList.push(createVector(-1, -1, 1)); // LDF 6
    vertexList.push(createVector(-1, -1, -1)); // LDB 7

    polygonList.length = 0;
    polygonList.push(...[
      [0, 2, 3, 1],
      [5, 7, 6, 4],
      [1, 5, 4, 0],
      [2, 6, 7, 3],
      [0, 4, 6, 2],
      [3, 7, 5, 1],
    ]);
  }

  convert2D(camera: Camera): void {
    const { vertexList, pointList, world } = this;

    pointList.length = 0;

    vertexList.forEach(vert => {
      pointList.push(perspectiveProjection(this.world.multVec(vert), camera));
    });
  }

  draw(lightSource: p5.Vector): void {
    const { polygonList, pointList, vertexList, world } = this;

    for (let polygon = 0; polygon < polygonList.length; polygon++) {
      const next = polygonList[polygon];

      const pt = new Array<p5.Vector>(next.length);
      const verts = new Array<p5.Vector>(next.length);

      for (let point = 0; point < next.length; point++) {
        pt[point] = pointList[next[point]];
        verts[point] = world.multVec(vertexList[next[point]]);
      }

      if (isFacingCamera(pt)) {
        const angle = abs(lightSource.angleBetween(getSurfaceNormal(verts)));
        let col: p5.Color;

        if (angle <= PI/2) {
          col = lerpColor(
            lerpColor(color(255), this.color, 0),
            this.color,
            sqrt(sqrt(angle / (PI/2))),
          );
        } else {
          col = lerpColor(
            this.color,
            lerpColor(color(0), this.color, 0.15),
            (angle - PI/2) / (PI/2),
          );
        }

        push();
        {
          fill(col).stroke(col).strokeWeight(1);
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
