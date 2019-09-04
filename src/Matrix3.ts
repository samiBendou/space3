import {mag, mag2} from "./Algebra";
import {epsilon, epsilon2} from "./common";
import Object3 from "./int/Object3";
import Object9 from "./int/Object9";
import Vector from "./int/Vector";
import Matrix from "./int/Matrix";
import Vector3 from "./Vector3";

/**

 * ## Brief
 * [[Matrix3]] represents 3x3 dense matrices as a set of numerical components.
 * It implement [[Matrix]] interface and therefore [[Vector]] interface.
 *
 * ### Main features
 * - **1D-Array like** component accessors `m[2]`
 * - **Handy component accessors**  `xx`, `yz`, ...
 * - **Interface with [[Vector3]]** `x`, `y`, `z`, ...
 * - **Algebra** of matrices and vectors, `add`, `prodv`, `pow`, ...
 * - **Rotation** matrices, `rot`, `rotX`, ...
 * - **Many generators** `diag`, `sym`, `scalar`, ...
 *
 * Not all the operations have been detailed here
 * to learn more about provided operations see [[Matrix]].
 *
 * ## Getting Started
 *
 * A matrix is 1D-array of number stored in a column-major form, each components of the column are ordered
 * from up to down.
 *
 * ### Components accessors
 * In order to access the components of the matrix use the syntax `m.ij` where :
 * - `i` can be `x`, `y` or `z` and denotes the row index of the matrix in a descending order
 * - `j` can be `x`, `y` or `z` and denotes the column index of the matrix in a left-to-right order
 *
 * **Note** `m.ij` is equal to `m[3 * j + i]` if we consider `x == 0`, `y == 1` and `z == 2`.
 *
 * You can represent the matrix with theses conventions as :
 *
 * ![Matrix3 shape](media://matrix3_shape.png)
 *
 * #### Example
 * ```js
 * m.xx = 2; // m[0] = 2
 * m.yz = 5; // m[7] = 5
 * ```
 *
 * ### Interface with Vector3
 * [[Matrix3]] provides an interface with [[Vector3]] by implementing [[Object3]] interface.
 * It allows to construct vectors from rows and columns of the matrix.
 * Reciprocally you can affect rows and columns of the matrix with a `Vector3`.
 *
 * #### Example
 * ```js
 * m.x = new Vector3(2, 0, 2);
 * u = m.y;
 * m.xyz = [u, v, w];
 * ```
 *
 * For more details see [[Object3]].
 *
 * ### Rotation matrix
 * Generate rotation matrix using static methods.
 *
 * #### Example
 * ```js
 * // rotation matrix around x axis with angle +pi/4
 * m = Matrix3.rotX(Math.PI / 4);
 *
 * // rotation matrix around u axis with angle +pi/4
 * n = Matrix3.rot(u, Math.PI / 4);
 *
 * // elliptic rotation matrix around z axis with angle +pi/4
 * q = Matrix3.rotZ(Math.PI / 4, (x) => 5 * Math.cos(x), Math.sin);
 * ```
 *
 * If you want to get deep into rotation features see [[Object3]].
 *
 * You can also directly assign an existent matrix to a rotation matrix.
 *
 * #### Example
 * ```js
 * m.rotX(Math.PI / 3);
 * ```
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */
export default class Matrix3 extends Float64Array implements Matrix, Object3, Object9 {
    dim: Readonly<number> = 9;

    /** first row as vector **/
    get x(): Vector3 {
        return new Vector3(this[0], this[3], this[6]);
    };

    set x(newX) {
        this[0] = newX[0];
        this[3] = newX[1];
        this[6] = newX[2];
    }

    /** second row as vector **/
    get y(): Vector3 {
        return new Vector3(this[1], this[4], this[7]);
    };

    set y(newY) {
        this[1] = newY[0];
        this[4] = newY[1];
        this[7] = newY[2];
    }

    /** third row as vector **/
    get z(): Vector3 {
        return new Vector3(this[2], this[5], this[8]);
    };

    set z(newZ) {
        this[2] = newZ[0];
        this[5] = newZ[1];
        this[8] = newZ[2];
    }

    /** rows of the matrix as vectors */
    get xyz(): [Vector3, Vector3, Vector3] {
        return [
            new Vector3(this[0], this[3], this[6]),
            new Vector3(this[1], this[4], this[7]),
            new Vector3(this[2], this[5], this[8])
        ];
    }

    set xyz(rows) {
        this[0] = rows[0][0];
        this[1] = rows[1][0];
        this[2] = rows[2][0];
        this[3] = rows[0][1];
        this[4] = rows[1][1];
        this[5] = rows[2][1];
        this[6] = rows[0][2];
        this[7] = rows[1][2];
        this[8] = rows[2][2];
    }

    /** columns of the matrix as vectors */
    get xyzt(): [Vector3, Vector3, Vector3] {
        return [
            new Vector3(this[0], this[1], this[2]),
            new Vector3(this[3], this[4], this[5]),
            new Vector3(this[6], this[7], this[8])
        ];
    }

    set xyzt(cols) {
        this[0] = cols[0][0];
        this[1] = cols[0][1];
        this[2] = cols[0][2];
        this[3] = cols[1][0];
        this[4] = cols[1][1];
        this[5] = cols[1][2];
        this[6] = cols[2][0];
        this[7] = cols[2][1];
        this[8] = cols[2][2];
    }

    /** value at row 0, column 0 */
    get xx(): number {
        return this[0];
    }

    set xx(newXx) {
        this[0] = newXx;
    }

    /** value at row 1, column 0 */
    get yx(): number {
        return this[1];
    }

    set yx(newYx) {
        this[1] = newYx;
    }

    /** value at row 2, column 0 */
    get zx(): number {
        return this[2];
    }

    set zx(newZx) {
        this[2] = newZx;
    }

    /** value at row 0, column 1 */
    get xy(): number {
        return this[3];
    }

    set xy(newXy) {
        this[3] = newXy;
    }

    /** value at row 1, column 1 */
    get yy(): number {
        return this[4];
    }

    set yy(newYy) {
        this[4] = newYy;
    }

    /** value at row 2, column 1 */
    get zy(): number {
        return this[5];
    }

    set zy(newZy) {
        this[5] = newZy;
    }

    /** value at row 0, column 2 */
    get xz(): number {
        return this[6];
    }

    set xz(newXz) {
        this[6] = newXz;
    }

    /** value at row 1, column 2 */
    get yz(): number {
        return this[7];
    }

    set yz(newYz) {
        this[7] = newYz;
    }

    /** value at row 2, column 2 */
    get zz(): number {
        return this[8];
    }

    set zz(newZz) {
        this[8] = newZz;
    }

    get mag(): number {
        return mag(this);
    }

    get mag2(): number {
        return mag2(this);
    }

    get cols(): number[][] {
        return [
            [this[0], this[1], this[2]],
            [this[3], this[4], this[5]],
            [this[6], this[7], this[8]],
        ]
    }

    set cols(cols) {
        this[0] = cols[0][0];
        this[1] = cols[0][1];
        this[2] = cols[0][2];
        this[3] = cols[1][0];
        this[4] = cols[1][1];
        this[5] = cols[1][2];
        this[6] = cols[2][0];
        this[7] = cols[2][1];
        this[8] = cols[2][2];
    }

    get rows(): number[][] {
        return [
            [this[0], this[3], this[6]],
            [this[1], this[4], this[7]],
            [this[2], this[5], this[8]],
        ]
    }

    set rows(rows) {
        this[0] = rows[0][0];
        this[1] = rows[1][0];
        this[2] = rows[2][0];
        this[3] = rows[0][1];
        this[4] = rows[1][1];
        this[5] = rows[2][1];
        this[6] = rows[0][2];
        this[7] = rows[1][2];
        this[8] = rows[2][2];
    }

    get trace(): number {
        return this[0] + this[4] + this[8];
    }

    get det(): number {
        const mxx = this[0],
            myx = this[1],
            mzx = this[2],
            mxy = this[3],
            myy = this[4],
            mzy = this[5],
            mxz = this[6],
            myz = this[7],
            mzz = this[8];
        return mxx * (mzz * myy - mzy * myz) + myx * (-mzz * mxy + mzy * mxz) + mzx * (myz * mxy - myy * mxz);
    }

    /**
     * @brief constructs a matrix by explicitly giving components ordered by rows from left to right
     * @details If you don't specify components then the underlying array is initialized with the default values for `Float64Array`.
     */
    constructor(xx?: number, xy?: number, xz?: number,
                yx?: number, yy?: number, yz?: number,
                zx?: number, zy?: number, zz?: number) {
        super(9);

        if (xx === undefined)
            return;

        this[0] = xx;
        this[1] = yx;
        this[2] = zx;
        this[3] = xy;
        this[4] = yy;
        this[5] = zy;
        this[6] = xz;
        this[7] = yz;
        this[8] = zz;
    }

    string(): string {
        return `(${this[0]}, ${this[3]}, ${this[6]})\n` +
            `(${this[1]}, ${this[4]}, ${this[7]})\n` +
            `(${this[2]}, ${this[5]}, ${this[8]})`;
    }

    array(): number[] {
        return [...this];
    }

    /** explicitly sets all the component of the matrix ordered as rows */
    assign(xx: number, xy: number, xz: number,
           yx: number, yy: number, yz: number,
           zx: number, zy: number, zz: number): this {
        this[0] = xx;
        this[1] = yx;
        this[2] = zx;
        this[3] = xy;
        this[4] = yy;
        this[5] = zy;
        this[6] = xz;
        this[7] = yz;
        this[8] = zz;
        return this;
    }

    copy(m: Vector): this {
        this[0] = m[0];
        this[1] = m[1];
        this[2] = m[2];
        this[3] = m[3];
        this[4] = m[4];
        this[5] = m[5];
        this[6] = m[6];
        this[7] = m[7];
        this[8] = m[8];
        return this;
    }

    clone(): Matrix3 {
        return new Matrix3(
            this[0],
            this[3],
            this[6],
            this[1],
            this[4],
            this[7],
            this[2],
            this[5],
            this[8]
        );
    }

    reset0(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        return this;
    }

    /** sets matrix to identity */
    reset1(): this {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 1;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 1;
        return this;
    }

    random(): this {
        this[0] = Math.random();
        this[1] = Math.random();
        this[2] = Math.random();
        this[3] = Math.random();
        this[4] = Math.random();
        this[5] = Math.random();
        this[6] = Math.random();
        this[7] = Math.random();
        this[8] = Math.random();
        return this;
    }

    floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        this[3] = Math.floor(this[3]);
        this[4] = Math.floor(this[4]);
        this[5] = Math.floor(this[5]);
        this[6] = Math.floor(this[6]);
        this[7] = Math.floor(this[7]);
        this[8] = Math.floor(this[8]);
        return this;
    }

    floorc(): Matrix3 {
        return this.clone().floor();
    }

    ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        this[3] = Math.ceil(this[3]);
        this[4] = Math.ceil(this[4]);
        this[5] = Math.ceil(this[5]);
        this[6] = Math.ceil(this[6]);
        this[7] = Math.ceil(this[7]);
        this[8] = Math.ceil(this[8]);
        return this;
    }

    ceilc(): Matrix3 {
        return this.clone().ceil();
    }

    round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        this[2] = Math.round(this[2]);
        this[3] = Math.round(this[3]);
        this[4] = Math.round(this[4]);
        this[5] = Math.round(this[5]);
        this[6] = Math.round(this[6]);
        this[7] = Math.round(this[7]);
        this[8] = Math.round(this[8]);
        return this;
    }

    roundc(): Matrix3 {
        return this.clone().round();
    }

    abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        this[3] = Math.abs(this[3]);
        this[4] = Math.abs(this[4]);
        this[5] = Math.abs(this[5]);
        this[6] = Math.abs(this[6]);
        this[7] = Math.abs(this[7]);
        this[8] = Math.abs(this[8]);
        return this;
    }

    absc(): Matrix3 {
        return this.clone().abs();
    }

    trunc(decimals: number): this {
        const pow10 = Math.pow(10, decimals);
        this[0] = Math.round(this[0] * pow10) / pow10;
        this[1] = Math.round(this[1] * pow10) / pow10;
        this[2] = Math.round(this[2] * pow10) / pow10;
        this[3] = Math.round(this[3] * pow10) / pow10;
        this[4] = Math.round(this[4] * pow10) / pow10;
        this[5] = Math.round(this[5] * pow10) / pow10;
        this[6] = Math.round(this[6] * pow10) / pow10;
        this[7] = Math.round(this[7] * pow10) / pow10;
        this[8] = Math.round(this[8] * pow10) / pow10;
        return undefined;
    }

    truncc(decimals: number): Matrix3 {
        return this.clone().trunc(decimals);
    }

    max(m: Vector): this {
        this[0] = Math.max(this[0], m[0]);
        this[1] = Math.max(this[0], m[1]);
        this[2] = Math.max(this[0], m[2]);
        this[3] = Math.max(this[0], m[3]);
        this[4] = Math.max(this[0], m[4]);
        this[5] = Math.max(this[0], m[5]);
        this[6] = Math.max(this[0], m[6]);
        this[7] = Math.max(this[0], m[7]);
        this[8] = Math.max(this[0], m[8]);
        return this;
    }

    maxc(m: Vector): Matrix3 {
        return this.clone().max(m);
    }

    min(m: Vector): this {
        this[0] = Math.min(this[0], m[0]);
        this[1] = Math.min(this[0], m[1]);
        this[2] = Math.min(this[0], m[2]);
        this[3] = Math.min(this[0], m[3]);
        this[4] = Math.min(this[0], m[4]);
        this[5] = Math.min(this[0], m[5]);
        this[6] = Math.min(this[0], m[6]);
        this[7] = Math.min(this[0], m[7]);
        this[8] = Math.min(this[0], m[8]);
        return this;
    }

    minc(m: Vector): Matrix3 {
        return this.clone().min(m);
    }

    fill(s: number): this {
        this[0] = s;
        this[1] = s;
        this[2] = s;
        this[3] = s;
        this[4] = s;
        this[5] = s;
        this[6] = s;
        this[7] = s;
        this[8] = s;
        return this;
    }

    fillc(s: number): Matrix3 {
        return this.clone().fill(s);
    }

    norm(): this {
        const s = mag(this);
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        this[3] /= s;
        this[4] /= s;
        this[5] /= s;
        this[6] /= s;
        this[7] /= s;
        this[8] /= s;
        return this;
    }

    normc(): Matrix3 {
        return this.clone().norm();
    }

    add(m: Vector): this {
        this[0] += m[0];
        this[1] += m[1];
        this[2] += m[2];
        this[3] += m[3];
        this[4] += m[4];
        this[5] += m[5];
        this[6] += m[6];
        this[7] += m[7];
        this[8] += m[8];
        return this;
    }

    addc(m: Vector): Matrix3 {
        return this.clone().add(m);
    }

    sub(m: Vector): this {
        this[0] -= m[0];
        this[1] -= m[1];
        this[2] -= m[2];
        this[3] -= m[3];
        this[4] -= m[4];
        this[5] -= m[5];
        this[6] -= m[6];
        this[7] -= m[7];
        this[8] -= m[8];
        return this;
    }

    subc(m: Vector): Matrix3 {
        return this.clone().sub(m);
    }

    neg(): this {
        this[0] *= -1;
        this[1] *= -1;
        this[2] *= -1;
        this[3] *= -1;
        this[4] *= -1;
        this[5] *= -1;
        this[6] *= -1;
        this[7] *= -1;
        this[8] *= -1;
        return this;
    }

    negc(): Matrix3 {
        return this.clone().neg();
    }

    mul(s: number): this {
        this[0] *= s;
        this[1] *= s;
        this[2] *= s;
        this[3] *= s;
        this[4] *= s;
        this[5] *= s;
        this[6] *= s;
        this[7] *= s;
        this[8] *= s;
        return this;
    }

    mulc(s: number): Matrix3 {
        return this.clone().mul(s);
    }

    div(s: number): this {
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        this[3] /= s;
        this[4] /= s;
        this[5] /= s;
        this[6] /= s;
        this[7] /= s;
        this[8] /= s;
        return this;
    }

    divc(s: number): Matrix3 {
        return this.clone().div(s);
    }

    comb(s: number, m: Vector): this {
        this[0] += s * m[0];
        this[1] += s * m[1];
        this[2] += s * m[2];
        this[3] += s * m[3];
        this[4] += s * m[4];
        this[5] += s * m[5];
        this[6] += s * m[6];
        this[7] += s * m[7];
        this[8] += s * m[8];
        return this;
    }

    combc(s: number, m: Vector): Matrix3 {
        return this.clone().comb(s, m);
    }

    lerp(m: Vector, t: number): this {
        this[0] += (m[0] - this[0]) * t;
        this[1] += (m[1] - this[1]) * t;
        this[2] += (m[2] - this[2]) * t;
        this[3] += (m[3] - this[3]) * t;
        this[4] += (m[4] - this[4]) * t;
        this[5] += (m[5] - this[5]) * t;
        this[6] += (m[6] - this[6]) * t;
        this[7] += (m[7] - this[7]) * t;
        this[8] += (m[8] - this[8]) * t;
        return this;
    }

    lerpc(m: Vector, t: number): Matrix3 {
        return this.clone().lerp(m, t);
    }

    herp(m: Vector, m1: Vector, m2: Vector, s: number): this {
        const s2 = s * s,
            t0 = s2 * (2 * s - 3) + 1,
            t1 = s2 * (s - 2) + s,
            t2 = s2 * (s - 1),
            t3 = s2 * (3 - 2 * s);
        this[0] = this[0] * t0 + m1[0] * t1 + m2[0] * t2 + m[0] * t3;
        this[1] = this[1] * t0 + m1[1] * t1 + m2[1] * t2 + m[1] * t3;
        this[2] = this[2] * t0 + m1[2] * t1 + m2[2] * t2 + m[2] * t3;
        this[3] = this[3] * t0 + m1[3] * t1 + m2[3] * t2 + m[3] * t3;
        this[4] = this[4] * t0 + m1[4] * t1 + m2[4] * t2 + m[4] * t3;
        this[5] = this[5] * t0 + m1[5] * t1 + m2[5] * t2 + m[5] * t3;
        this[6] = this[6] * t0 + m1[6] * t1 + m2[6] * t2 + m[6] * t3;
        this[7] = this[7] * t0 + m1[7] * t1 + m2[7] * t2 + m[7] * t3;
        this[8] = this[8] * t0 + m1[8] * t1 + m2[8] * t2 + m[8] * t3;
        return this;
    }

    herpc(m: Vector, m1: Vector, m2: Vector, s: number): Matrix3 {
        return this.clone().berp(m, m1, m2, s);
    }

    berp(m: Vector, m1: Vector, m2: Vector, s: number): this {
        const s2 = s * s,
            inv = 1 - s,
            inv2 = inv * inv,
            t0 = inv2 * inv,
            t1 = 3 * s * inv2,
            t2 = 3 * s2 * inv,
            t3 = s2 * s;
        this[0] = this[0] * t0 + m1[0] * t1 + m2[0] * t2 + m[0] * t3;
        this[1] = this[1] * t0 + m1[1] * t1 + m2[1] * t2 + m[1] * t3;
        this[2] = this[2] * t0 + m1[2] * t1 + m2[2] * t2 + m[2] * t3;
        this[3] = this[3] * t0 + m1[3] * t1 + m2[3] * t2 + m[3] * t3;
        this[4] = this[4] * t0 + m1[4] * t1 + m2[4] * t2 + m[4] * t3;
        this[5] = this[5] * t0 + m1[5] * t1 + m2[5] * t2 + m[5] * t3;
        this[6] = this[6] * t0 + m1[6] * t1 + m2[6] * t2 + m[6] * t3;
        this[7] = this[7] * t0 + m1[7] * t1 + m2[7] * t2 + m[7] * t3;
        this[8] = this[8] * t0 + m1[8] * t1 + m2[8] * t2 + m[8] * t3;
        return this;
    }

    berpc(m: Vector, m1: Vector, m2: Vector, s: number): Matrix3 {
        return this.clone().berp(m, m1, m1, s);
    }

    der(ds: number, m: Vector): this {
        this[0] = (this[0] - m[0]) / ds;
        this[1] = (this[1] - m[1]) / ds;
        this[2] = (this[2] - m[2]) / ds;
        this[3] = (this[3] - m[3]) / ds;
        this[4] = (this[4] - m[4]) / ds;
        this[5] = (this[5] - m[5]) / ds;
        this[6] = (this[6] - m[6]) / ds;
        this[7] = (this[7] - m[7]) / ds;
        this[8] = (this[8] - m[8]) / ds;
        return undefined;
    }

    derc(ds: number, m: Vector): Matrix3 {
        return this.clone().der(ds, m);
    }

    prod(m: Vector): this {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        const mxx = m[0],
            myx = m[1],
            mzx = m[2],
            mxy = m[3],
            myy = m[4],
            mzy = m[5],
            mxz = m[6],
            myz = m[7],
            mzz = m[8];
        this[0] = mxx * xx + myx * xy + mzx * xz;
        this[1] = mxx * yx + myx * yy + mzx * yz;
        this[2] = mxx * zx + myx * zy + mzx * zz;
        this[3] = mxy * xx + myy * xy + mzy * xz;
        this[4] = mxy * yx + myy * yy + mzy * yz;
        this[5] = mxy * zx + myy * zy + mzy * zz;
        this[6] = mxz * xx + myz * xy + mzz * xz;
        this[7] = mxz * yx + myz * yy + mzz * yz;
        this[8] = mxz * zx + myz * zy + mzz * zz;
        return this;
    }

    prodc(m: Vector): Matrix3 {
        return this.clone().prod(m);
    }

    inv(): this {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        const dyx = zz * yy - zy * yz;
        const dyy = -zz * xy + zy * xz;
        const dyz = yz * xy - yy * xz;

        let det = xx * dyx + yx * dyy + zx * dyz;

        if (!det) {
            return undefined;
        }

        det = 1.0 / det;
        this[0] = dyx * det;
        this[1] = (-zz * yx + zx * yz) * det;
        this[2] = (zy * yx - zx * yy) * det;
        this[3] = dyy * det;
        this[4] = (zz * xx - zx * xz) * det;
        this[5] = (-zy * xx + zx * xy) * det;
        this[6] = dyz * det;
        this[7] = (-yz * xx + yx * xz) * det;
        this[8] = (yy * xx - yx * xy) * det;
        return this;
    }

    invc(): Matrix3 {
        return this.clone().inv();
    }

    dot(m: Vector): number {
        const sxx = this[0] * m[0],
            syx = this[1] * m[1],
            szx = this[2] * m[2],
            sxy = this[3] * m[3],
            syy = this[4] * m[4],
            szy = this[5] * m[5],
            sxz = this[6] * m[6],
            syz = this[7] * m[7],
            szz = this[8] * m[8];
        return sxx + syx + szx + sxy + syy + szy + sxz + syz + szz;
    }

    dist(m: Vector): number {
        return Math.sqrt(this.dist2(m));
    }

    dist1(m: Vector): number {
        const dxx = Math.abs(this[0] - m[0]),
            dyx = Math.abs(this[1] - m[1]),
            dzx = Math.abs(this[2] - m[2]),
            dxy = Math.abs(this[3] - m[3]),
            dyy = Math.abs(this[4] - m[4]),
            dzy = Math.abs(this[5] - m[5]),
            dxz = Math.abs(this[6] - m[6]),
            dyz = Math.abs(this[7] - m[7]),
            dzz = Math.abs(this[8] - m[8]);
        return dxx + dyx + dzx + dxy + dyy + dzy + dxz + dyz + dzz;
    }

    dist2(m: Vector): number {
        const dxx = this[0] - m[0],
            dyx = this[1] - m[1],
            dzx = this[2] - m[2],
            dxy = this[3] - m[3],
            dyy = this[4] - m[4],
            dzy = this[5] - m[5],
            dxz = this[6] - m[6],
            dyz = this[7] - m[7],
            dzz = this[8] - m[8];
        const dxx2 = dxx * dxx,
            dyx2 = dyx * dyx,
            dzx2 = dzx * dzx,
            dxy2 = dxy * dxy,
            dyy2 = dyy * dyy,
            dzy2 = dzy * dzy,
            dxz2 = dxz * dxz,
            dyz2 = dyz * dyz,
            dzz2 = dzz * dzz;
        return dxx2 + dyx2 + dzx2 + dxy2 + dyy2 + dzy2 + dxz2 + dyz2 + dzz2;
    }

    exact(m: Vector): boolean {
        return this[0] === m[0] && this[3] === m[3] && this[6] === m[6] &&
            this[1] === m[1] && this[4] === m[4] && this[7] === m[7] &&
            this[2] === m[2] && this[5] === m[5] && this[8] === m[8];
    }

    equal1(m: Vector): boolean {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        const mxx = m[0],
            myx = m[1],
            mzx = m[2],
            mxy = m[3],
            myy = m[4],
            mzy = m[5],
            mxz = m[6],
            myz = m[7],
            mzz = m[8];

        // noinspection JSSuspiciousNameCombination
        return Math.abs(xx - mxx) <= epsilon && Math.abs(yx - myx) <= epsilon && Math.abs(zx - mzx) <= epsilon &&
            Math.abs(xy - mxy) <= epsilon && Math.abs(yy - myy) <= epsilon && Math.abs(zy - mzy) <= epsilon &&
            Math.abs(xz - mxz) <= epsilon && Math.abs(yz - myz) <= epsilon && Math.abs(zz - mzz) <= epsilon;
    }

    equal2(m: Vector): boolean {
        return this.dist2(m) < epsilon2;
    }

    nil(): boolean {
        return this[0] === 0 && this[3] === 0 && this[6] === 0 &&
            this[1] === 0 && this[4] === 0 && this[7] === 0 &&
            this[2] === 0 && this[5] === 0 && this[8] === 0;
    }

    zero1(): boolean {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        return xx <= epsilon * Math.max(1.0, xx) && yx <= epsilon * Math.max(1.0, yx) && zx <= epsilon * Math.max(1.0, zx) &&
            xx <= epsilon * Math.max(1.0, xy) && yx <= epsilon * Math.max(1.0, yy) && zx <= epsilon * Math.max(1.0, zy) &&
            xx <= epsilon * Math.max(1.0, xz) && yx <= epsilon * Math.max(1.0, yz) && zx <= epsilon * Math.max(1.0, zz);
    }

    zero2(): boolean {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];

        return xx * xx + yx * yx + zx * zx + xy * xy + yy * yy + zy * zy + xz * xz + yz * yz + zz * zz < epsilon2;
    }

    row(i: number): number[] {
        return [this[i], this[3 + i], this[6 + i]];
    }

    col(j: number): number[] {
        let shift = 3 * j;
        return [this[shift], this[1 + shift], this[2 + shift]];
    }

    prodv(u: Vector3): Vector3 {
        let ux = u[0],
            uy = u[1],
            uz = u[2];
        u[0] = this[0] * ux + this[3] * uy + this[6] * uz;
        u[1] = this[1] * ux + this[4] * uy + this[7] * uz;
        u[2] = this[2] * ux + this[5] * uy + this[8] * uz;
        return u;
    }

    prodvc(u: Vector3): Vector3 {
        return this.prodv(u.clone());
    }

    trans(): this {
        const mxy = this[1],
            mxz = this[2],
            myz = this[5];
        this[1] = this[3];
        this[2] = this[6];
        this[3] = mxy;
        this[5] = this[7];
        this[6] = mxz;
        this[7] = myz;
        return this;
    }

    transc(): Matrix3 {
        return this.clone().trans();
    }

    private rpow(exp: number) {
        if (exp > 1) {
            const copy = this.clone();
            this.prod(copy);
            if (exp % 2 === 0) {
                this.rpow(exp / 2);
            } else if (exp % 2 === 1) {
                this.rpow((exp - 1) / 2);
                this.prod(copy);
            }
        }
    }

    pow(exp: number): this {
        if (exp < 0)
            this.inv();
        if (exp === 0)
            this.assign(1, 0, 0, 0, 1, 0, 0, 0, 1);
        this.rpow(Math.abs(exp));
        return this;
    }

    powc(exp: number): Matrix3 {
        return this.clone().pow(exp);
    }

    adj(): this {
        const xx = this[0],
            yx = this[1],
            zx = this[2],
            xy = this[3],
            yy = this[4],
            zy = this[5],
            xz = this[6],
            yz = this[7],
            zz = this[8];
        this[0] = yy * zz - zy * yz;
        this[1] = zx * yz - yx * zz;
        this[2] = yx * zy - zx * yy;
        this[3] = zy * xz - xy * zz;
        this[4] = xx * zz - zx * xz;
        this[5] = zx * xy - xx * zy;
        this[6] = xy * yz - yy * xz;
        this[7] = yx * xz - xx * yz;
        this[8] = xx * yy - yx * xy;
        return this;
    }

    adjc(): Matrix3 {
        return this.clone().adj();
    }

    frob(): number {
        return Math.sqrt(Math.pow(this[0], 2) + Math.pow(this[1], 2) + Math.pow(this[2], 2) +
            Math.pow(this[3], 2) + Math.pow(this[4], 2) + Math.pow(this[5], 2) +
            Math.pow(this[6], 2) + Math.pow(this[7], 2) + Math.pow(this[8], 2));
    }

    /** See [[Object3]] for more details */
    rotX(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta);
        this[0] = 1;
        this[3] = 0;
        this[6] = 0;
        this[1] = 0;
        this[4] = c;
        this[7] = -s;
        this[2] = 0;
        this[5] = s;
        this[8] = c;
        return this;
    }

    /** See [[Object3]] for more details */
    rotY(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta);
        this[0] = c;
        this[3] = 0;
        this[6] = s;
        this[1] = 0;
        this[4] = 1;
        this[7] = 0;
        this[2] = -s;
        this[5] = 0;
        this[8] = c;
        return this;
    }

    /** See [[Object3]] for more details */
    rotZ(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta);
        this[0] = c;
        this[3] = -s;
        this[6] = 0;
        this[1] = s;
        this[4] = c;
        this[7] = 0;
        this[2] = 0;
        this[5] = 0;
        this[8] = 1;
        return this;
    }

    /** See [[Object3]] for more details */
    rot(u: Vector, theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta), k = 1 - c;
        const ux = u[0],
            uy = u[1],
            uz = u[2];
        const kuxy = k * ux * uy,
            kuxz = k * ux * uz,
            kuyz = k * uy * uz;
        this[0] = k * ux * ux + c;
        this[3] = kuxy - uz * s;
        this[6] = kuxz + uy * s;
        this[1] = kuxy + uz * s;
        this[4] = k * uy * uy + c;
        this[7] = kuyz - ux * s;
        this[2] = kuxz - uy * s;
        this[5] = kuyz + ux * s;
        this[8] = k * uz * uz + c;
        return this;
    }

    static get dim(): number {
        return 9;
    }

    static get zeros(): Matrix3 {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    static get ones(): Matrix3 {
        return new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
    }

    /**
     * @brief identity matrix
     * @details Diagonal matrix filled with `1`.
     */
    static get eye(): Matrix3 {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * @brief scalar matrix
     * @details Diagonal matrix filled with a single value.
     * @param s scalar value
     */
    static scalar(s: number): Matrix3 {
        return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
    }

    /**
     * @brief diagonal matrix
     * @details Diagonal matrix filled with values.
     */
    static diag(xx: number, yy: number, zz: number): Matrix3 {
        return new Matrix3(xx, 0, 0, 0, yy, 0, 0, 0, zz);
    }

    /**
     * @brief symmetric matrix
     * @details Fill the matrix by giving values on diagonal and sub diagonals.
     */
    static sym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0): Matrix3 {
        return new Matrix3(xx, xy, xz, xy, yy, yz, xz, yz, zz);
    }

    /**
     * @brief antisymmetric matrix with non zero diagonal
     * @details Fill the matrix by giving values on diagonal and sub diagonals.
     */
    static asym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0): Matrix3 {
        return new Matrix3(xx, xy, xz, -xy, yy, yz, -xz, -yz, zz);
    }

    /**
     * @brief standard basis matrix
     * @details Matrix with `0` everywhere except in `i`, `j` position where there is a `1`.
     */
    static e(i: number, j: number): Matrix3 {
        const eij = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        eij[3 * j + i] = 1;
        return eij;
    }

    /** rotation matrix of axis `x`. See [[Object3]] for mor details. */
    static rotX(theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
        return new Matrix3().rotX(theta, cos, sin);
    }

    /** rotation matrix of axis `y`. See [[Object3]] for mor details. */
    static rotY(theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
        return new Matrix3().rotY(theta, cos, sin);
    }

    /** rotation matrix of axis `z`. See [[Object3]] for mor details. */
    static rotZ(theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
        return new Matrix3().rotZ(theta, cos, sin);
    }

    /** rotation matrix of axis `u`. See [[Object3]] for mor details. */
    static rot(u: Vector3, theta: number, cos = Math.cos, sin = Math.sin): Matrix3 {
        return new Matrix3().rot(u, theta, cos, sin);
    }

    /**
     * @brief affine transformation of the vector `m * v + u`
     * @details The result of the operation is stored on `v`.
     * @param m matrix of the transformation
     * @param u translation of the transformation
     * @param v vector parameter of the transformation
     * @returns reference to `v`
     */
    static affine(m: Vector, u: Vector3, v: Vector3): Vector3 {
        const vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = m[0] * vx + m[3] * vy + m[6] * vz + u[0];
        v[1] = m[1] * vx + m[4] * vy + m[7] * vz + u[1];
        v[2] = m[2] * vx + m[5] * vy + m[8] * vz + u[2];
        return v;
    }

    /**
     * @brief tensor product of two vectors `u * vt`
     * @details matrix such that `m.ij = u.i * u.j`
     * @param u left operand
     * @param v right operand
     */
    static tensor(u: Vector3, v = u): Matrix3 {
        return new Matrix3(
            u[0] * v[0], u[0] * v[1], u[0] * v[2],
            u[1] * v[0], u[1] * v[1], u[1] * v[2],
            u[2] * v[0], u[2] * v[1], u[2] * v[2],
        );
    }

    /** matrix from given 1D array containing the components of the matrix ordered as rows */
    static array(arr: number[]): Matrix3 {
        return new Matrix3(
            arr[0], arr[1], arr[2],
            arr[3], arr[4], arr[5],
            arr[6], arr[7], arr[8]);
    }

    /** matrix from 2D array of number ordered such that `arr[i]` is the i-th row of the matrix */
    static rows(arr: number[][]): Matrix3 {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]);
    }

    /** matrix from 2D array of number ordered such that `arr[j]` is the j-th column of the matrix */
    static cols(arr: number[][]): Matrix3 {
        return new Matrix3(
            arr[0][0], arr[1][0], arr[2][0],
            arr[0][1], arr[1][1], arr[2][1],
            arr[0][2], arr[1][2], arr[2][2]);
    }

    /** matrix from [[Vector3]] objects as rows */
    static xyz(arr: [Vector3, Vector3, Vector3]): Matrix3 {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]
        );
    }
}