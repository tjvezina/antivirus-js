import Mesh from './mesh.js';

export function loadMesh(name: string, col: p5.Color, onComplete: (mesh: Mesh) => void): void {
  loadStrings(`assets/models/${name}.obj`, (result: string[]) => {
    const mesh = new Mesh(col);

    result.forEach(line => {
      if (line.length === 0) {
        return;
      }

      const parts = line.trim().split(/\s+/);

      switch (parts[0]) {
        case '#': // comment
        case 'g': // vertex group (not needed)
          break;
        case 'v': // vertex
          mesh.vertexList.push(createVector(...parts.slice(1).map(Number)));
          break;
        case 'f': // face
          mesh.polygonList.push(parts.slice(1).map(i => Number(i) - 1)); // OBJ vertex indicies are 1-based
          break;
      }
    });

    onComplete(mesh);
  });
}
