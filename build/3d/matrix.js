export default class Matrix {
    constructor(toCopy) {
        this.m = new Array(4).fill(undefined).map(() => new Array(4).fill(0));
        if (toCopy !== undefined) {
            this.copy(toCopy);
        }
        else {
            this.identity();
        }
    }
    static createTranslation(v) {
        const matrix = new Matrix();
        matrix.m[0][3] = v.x;
        matrix.m[1][3] = v.y;
        matrix.m[2][3] = v.z;
        return matrix;
    }
    static createScale(sx, sy, sz) {
        const matrix = new Matrix();
        matrix.m[0][0] = sx;
        matrix.m[1][1] = sy ?? sx;
        matrix.m[2][2] = sz ?? sx;
        return matrix;
    }
    static createRotationX(rad) {
        const matrix = new Matrix();
        matrix.m[1][1] = cos(rad);
        matrix.m[1][2] = -sin(rad);
        matrix.m[2][1] = sin(rad);
        matrix.m[2][2] = cos(rad);
        return matrix;
    }
    static createRotationY(rad) {
        const matrix = new Matrix();
        matrix.m[0][0] = cos(rad);
        matrix.m[0][2] = sin(rad);
        matrix.m[2][0] = -sin(rad);
        matrix.m[2][2] = cos(rad);
        return matrix;
    }
    static createRotationZ(rad) {
        const matrix = new Matrix();
        matrix.m[0][0] = cos(rad);
        matrix.m[0][1] = -sin(rad);
        matrix.m[1][0] = sin(rad);
        matrix.m[1][1] = cos(rad);
        return matrix;
    }
    static mult(m1, m2) {
        const result = new Matrix(m1);
        return result.mult(m2);
    }
    identity() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                this.m[r][c] = (r === c ? 1 : 0);
            }
        }
    }
    copy(m2) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                this.m[r][c] = m2[r][c];
            }
        }
    }
    mult(m2) {
        const { m } = this;
        const a = new Array(4).fill(undefined).map((_, i) => [...this.m[i]]);
        const b = m2.m;
        m[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0] + a[0][3] * b[3][0];
        m[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0] + a[1][3] * b[3][0];
        m[2][0] = a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0] + a[2][3] * b[3][0];
        m[3][0] = a[3][0] * b[0][0] + a[3][1] * b[1][0] + a[3][2] * b[2][0] + a[3][3] * b[3][0];
        m[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1] + a[0][3] * b[3][1];
        m[1][1] = a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1] + a[1][3] * b[3][1];
        m[2][1] = a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1] + a[2][3] * b[3][1];
        m[3][1] = a[3][0] * b[0][1] + a[3][1] * b[1][1] + a[3][2] * b[2][1] + a[3][3] * b[3][1];
        m[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2] + a[0][3] * b[3][2];
        m[1][2] = a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2] + a[1][3] * b[3][2];
        m[2][2] = a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2] + a[2][3] * b[3][2];
        m[3][2] = a[3][0] * b[0][2] + a[3][1] * b[1][2] + a[3][2] * b[2][2] + a[3][3] * b[3][2];
        m[0][3] = a[0][0] * b[0][3] + a[0][1] * b[1][3] + a[0][2] * b[2][3] + a[0][3] * b[3][3];
        m[1][3] = a[1][0] * b[0][3] + a[1][1] * b[1][3] + a[1][2] * b[2][3] + a[1][3] * b[3][3];
        m[2][3] = a[2][0] * b[0][3] + a[2][1] * b[1][3] + a[2][2] * b[2][3] + a[2][3] * b[3][3];
        m[3][3] = a[3][0] * b[0][3] + a[3][1] * b[1][3] + a[3][2] * b[2][3] + a[3][3] * b[3][3];
        return this;
    }
    multVec(v) {
        const { m } = this;
        return createVector(m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3], m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3], m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3]);
    }
}
//# sourceMappingURL=matrix.js.map