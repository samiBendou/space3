import {Vector} from "./Algebra";
import {Vector3} from "./Vector3";

/**
 * @brief 3x3 matrices
 * @details This class represents dense 3x3 matrices.
 *
 * The matrices are represented as [[Vector3]] rows : `x`, `y`, `z`.
 *
 * Access a component of the matrix with the syntax `m.i.j` where `i` and `j` might be equal to `x`, `y` or `z`.
 * eg. `m.x.x`, `m.y.z`, ...
 *
 * - **algebraical operations** between matrices and with vectors `map`, `inv`, `prod`, `pow`, ...
 *
 * - **metric operations** between matrices `dot`, `mag`, `dist`...
 *
 * - **many generators** `diag`, `sym`, `scalar`, ...
 */
export class Matrix3 implements Vector {

    dim: Readonly<number> = 9;

    /** first row **/
    x: Vector3;

    /** second row **/
    y: Vector3;

    /** third row **/
    z: Vector3;

    /**
     * @brief construct a matrix by explicitly giving components
     * @example ` new Matrix3(1, 2, 3)` fills the first row `x` with `{x = 1, y = 2, z = 3}` and zeros elsewhere.
     */
    constructor(xx = 0, xy = 0, xz = 0,
                yx = 0, yy = 0, yz = 0,
                zx = 0, zy = 0, zz = 0) {
        this.x = new Vector3(xx, xy, xz);
        this.y = new Vector3(yx, yy, yz);
        this.z = new Vector3(zx, zy, zz);
    }

    /** rows of the matrix as vectors */
    get xyz(): [Vector3, Vector3, Vector3] {
        return [this.x, this.y, this.z];
    }

    set xyz(rows) {
        this.x = rows[0];
        this.y = rows[1];
        this.z = rows[2];
    }

    get mag() {
        return Math.sqrt(this.dot(this));
    }

    get mag2() {
        return this.dot(this);
    }

    /** determinant of the matrix */
    get det() {
        return this.x.x * this.y.y * this.z.z + this.x.y * this.y.z * this.z.x + this.x.z * this.y.x * this.z.y
            - this.x.z * this.y.y * this.z.x - this.x.y * this.y.x * this.z.z - this.x.x * this.y.z * this.z.y;
    }

    /** i-th row of the matrix */
    row(i: number) {
        return i === 0 ? this.x : undefined || i === 1 ? this.y : undefined || i === 2 ? this.z : undefined;
    }

    /** j-th column of the matrix */
    col(j: number) {
        return new Vector3(this.x.array()[j], this.y.array()[j], this.z.array()[j]);
    }

    /** explicitly sets all the component of the matrix */
    set(xx = 0, xy = 0, xz = 0,
        yx = 0, yy = 0, yz = 0,
        zx = 0, zy = 0, zz = 0) {
        this.x.xyz = [xx, xy, xz];
        this.y.xyz = [yx, yy, yz];
        this.z.xyz = [zx, zy, zz];
        return this;
    }

    copy() {
        return new Matrix3(...this.array());
    }

    reset0() {
        return this.fill(0);
    }

    reset1() {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    fill(s: number) {
        this.x.fill(s);
        this.y.fill(s);
        this.z.fill(s);
        return this;
    }

    fillc(s: number) {
        return this.copy().fill(s);
    }

    norm() {
        this.div(this.mag);
        return this;
    }

    normc() {
        return this.copy().norm();
    }

    add(m: Matrix3) {
        this.x.add(m.x);
        this.y.add(m.y);
        this.z.add(m.z);
        return this;
    }

    addc(m: Matrix3) {
        return this.copy().add(m);
    }

    sub(m: Matrix3) {
        this.x.sub(m.x);
        this.y.sub(m.y);
        this.z.sub(m.z);
        return this;
    }

    subc(m: Matrix3) {
        return this.copy().sub(m);
    }

    neg() {
        this.x.neg();
        this.y.neg();
        this.z.neg();
        return this;
    }

    negc() {
        return this.copy().neg();
    }

    mul(s: number) {
        this.x.mul(s);
        this.y.mul(s);
        this.z.mul(s);
        return this;
    }

    mulc(s: number) {
        return this.copy().mul(s);
    }

    div(s: number) {
        this.x.div(s);
        this.y.div(s);
        this.z.div(s);
        return this;
    }

    divc(s: number) {
        return this.copy().div(s);
    }

    lerp(m: Matrix3, t: number) {
        this.x.lerp(m.x, t);
        this.y.lerp(m.y, t);
        this.z.lerp(m.z, t);
        return this;
    }

    lerpc(m: Matrix3, t: number) {
        return this.copy().lerp(m, t);
    }

    trans() {
        return this.set(
            this.x.x, this.y.x, this.z.x,
            this.x.y, this.y.y, this.z.y,
            this.x.z, this.y.z, this.z.z
        );
    }

    transc() {
        return this.copy().trans();
    }

    prod(m: Matrix3) {
        const mTrs = m.copy().trans();
        return this.set(
            this.x.dot(mTrs.x), this.x.dot(mTrs.y), this.x.dot(mTrs.z),
            this.y.dot(mTrs.x), this.y.dot(mTrs.y), this.y.dot(mTrs.z),
            this.z.dot(mTrs.x), this.z.dot(mTrs.y), this.z.dot(mTrs.z)
        );
    }

    prodc(m: Matrix3) {
        return this.copy().prod(m);
    }

    inv() {
        const det = this.det;
        return this.set(
            this.y.y * this.z.z - this.y.z * this.z.y,
            this.x.z * this.z.y - this.x.y * this.z.z,
            this.x.y * this.y.z - this.x.z * this.y.y,
            this.y.z * this.z.x - this.y.x * this.z.z,
            this.x.x * this.z.z - this.x.z * this.z.x,
            this.x.z * this.y.x - this.x.x * this.y.z,
            this.y.x * this.z.y - this.y.y * this.z.x,
            this.x.y * this.z.x - this.x.x * this.z.y,
            this.x.x * this.y.y - this.x.y * this.y.x
        ).div(det);
    }

    invc() {
        return this.copy().inv();
    }

    dot(m: Matrix3) {
        return this.x.dot(m.x) + this.y.dot(m.y) + this.z.dot(m.z);
    }

    dist(m: Matrix3) {
        return this.copy().sub(m).mag;
    }

    dist2(m: Matrix3): number {
        return this.copy().sub(m).mag2;
    }

    equal(m: Matrix3) {
        return this.x.equal(m.x) && this.y.equal(m.y) && this.z.equal(m.z);
    }

    zero() {
        return this.x.zero() && this.y.zero() && this.z.zero();
    }

    string() {
        return `${this.x.string()}\n${this.y.string()}\n${this.z.string()}`;
    }

    array() {
        return [...this.x.array(), ...this.y.array(), ...this.z.array()];
    }

    /**
     * @brief product between matrix and vector
     * @details the result is stored in `u`
     * @returns reference to `u`
     */
    map(u: Vector3) {
        u.xyz = [this.x.dot(u), this.y.dot(u), this.z.dot(u)];
        return u;
    }

    mapc(u: Vector3) {
        return this.map(u.copy());
    }

    private rpow(exp: number) {
        if (exp > 1) {
            const copy = this.copy();
            this.prod(copy);
            if (exp % 2 === 0) {
                this.rpow(exp / 2);
            } else if (exp % 2 === 1) {
                this.rpow((exp - 1) / 2);
                this.prod(copy);
            }
        }
    }

    /** exponentiation of a matrix with positive and negative integer exponent. */
    pow(exp: number) {
        if (exp < 0)
            this.inv();
        if (exp === 0)
            this.set(...Matrix3.eye.array());
        this.rpow(Math.abs(exp));
        return this;
    }

    powc(exp: number) {
        return this.copy().pow(exp);
    }

    /** transform matrix to an 2D array. `arr[i]` represents the i-th row of the matrix */
    array2() {
        return [this.x.array(), this.y.array(), this.z.array()];
    }

    static get dim() {
        return 9;
    }

    static get zeros() {
        return new Matrix3();
    }

    static get ones() {
        return new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1);
    }

    /**
     * @brief identity matrix
     * @details Diagonal matrix filled with `1`.
     */
    static get eye() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * @brief scalar matrix
     * @details Diagonal matrix filled with a single value.
     * @param s scalar value
     */
    static scalar(s: number) {
        return new Matrix3(s, 0, 0, 0, s, 0, 0, 0, s);
    }

    /** diagonal matrix */
    static diag(xx: number, yy: number, zz: number) {
        return new Matrix3(xx, 0, 0, 0, yy, 0, 0, 0, zz);
    }

    /**
     * @brief symmetric matrix
     * @details Fill the matrix by giving values on diagonal.
     */
    static sym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0) {
        return new Matrix3(xx, xy, xz, xy, yy, yz, xz, yz, zz);
    }

    /**
     * @brief antisymmetric matrix
     * @details Fill the matrix by giving values on diagonals.
     */
    static asym(xx: number, yy: number, zz: number, xy: number, yz: number, xz = 0) {
        return new Matrix3(xx, xy, xz, -xy, yy, yz, -xz, -yz, zz);
    }

    /**
     * @brief canonical matrix
     * @details Matrix with `0` everywhere except in `i`, `j` position where there is a `1`.
     */
    static e(i: number, j: number) {
        const row = new Vector3(j === 0 ? 1 : 0, j === 1 ? 1 : 0, j === 2 ? 1 : 0);
        const can = Matrix3.zeros;

        can.x = i == 0 ? row : can.x;
        can.y = i == 1 ? row : can.y;
        can.z = i == 2 ? row : can.z;

        return can;
    }

    /**
     * @brief rotation matrix of axis (`0`, `ex`)
     * @details Anticlockwise rotation.
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param theta angle of rotation
     */
    static rotX(theta: number, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            1, 0, 0,
            0, cos(theta), -sin(theta),
            0, sin(theta), cos(theta)
        );
    }

    /**
     * @brief rotation matrix of axis (`0`, `ey`)
     * @details Anticlockwise rotation.
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param theta angle of rotation
     */
    static rotY(theta: number, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            cos(theta), 0, sin(theta),
            0, 1, 0,
            -sin(theta), 0, cos(theta)
        );
    }

    /**
     * @brief rotation matrix of axis (`0`, `ez`)
     * @details Anticlockwise rotation.
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @param theta angle of rotation
     */
    static rotZ(theta: number, cos = Math.cos, sin = Math.sin) {
        return new Matrix3(
            cos(theta), -sin(theta), 0,
            sin(theta), cos(theta), 0,
            0, 0, 1
        );
    }

    /**
     * @brief rotation matrix with around axis
     * @details Anticlockwise rotation.
     * - Use `a * cosh` as `cos` and `b * sinh` as `sin` to perform a hyperbolic rotation.
     * - Use `a * cos` as `cos` and `b * sin` as `sin` to perform a rotation around an ellipse
     * @param u axis of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @returns function that generates rotation `Matrix3` around axis for given angle
     */
    static makeRot(u: Vector3, cos = Math.cos, sin = Math.sin) {
        return (theta: number) => {
            const k = 1 - cos(theta), c = cos(theta), s = sin(theta);
            return new Matrix3(
                k * u.x ** 2 + c, k * u.x * u.y - u.z * s, k * u.x * u.z + u.y * s,
                k * u.x * u.y + u.z * s, k * u.y ** 2 + c, k * u.y * u.z - u.x * s,
                k * u.x * u.z - u.y * s, k * u.y * u.z + u.x * s, k * u.z ** 2 + c
            );
        }
    }

    /**
     * @brief affine transformation of the vector
     * @param m matrix of the transformation
     * @param v vector of the transformation
     * @returns function that computes affine transform a given `Vector3`
     */
    static makeAffine(m: Matrix3, v: Vector3) {
        return (u: Vector3) => m.map(u).add(v);
    }

    /**
     * @brief tensor product of two vectors
     * @details Tensor product is the matrix obtained from two vectors such that `m.i.j = u.i * v.j`.
     */
    static tens(u: Vector3, v?: Vector3) {
        const right = v || u;
        return new Matrix3(
            u.x * right.x, u.x * right.y, u.x * right.z,
            u.y * right.x, u.y * right.y, u.y * right.z,
            u.z * right.x, u.z * right.y, u.z * right.z,
        );
    }

    /** matrix with given 1D array containing the components of the matrix ordered as rows */
    static array(arr: number[]) {
        return new Matrix3(
            arr[0], arr[1], arr[2],
            arr[3], arr[4], arr[5],
            arr[6], arr[7], arr[8]);
    }

    /** array from 2D array of number ordered such that `arr[i]` is the i-th row of the matrix */
    static array2(arr: number[][]) {
        return new Matrix3(
            arr[0][0], arr[0][1], arr[0][2],
            arr[1][0], arr[1][1], arr[1][2],
            arr[2][0], arr[2][1], arr[2][2]);
    }

    /** array from [[Vector3]] objects as rows */
    static xyz(arr: [Vector3, Vector3, Vector3]) {
        return new Matrix3(
            arr[0].x, arr[0].y, arr[0].z,
            arr[1].x, arr[1].y, arr[1].z,
            arr[2].x, arr[2].y, arr[2].z
        );
    }
}