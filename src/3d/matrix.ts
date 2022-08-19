export default class Matrix { // eslint-disable-line no-unused-vars
  static createTranslation(v: p5.Vector): Matrix;
  static createTranslation(x: number, y: number, z: number): Matrix;
  static createTranslation(arg0: p5.Vector | number, y?: number, z?: number): Matrix {
    let v: p5.Vector;
    if (typeof arg0 === 'number') {
      v = createVector(arg0, y, z);
    } else {
      v = arg0;
    }

    const matrix = new Matrix();

    matrix.m[0][3] = v.x;
    matrix.m[1][3] = v.y;
    matrix.m[2][3] = v.z;

    return matrix;
  }

  static createScale(s: number): Matrix;
  static createScale(sx: number, sy: number, sz: number): Matrix;
  static createScale(sx: number, sy?: number, sz?: number): Matrix {
    const matrix = new Matrix();

    matrix.m[0][0] = sx;
    matrix.m[1][1] = sy ?? sx;
    matrix.m[2][2] = sz ?? sx;

    return matrix;
  }

  static createRotationX(rad: number): Matrix {
    const matrix = new Matrix();

    matrix.m[1][1] = cos(rad);
    matrix.m[1][2] = -sin(rad);
    matrix.m[2][1] = sin(rad);
    matrix.m[2][2] = cos(rad);

    return matrix;
  }

  static createRotationY(rad: number): Matrix {
    const matrix = new Matrix();

    matrix.m[0][0] = cos(rad);
    matrix.m[0][2] = sin(rad);
    matrix.m[2][0] = -sin(rad);
    matrix.m[2][2] = cos(rad);

    return matrix;
  }

  static createRotationZ(rad: number): Matrix {
    const matrix = new Matrix();

    matrix.m[0][0] = cos(rad);
    matrix.m[0][1] = -sin(rad);
    matrix.m[1][0] = sin(rad);
    matrix.m[1][1] = cos(rad);

    return matrix;
  }

  static mult(...args: Matrix[]): Matrix {
    return args.slice(1).reduce((a, b) => a.mult(b), new Matrix(args[0]));
  }

  m = new Array(4).fill(undefined).map(() => new Array(4).fill(0));

  constructor();
  constructor(toCopy: Matrix);
  constructor(toCopy?: Matrix) {
    if (toCopy !== undefined) {
      this.copy(toCopy);
    } else {
      this.identity();
    }
  }

  identity(): void {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        this.m[r][c] = (r === c ? 1 : 0);
      }
    }
  }

  copy(m2: Matrix): void {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        this.m[r][c] = m2.m[r][c];
      }
    }
  }

  mult(m2: Matrix): Matrix {
    const { m } = this;

    const a = new Array(4).fill(undefined).map((_, i) => [...this.m[i]]);
    const b = m2.m;

    m[0][0] = a[0][0]*b[0][0] + a[0][1]*b[1][0] + a[0][2]*b[2][0] + a[0][3]*b[3][0];
    m[1][0] = a[1][0]*b[0][0] + a[1][1]*b[1][0] + a[1][2]*b[2][0] + a[1][3]*b[3][0];
    m[2][0] = a[2][0]*b[0][0] + a[2][1]*b[1][0] + a[2][2]*b[2][0] + a[2][3]*b[3][0];
    m[3][0] = a[3][0]*b[0][0] + a[3][1]*b[1][0] + a[3][2]*b[2][0] + a[3][3]*b[3][0];

    m[0][1] = a[0][0]*b[0][1] + a[0][1]*b[1][1] + a[0][2]*b[2][1] + a[0][3]*b[3][1];
    m[1][1] = a[1][0]*b[0][1] + a[1][1]*b[1][1] + a[1][2]*b[2][1] + a[1][3]*b[3][1];
    m[2][1] = a[2][0]*b[0][1] + a[2][1]*b[1][1] + a[2][2]*b[2][1] + a[2][3]*b[3][1];
    m[3][1] = a[3][0]*b[0][1] + a[3][1]*b[1][1] + a[3][2]*b[2][1] + a[3][3]*b[3][1];

    m[0][2] = a[0][0]*b[0][2] + a[0][1]*b[1][2] + a[0][2]*b[2][2] + a[0][3]*b[3][2];
    m[1][2] = a[1][0]*b[0][2] + a[1][1]*b[1][2] + a[1][2]*b[2][2] + a[1][3]*b[3][2];
    m[2][2] = a[2][0]*b[0][2] + a[2][1]*b[1][2] + a[2][2]*b[2][2] + a[2][3]*b[3][2];
    m[3][2] = a[3][0]*b[0][2] + a[3][1]*b[1][2] + a[3][2]*b[2][2] + a[3][3]*b[3][2];

    m[0][3] = a[0][0]*b[0][3] + a[0][1]*b[1][3] + a[0][2]*b[2][3] + a[0][3]*b[3][3];
    m[1][3] = a[1][0]*b[0][3] + a[1][1]*b[1][3] + a[1][2]*b[2][3] + a[1][3]*b[3][3];
    m[2][3] = a[2][0]*b[0][3] + a[2][1]*b[1][3] + a[2][2]*b[2][3] + a[2][3]*b[3][3];
    m[3][3] = a[3][0]*b[0][3] + a[3][1]*b[1][3] + a[3][2]*b[2][3] + a[3][3]*b[3][3];

    return this;
  }

  multVec(v: p5.Vector): p5.Vector {
    const { m } = this;

    return createVector(
      m[0][0]*v.x + m[0][1]*v.y + m[0][2]*v.z + m[0][3],
      m[1][0]*v.x + m[1][1]*v.y + m[1][2]*v.z + m[1][3],
      m[2][0]*v.x + m[2][1]*v.y + m[2][2]*v.z + m[2][3],
    );
  }
}
