import Mesh from './mesh.js';
export function loadMesh(name, col, onComplete) {
    loadStrings(`assets/models/${name}.obj`, (result) => {
        const mesh = new Mesh(col);
        result.forEach(line => {
            if (line.length === 0) {
                return;
            }
            const parts = line.trim().split(/\s+/);
            switch (parts[0]) {
                case '#':
                case 'g':
                    break;
                case 'v':
                    mesh.vertexList.push(createVector(...parts.slice(1).map(Number)));
                    break;
                case 'f':
                    mesh.polygonList.push(parts.slice(1).map(i => Number(i) - 1));
                    break;
            }
        });
        onComplete(mesh);
    });
}
//# sourceMappingURL=mesh-loader.js.map