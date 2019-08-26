import {mag, mag2} from "./Algebra";
import Vector from "./int/Vector";
import {epsilon, epsilon2} from "./common";
import Encoder from "./int/Encoder";


/**
 * ## Brief
 *
 * [[Vector6]] represents 6D vectors.
 *
 * ## Getting started
 *
 * The `Vector6` class mainly implements [[Vector]] interface. It's a generalization of
 * [[Vector3]] class but it does not provide geometrical features such as rotations.
 *
 * `Vector6` can be seen as the concatenation of two vectors `(x, y, z)` and `(vx, vy, vz)` which
 * can represent the coordinates of a moving mobile in a 6D phase space. It's particularly useful
 * when dealing with second order differential equations.
 *
 * #### Example
 * ```js
 * let u = Vector6(1, 2, 3, 4, 5, 6);
 * let v = u.upper; // Vector3(1, 2, 3)
 * u.lower = v; // u = (1, 2, 3, 1, 2, 3)
 * ```
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */
export default class Vector6 extends Float64Array implements Vector, Encoder {
    dim: Readonly<number> = 6;

    /** norm of the vector */
    get mag(): number {
        return mag(this);
    }

    /** squared norm of the vector */
    get mag2(): number {
        return mag2(this);
    }

    /** upper part of the vector composed by the three first components */
    get upper(): [number, number, number] {
        return [this[0], this[1], this[2]];
    }

    set upper(newUpper: [number, number, number]) {
        this[0] = newUpper[0];
        this[1] = newUpper[1];
        this[2] = newUpper[2];
    }

    /** lower part of the vector composed by the three last components */
    get lower(): [number, number, number] {
        return [this[3], this[4], this[5]];
    }

    set lower(newUpper: [number, number, number]) {
        this[3] = newUpper[0];
        this[4] = newUpper[1];
        this[5] = newUpper[2];
    }

    /** constructs a vector with coordinates */
    constructor(x?: number, y?: number, z?: number, vx?: number, vy?: number, vz?: number) {
        super(6);

        if (x === undefined)
            return;

        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = vx;
        this[4] = vy;
        this[5] = vz;
    }

    string(): string {
        return `(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`;
    }

    array(): number[] {
        return [...this];
    }

    assign(x: number, y: number, z: number, vx: number, vy: number, vz: number): this {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = vx;
        this[4] = vy;
        this[5] = vz;
        return this;
    }

    copy(u: Vector): this {
        this[0] = u[0];
        this[1] = u[1];
        this[2] = u[2];
        this[3] = u[3];
        this[4] = u[4];
        this[5] = u[5];
        return this;
    }

    clone(): Vector6 {
        return new Vector6(this[0], this[1], this[2], this[3], this[4], this[5]);
    }

    /** sets vector to zeros */
    reset0(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 0;
        return this;
    }

    /** sets vector to ones */
    reset1(): this {
        this[0] = 1;
        this[1] = 1;
        this[2] = 1;
        this[3] = 1;
        this[4] = 1;
        this[5] = 1;
        return this;
    }

    random(): this {
        this[0] = Math.random();
        this[1] = Math.random();
        this[2] = Math.random();
        this[3] = Math.random();
        this[4] = Math.random();
        this[5] = Math.random();
        return this;
    }

    floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        this[3] = Math.floor(this[3]);
        this[4] = Math.floor(this[4]);
        this[5] = Math.floor(this[5]);
        return this;
    }

    floorc(): Vector6 {
        return this.clone().floor();
    }

    ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        this[3] = Math.ceil(this[3]);
        this[4] = Math.ceil(this[4]);
        this[5] = Math.ceil(this[5]);
        return this;
    }

    ceilc(): Vector6 {
        return this.clone().ceil();
    }


    round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        this[2] = Math.round(this[2]);
        this[3] = Math.round(this[3]);
        this[4] = Math.round(this[4]);
        this[5] = Math.round(this[5]);
        return this;
    }

    roundc(): Vector6 {
        return this.clone().round();
    }

    trunc(decimals: number): this {
        const pow10 = Math.pow(10, decimals);
        this[0] = Math.round(this[0] * pow10) / pow10;
        this[1] = Math.round(this[1] * pow10) / pow10;
        this[2] = Math.round(this[2] * pow10) / pow10;
        this[3] = Math.round(this[3] * pow10) / pow10;
        this[4] = Math.round(this[4] * pow10) / pow10;
        this[5] = Math.round(this[5] * pow10) / pow10;
        return this;
    }

    truncc(decimals: number): Vector6 {
        return this.clone().trunc(decimals);
    }

    abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        this[3] = Math.abs(this[3]);
        this[4] = Math.abs(this[4]);
        this[5] = Math.abs(this[5]);
        return this;
    }

    absc(): Vector6 {
        return this.clone().abs();
    }

    min(u: Vector): this {
        this[0] = Math.min(this[0], u[0]);
        this[1] = Math.min(this[1], u[1]);
        this[2] = Math.min(this[2], u[2]);
        this[3] = Math.min(this[3], u[3]);
        this[4] = Math.min(this[4], u[4]);
        this[5] = Math.min(this[5], u[5]);
        return this;
    }

    minc(u: Vector): Vector6 {
        return this.clone().min(u);
    }


    max(u: Vector): this {
        this[0] = Math.max(this[0], u[0]);
        this[1] = Math.max(this[1], u[1]);
        this[2] = Math.max(this[2], u[2]);
        this[3] = Math.max(this[3], u[3]);
        this[4] = Math.max(this[4], u[4]);
        this[5] = Math.max(this[5], u[5]);
        return this;
    }

    maxc(u: Vector): Vector6 {
        return this.clone().max(u);
    }

    fill(s: number): this {
        this[0] = s;
        this[1] = s;
        this[2] = s;
        this[3] = s;
        this[4] = s;
        this[5] = s;
        return this;
    }

    fillc(s: number): Vector6 {
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
        return this;
    }

    normc(): Vector6 {
        return this.clone().norm();
    }

    add(u: Vector): this {
        this[0] += u[0];
        this[1] += u[1];
        this[2] += u[2];
        this[3] += u[3];
        this[4] += u[4];
        this[5] += u[5];
        return this;
    }

    addc(u: Vector): Vector6 {
        return this.clone().add(u);
    }

    sub(u: Vector): this {
        this[0] -= u[0];
        this[1] -= u[1];
        this[2] -= u[2];
        this[3] -= u[3];
        this[4] -= u[4];
        this[5] -= u[5];
        return this;
    }

    subc(u: Vector): Vector6 {
        return this.clone().sub(u);
    }

    neg(): this {
        this[0] *= -1;
        this[1] *= -1;
        this[2] *= -1;
        this[3] *= -1;
        this[4] *= -1;
        this[5] *= -1;
        return this;
    }

    negc(): Vector6 {
        return this.clone().neg();
    }

    mul(s: number): this {
        this[0] *= s;
        this[1] *= s;
        this[2] *= s;
        this[3] *= s;
        this[4] *= s;
        this[5] *= s;
        return this;
    }

    mulc(s: number): Vector6 {
        return this.clone().mul(s);
    }

    div(s: number): this {
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        this[3] /= s;
        this[4] /= s;
        this[5] /= s;
        return this;
    }

    divc(s: number): Vector6 {
        return this.clone().div(s);
    }

    comb(s: number, u: Vector): this {
        this[0] += s * u[0];
        this[1] += s * u[1];
        this[2] += s * u[2];
        this[3] += s * u[3];
        this[4] += s * u[4];
        this[5] += s * u[5];
        return this;
    }

    combc(s: number, u: Vector): Vector6 {
        return this.clone().comb(s, u);
    }

    lerp(u: Vector, s: number): this {
        this[0] += (u[0] - this[0]) * s;
        this[1] += (u[1] - this[1]) * s;
        this[2] += (u[2] - this[2]) * s;
        this[3] += (u[3] - this[3]) * s;
        this[4] += (u[4] - this[4]) * s;
        this[5] += (u[5] - this[5]) * s;
        return this;
    }

    lerpc(u: Vector, s: number): Vector6 {
        return this.clone().lerp(u, s);
    }

    herp(u: Vector, u1: Vector, u2: Vector, s: number): this {
        const s2 = s * s,
            t0 = s2 * (2 * s - 3) + 1,
            t1 = s2 * (s - 2) + s,
            t2 = s2 * (s - 1),
            t3 = s2 * (3 - 2 * s);
        this[0] = this[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this[1] = this[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this[2] = this[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
        this[3] = this[3] * t0 + u1[3] * t1 + u2[3] * t2 + u[3] * t3;
        this[4] = this[4] * t0 + u1[4] * t1 + u2[4] * t2 + u[4] * t3;
        this[5] = this[5] * t0 + u1[5] * t1 + u2[5] * t2 + u[5] * t3;
        return this;
    }

    herpc(u: Vector, u1: Vector, u2: Vector, s: number): Vector6 {
        return this.clone().herp(u, u1, u2, s);
    }

    berp(u: Vector, u1: Vector, u2: Vector, s: number): this {
        const s2 = s * s,
            inv = 1 - s,
            inv2 = inv * inv,
            t0 = inv2 * inv,
            t1 = 3 * s * inv2,
            t2 = 3 * s2 * inv,
            t3 = s2 * s;
        this[0] = this[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this[1] = this[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this[2] = this[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
        this[3] = this[3] * t0 + u1[3] * t1 + u2[3] * t2 + u[3] * t3;
        this[4] = this[4] * t0 + u1[4] * t1 + u2[4] * t2 + u[4] * t3;
        this[5] = this[5] * t0 + u1[5] * t1 + u2[5] * t2 + u[5] * t3;
        return this;
    }

    berpc(u: Vector, u1: Vector, u2: Vector, s: number): Vector6 {
        return this.clone().berp(u, u1, u2, s);
    }

    der(ds: number, u: Vector): this {
        this[0] = (this[0] - u[0]) / ds;
        this[1] = (this[1] - u[1]) / ds;
        this[2] = (this[2] - u[2]) / ds;
        this[3] = (this[3] - u[3]) / ds;
        this[4] = (this[4] - u[4]) / ds;
        this[5] = (this[5] - u[5]) / ds;
        return this;
    }

    derc(ds: number, u: Vector): Vector6 {
        return this.clone().der(ds, u);
    }

    /** Hadamard product of two vectors*/
    prod(u: Vector): this {
        this[0] *= u[0];
        this[1] *= u[1];
        this[2] *= u[2];
        this[3] *= u[3];
        this[4] *= u[4];
        this[5] *= u[5];
        return this;
    }

    prodc(u: Vector): Vector6 {
        return this.clone().prod(u);
    }

    inv(): this {
        this[0] **= -1;
        this[1] **= -1;
        this[2] **= -1;
        this[3] **= -1;
        this[4] **= -1;
        this[5] **= -1;
        return this;
    }

    invc(): Vector6 {
        return this.clone().inv();
    }

    dot(u: Vector): number {
        return this[0] * u[0] + this[1] * u[1] + this[2] * u[2] +
            this[3] * u[3] + this[4] * u[4] + this[5] * u[5];
    }

    dist(u: Vector): number {
        return Math.sqrt(this.dist2(u));
    }

    dist1(u: Vector): number {
        const dx = Math.abs(this[0] - u[0]),
            dy = Math.abs(this[1] - u[1]),
            dz = Math.abs(this[2] - u[2]),
            dvx = Math.abs(this[3] - u[3]),
            dvy = Math.abs(this[4] - u[4]),
            dvz = Math.abs(this[5] - u[5]);
        return dx + dy + dz + dvx + dvy + dvz;
    }

    dist2(u: Vector): number {
        const dx = this[0] - u[0],
            dy = this[1] - u[1],
            dz = this[2] - u[2],
            dvx = this[3] - u[3],
            dvy = this[4] - u[4],
            dvz = this[5] - u[5];
        return dx * dx + dy * dy + dz * dz + dvx * dvx + dvy * dvy + dvz * dvz;
    }

    exact(u: Vector): boolean {
        return this[0] === u[0] && this[1] === u[1] && this[2] === u[2] &&
            this[3] === u[3] && this[4] === u[4] && this[5] === u[5];
    }

    equal1(u: Vector): boolean {
        const x = this[0],
            y = this[1],
            z = this[2],
            ux = u[0],
            uy = u[1],
            uz = u[2];
        const vx = this[3],
            vy = this[4],
            vz = this[5],
            uvx = u[3],
            uvy = u[4],
            uvz = u[5];

        // noinspection JSSuspiciousNameCombination
        return Math.abs(x - ux) < epsilon && Math.abs(y - uy) < epsilon && Math.abs(z - uz) < epsilon &&
            Math.abs(vx - uvx) < epsilon && Math.abs(vy - uvy) < epsilon && Math.abs(vz - uvz) < epsilon;
    }

    equal2(u: Vector): boolean {
        return this.dist2(u) < epsilon2;
    }

    nil(): boolean {
        return this[0] === 0 && this[1] === 0 && this[2] === 0 &&
            this[3] === 0 && this[4] === 0 && this[5] === 0;
    }

    zero1(): boolean {
        const x = Math.abs(this[0]),
            y = Math.abs(this[1]),
            z = Math.abs(this[2]),
            vx = Math.abs(this[3]),
            vy = Math.abs(this[4]),
            vz = Math.abs(this[5]);

        // noinspection JSSuspiciousNameCombination
        return x <= epsilon * Math.max(1.0, x) && y <= epsilon * Math.max(1.0, y) && z <= epsilon * Math.max(1.0, z) &&
            vx <= epsilon * Math.max(1.0, vx) && vy <= epsilon * Math.max(1.0, vy) && vz <= epsilon * Math.max(1.0, vz);
    }

    zero2(): boolean {
        const x = this[0],
            y = this[1],
            z = this[2],
            vx = this[3],
            vy = this[4],
            vz = this[5];
        return x * x + y * y + z * z + vx * vx + vy * vy + vz * vz < epsilon2;
    }

    /** vector filled with `0` */
    static get zeros(): Vector6 {
        return new Vector6(0, 0, 0, 0, 0, 0);
    }

    /** vector filled with `1` */
    static get ones(): Vector6 {
        return new Vector6(1, 1, 1, 1, 1, 1);
    }

    /** vector filled with `s` */
    static scalar(s: number): Vector6 {
        return new Vector6(s, s, s, s, s, s);
    }

    /**
     * @brief canonical basis vector
     * @details vector filled with `1` at the `k`-th index and `0` elsewhere.
     * @param k {number} order of the vector in basis
     */
    static e(k: number): Vector6 {
        const ek = new Vector6(0, 0, 0, 0, 0, 0);
        ek[k] = 1;
        return ek;
    }

    /**
     * @brief canonical basis vector
     * @details vector filled with `-1` at the `k`-th index and `0` elsewhere.
     * @param k {number} order of the vector in basis
     */
    static en(k: number): Vector6 {
        const ek = new Vector6(0, 0, 0, 0, 0, 0);
        ek[k] = -1;
        return ek;
    }

    /** vector filled with uniform random values. See [[random]] for more details. */
    static random(): Vector6 {
        return new Vector6(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random());
    }

    /** vector from coordinates of array in the form `[x, y, z, vx, vy, vz, ...]` */
    static array(arr: number[]): Vector6 {
        return new Vector6(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
    }
}