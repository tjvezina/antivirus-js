export default class Camera {
  pos: p5.Vector;
  dir: p5.Vector;

  fov: number;
  aspectRatio: number;

  constructor(pos: p5.Vector, dir: p5.Vector, fov: number, aspectRatio: number) {
    Object.assign(this, { pos, dir, fov, aspectRatio });
  }
}

export function perspectiveProjection(vertex: p5.Vector, camera: Camera, screenWidth: number, screenHeight: number): p5.Vector {
  // *** ONLY WORKS WITH FRON-FACING CAMERA AT (0, 0, x) *** //
  if (vertex.z < camera.pos.z) {
    return createVector(
      vertex.x / vertex.x * screenWidth + (screenWidth / 2),
      -(vertex.y / vertex.y * screenHeight) + (screenHeight / 2),
    );
  }
  // *** ONLY WORKS WITH FRON-FACING CAMERA AT (0, 0, x) *** //

  // Get the values of the triangle created by the camera, the
  // camera's direction vector, and the position of the vertex
  const hyp = p5.Vector.sub(vertex, camera.pos);
  const angle = camera.dir.angleBetween(hyp);
  const adj = hyp.mag() * cos(angle);

  // Now get information about the screen size relative to
  // vertex's distance from the camera
  const midToCorner = adj * tan(camera.fov);

  // IMPORTANT: This part doesn't consider rotation, and therefore
  // only works with a camera direction of (0, 0, 1) - position can change
  const dir = camera.dir.copy();
  dir.normalize();
  dir.mult(adj);

  const vPos = createVector(
    vertex.x - camera.pos.x + dir.x,
    vertex.y - camera.pos.y + dir.y,
  );

  const screenDiagonal = sqrt(screenWidth*screenWidth + screenHeight*screenHeight);
  const scale = (screenDiagonal / 2) / midToCorner;

  vPos.mult(scale); // Scale from world size to screen size
  vPos.add(createVector(screenWidth / 2, screenHeight / 2)); // Move origin to corner
  vPos.y = screenHeight - vPos.y; // Invert Y to match screen coord system

  return vPos; // HOLY CRAP, THAT'S IT! 3D point projected onto 2D screen!
}

// Determines if a triangle (arrow of 3 vectors) is facing the camera or away
export function isFacingCamera(tri: p5.Vector[]): boolean {
  const a = createVector(tri[0].x - tri[1].x, tri[0].y - tri[1].y, 0);
  const b = createVector(tri[2].x - tri[1].x, tri[2].y - tri[1].y, 0);

  return a.cross(b).z > 0;
}

export function getSurfaceNormal(verts: p5.Vector[]): p5.Vector {
  const a = p5.Vector.sub(verts[0], verts[1]);
  const b = p5.Vector.sub(verts[2], verts[1]);

  return b.cross(a);
}
