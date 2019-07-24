/**
 * ## Introduction
 *
 * Represent 3 dimensional vectors with an **object oriented interface**. This module only document the class
 * [[Vector3]]. See [Algebra](_algebra_.html) page for more general information about the API.
 *
 * ## Vector3
 *
 * [[Vector3]] is a vast class that allows to perform many **commons and advanced operations** with 3D vectors.
 * It is designed to provide fast and intuitive interface for **algebraical and geometrical** manipulations.
 *
 * ### Coordinates systems
 * Get and set coordinates in many different systems.
 *
 * #### Example
 * ```js
 * let u = Vector3.ones; // u = (1 1 1)
 * console.log(u.r); // outputs +sqrt(3)
 * console.log(u.x); // outputs 1
 * console.log(u.theta); // outputs +pi/4
 * console.log(u.xyz); // outputs [1, 1, 1]
 * ```
 *
 * ### Geometrical features
 * Perform rotations, compute angles, get cosine, ...
 *
 * #### Example
 *  * ```js
 * let u = Vector3.ones, ex = Vector3.ex; // (1, 1, 1) (1, 0, 0)
 * console.log(u.angle(ex)); // outputs +pi/4
 * ex.rotZ(Math.PI / 2);
 * console.log(u.string()); // outputs (0, 1, 0)
 * ```
 *
 * ### Basis generators
 * Represent 3D local basis such as cylindrical basis.
 *
 * #### Example
 * ```js
 * let ones = Vector3.ones;
 * let er = Vector3.er(ones), etheta = Vector3.etheta;
 * ```
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */
/** */

import {epsilon, epsilon2, gaussian, mag, mag2, Object3, Vector} from "./Algebra";

/**
 * @brief 3D Vectors
 * @details Represents numeric vectors of dimension 3.
 *
 * - **Array like** access `u[0]`, `u[1]`, ...
 * - **Geometrical operations** `angle`, `cross`, `dist`, ...
 * - **Many coordinates system** accessors `x`, `y`, `z`, `r`, `theta`, `lat`, `lon` ...
 * - **Basis generators** like `ex`, `er(u)`, `e(k)`, ...
 * - **Rotations** around `ex`, `ey`, `ez` and custom axis, `rot`, `rotX`, ...
 */
export class Vector3 extends Float64Array implements Vector, Object3 {

    dim: Readonly<number> = 3;

    /** first cartesian coordinate */
    get x(): number {
        return this[0];
    }

    set x(newX) {
        this[0] = newX;
    }

    /** second cartesian coordinate */
    get y(): number {
        return this[1];
    }

    set y(newY) {
        this[1] = newY;
    }

    /** third cartesian coordinate */
    get z(): number {
        return this[2];
    }

    set z(newZ) {
        this[2] = newZ;
    }

    /** cartesian coordinates of the vector */
    get xyz(): [number, number, number] {
        return [this[0], this[1], this[2]];
    }

    set xyz(coordinates) {
        this.assign(...coordinates);
    }

    /** length of the vector */
    get mag(): number {
        return mag(this);
    }

    /** squared length of the vector */
    get mag2(): number {
        return mag2(this);
    }

    /** first spherical coordinate, length of the vector */
    get r(): number {
        return mag(this);
    }

    set r(newR) {
        const s = newR / mag(this);
        this[0] *= s;
        this[1] *= s;
        this[2] *= s;
    }

    /** second cylindrical and spherical coordinate, counterclockwise angle formed with `ex` in radians */
    get theta(): number {
        return Math.atan2(this[1], this[0]);
    }

    set theta(newTheta) {
        this.rthph = [mag(this), newTheta, this.phi];
    }

    /** third spherical coordinate, clockwise angle formed with  `ez` in radians */
    get phi(): number {
        return Math.atan2(this.rxy, this[2]);
    }

    set phi(newPhi) {
        this.rthph = [mag(this), this.theta, newPhi];
    }

    /** first cylindrical coordinate, length of the projection of the vector on the plane formed with `ex`, `ey` */
    get rxy(): number {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }

    set rxy(newRxy) {
        this.rthz = [newRxy, this.theta, this[2]];
    }

    /** latitude of the vector in radians */
    get lat(): number {
        return Math.PI / 2 - this.phi;
    }

    set lat(newLat) {
        this.rthph = [mag(this), this.theta, Math.PI / 2 - newLat];
    }

    /** longitude of the vector in radians */
    get lon(): number {
        const theta = this.theta;
        return theta <= Math.PI ? theta : theta - 2 * Math.PI;
    }

    set lon(newLat) {
        this.rthph = [mag(this), newLat >= 0 ? newLat : newLat + 2 * Math.PI, this.phi];
    }

    /** cylindrical coordinates of the vector*/
    get rthz(): [number, number, number] {
        return [this.rxy, this.theta, this[2]];
    }

    set rthz(coordinates: [number, number, number]) {
        const rxy = coordinates[0], theta = coordinates[1];
        this[0] = rxy * Math.cos(theta);
        this[1] = rxy * Math.sin(theta);
        this[2] = coordinates[2];
    }

    /** spherical coordinates of the vector */
    get rthph(): [number, number, number] {
        return [mag(this), this.theta, this.phi];
    }

    set rthph(coordinates: [number, number, number]) {
        const r = coordinates[0], theta = coordinates[1], phi = coordinates[2];
        const s = Math.sin(phi);
        this[0] = r * s * Math.cos(theta);
        this[1] = r * s * Math.sin(theta);
        this[2] = r * Math.cos(phi);
    }

    /** constructs a vector with cartesian coordinates */
    constructor(x: number, y: number, z: number) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    string(): string {
        return `(${this[0]}, ${this[1]}, ${this[2]})`;
    }

    array(): number[] {
        return [...this];
    }

    assign(x: number, y: number, z: number = 0): this {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        return this;
    }

    copy(u: Vector3): this {
        this[0] = u[0];
        this[1] = u[1];
        this[2] = u[2];
        return this;
    }

    clone(): Vector3 {
        return new Vector3(this[0], this[1], this[2]);
    }

    reset0(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        return this;
    }

    /** sets vector to ones */
    reset1(): this {
        this[0] = 1;
        this[1] = 1;
        this[2] = 1;
        return this;
    }

    random(): this {
        this[0] = Math.random();
        this[1] = Math.random();
        this[2] = Math.random();
        return this;
    }

    floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        return this;
    }

    floorc(): Vector3 {
        return this.clone().floor();
    }

    ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        return this;
    }

    ceilc(): Vector3 {
        return this.clone().ceil();
    }


    round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        this[2] = Math.round(this[2]);
        return this;
    }

    roundc(): Vector3 {
        return this.clone().round();
    }

    trunc(decimals: number): this {
        const pow10 = Math.pow(10, decimals);
        this[0] = Math.round(this[0] * pow10) / pow10;
        this[1] = Math.round(this[1] * pow10) / pow10;
        this[2] = Math.round(this[2] * pow10) / pow10;
        return this;
    }

    truncc(decimals: number): Vector3 {
        return this.clone().trunc(decimals);
    }

    abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        return this;
    }

    absc(): Vector3 {
        return this.clone().abs();
    }

    min(u: Vector3): this {
        this[0] = Math.min(this[0], u[0]);
        this[1] = Math.min(this[1], u[1]);
        this[2] = Math.min(this[2], u[2]);
        return this;
    }

    minc(u: Vector3): Vector3 {
        return this.clone().min(u);
    }


    max(u: Vector3): this {
        this[0] = Math.max(this[0], u[0]);
        this[1] = Math.max(this[1], u[1]);
        this[2] = Math.max(this[2], u[2]);
        return this;
    }

    maxc(u: Vector3): Vector3 {
        return this.clone().max(u);
    }

    fill(s: number): this {
        this[0] = s;
        this[1] = s;
        this[2] = s;
        return this;
    }

    fillc(s: number): Vector3 {
        return this.clone().fill(s);
    }

    norm(): this {
        const s = mag(this);
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        return this;
    }

    normc(): Vector3 {
        return this.clone().norm();
    }

    add(u: Vector3): this {
        this[0] += u[0];
        this[1] += u[1];
        this[2] += u[2];
        return this;
    }

    addc(u: Vector3): Vector3 {
        return this.clone().add(u);
    }

    sub(u: Vector3): this {
        this[0] -= u[0];
        this[1] -= u[1];
        this[2] -= u[2];
        return this;
    }

    subc(u: Vector3): Vector3 {
        return this.clone().sub(u);
    }

    neg(): this {
        this[0] *= -1;
        this[1] *= -1;
        this[2] *= -1;
        return this;
    }

    negc(): Vector3 {
        return this.clone().neg();
    }

    mul(s: number): this {
        this[0] *= s;
        this[1] *= s;
        this[2] *= s;
        return this;
    }

    mulc(s: number): Vector3 {
        return this.clone().mul(s);
    }

    div(s: number): this {
        this[0] /= s;
        this[1] /= s;
        this[2] /= s;
        return this;
    }

    divc(s: number): Vector3 {
        return this.clone().div(s);
    }

    comb(s: number, u: Vector3): this {
        this[0] += s * u[0];
        this[1] += s * u[1];
        this[2] += s * u[2];
        return this;
    }

    combc(s: number, u: Vector3): Vector3 {
        return this.clone().comb(s, u);
    }

    lerp(u: Vector3, s: number): this {
        this[0] += (u[0] - this[0]) * s;
        this[1] += (u[1] - this[1]) * s;
        this[2] += (u[2] - this[2]) * s;
        return this;
    }

    lerpc(u: Vector3, s: number): Vector3 {
        return this.clone().lerp(u, s);
    }

    herp(u: Vector3, u1: Vector3, u2: Vector3, s: number): this {
        const s2 = s * s,
            t0 = s2 * (2 * s - 3) + 1,
            t1 = s2 * (s - 2) + s,
            t2 = s2 * (s - 1),
            t3 = s2 * (3 - 2 * s);
        this[0] = this[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this[1] = this[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this[2] = this[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
        return this;
    }

    herpc(u: Vector3, u1: Vector3, u2: Vector3, s: number): Vector3 {
        return this.clone().herp(u, u1, u2, s);
    }

    berp(u: Vector3, u1: Vector3, u2: Vector3, s: number): this {
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
        return this;
    }

    berpc(u: Vector3, u1: Vector3, u2: Vector3, s: number): Vector3 {
        return this.clone().berp(u, u1, u2, s);
    }

    der(ds: number, u: Vector3): this {
        this[0] = (this[0] - u[0]) / ds;
        this[1] = (this[1] - u[1]) / ds;
        this[2] = (this[2] - u[2]) / ds;
        return this;
    }

    derc(ds: number, u: Vector3): Vector3 {
        return this.clone().der(ds, u);
    }

    /** Hadamard product of two vectors*/
    prod(u: Vector3): this {
        this[0] *= u[0];
        this[1] *= u[1];
        this[2] *= u[2];
        return this;
    }

    prodc(u: Vector3): Vector3 {
        return this.clone().prod(u);
    }

    inv(): this {
        this[0] **= -1;
        this[1] **= -1;
        this[2] **= -1;
        return this;
    }

    invc(): Vector3 {
        return this.clone().inv();
    }

    dot(u: Vector3): number {
        return this[0] * u[0] + this[1] * u[1] + this[2] * u[2];
    }

    dist(u: Vector3): number {
        return Math.sqrt(this.dist2(u));
    }

    dist1(u: Vector3): number {
        const dx = Math.abs(this[0] - u[0]),
            dy = Math.abs(this[1] - u[1]),
            dz = Math.abs(this[2] - u[2]);
        return dx + dy + dz;
    }

    dist2(u: Vector3): number {
        const dx = this[0] - u[0],
            dy = this[1] - u[1],
            dz = this[2] - u[2];
        return dx * dx + dy * dy + dz * dz;
    }

    exact(u: Vector3): boolean {
        return this[0] === u[0] && this[1] === u[1] && this[2] === u[2];
    }

    equal1(u: Vector3): boolean {
        const x = this[0],
            y = this[1],
            z = this[2],
            ux = u[0],
            uy = u[1],
            uz = u[2];

        // noinspection JSSuspiciousNameCombination
        return Math.abs(x - ux) < epsilon && Math.abs(y - uy) < epsilon && Math.abs(z - uz) < epsilon;
    }

    equal2(u: Vector3): boolean {
        return this.dist2(u) < epsilon2;
    }

    nil(): boolean {
        return this[0] === 0 && this[1] === 0 && this[2] === 0;
    }

    zero1(): boolean {
        const x = Math.abs(this[0]),
            y = Math.abs(this[1]),
            z = Math.abs(this[2]);

        // noinspection JSSuspiciousNameCombination
        return x <= epsilon * Math.max(1.0, x) && y <= epsilon * Math.max(1.0, y) && z <= epsilon * Math.max(1.0, z);
    }

    zero2(): boolean {
        const x = this[0],
            y = this[1],
            z = this[2];
        return x * x + y * y + z * z < epsilon2;
    }

    /** cross product of two vector */
    cross(u: Vector3): this {
        const x = this[0],
            y = this[1],
            z = this[2];
        const ux = u[0],
            uy = u[1],
            uz = u[2];
        this[0] = y * uz - z * uy;
        this[1] = z * ux - x * uz;
        this[2] = x * uy - y * ux;
        return this;
    }

    crossc(u: Vector3): Vector3 {
        return this.clone().cross(u);
    }

    /** area of the parallelepiped formed with the two vectors */
    area(u: Vector3): number {
        const x = this[0],
            y = this[1],
            z = this[2];
        const ux = u[0],
            uy = u[1],
            uz = u[2];
        const ax = y * uz - z * uy,
            ay = z * ux - x * uz,
            az = x * uy - y * ux;

        return Math.sqrt(ax * ax + ay * ay + az * az);
    }

    /** unsigned angle between two vectors in radians */
    angle(u: Vector3): number {
        return Math.acos(this.cos(u));
    }

    /** cosine of the angle between two vector */
    cos(u: Vector3): number {
        let ux = u[0],
            uy = u[1],
            uz = u[2];
        const t1 = [...this];
        const umag = Math.sqrt(ux * ux + uy * uy + uz * uz),
            tmag = mag(this);
        ux /= umag;
        uy /= umag;
        uz /= umag;
        t1[0] /= tmag;
        t1[1] /= tmag;
        t1[2] /= tmag;
        return t1[0] * ux + t1[1] * uy + t1[2] * uz;
    }

    /**
     * @brief rotates the vector around `x` axis
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    rotX(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta), y = this[1], z = this[2];
        this[1] = y * c - z * s;
        this[2] = y * s + z * c;
        return this;
    }

    /**
     * @brief rotates the vector around `y` axis
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    rotY(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = -sin(theta), x = this[0], z = this[2];
        this[0] = x * c + z * s;
        this[2] = x * s - z * c;
        return this;
    }

    /**
     * @brief rotates the vector around `z` axis
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     * @details Anticlockwise rotation.
     */
    rotZ(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta), x = this[0], y = this[1];
        this[0] = x * c - y * s;
        this[1] = x * s + y * c;
        return this;
    }

    /**
     * @brief rotates the vector around given axis
     * @param u axis of rotation
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    rot(u: Vector3, theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta), k = 1 - c;
        const x = this[0],
            y = this[1],
            z = this[2];
        const ux = u[0],
            uy = u[1],
            uz = u[2];
        const kuxy = k * ux * uy,
            kuxz = k * ux * uz,
            kuyz = k * uy * uz;
        this[0] = (k * ux * ux + c) * x + (kuxy - uz * s) * y + (kuxz + uy * s) * z;
        this[1] = (kuxy + uz * s) * x + (k * uy * uy + c) * y + (kuyz - ux * s) * z;
        this[2] = (kuxz - uy * s) * x + (kuyz + ux * s) * y + (k * uz * uz + c) * z;
        return this;
    }

    /**
     * @brief random vector following normal law
     * @details If `yd` and `zd` are unspecified then `xd` will represent the standard deviation for all axis.
     * @param xm average value of `x`
     * @param ym average value of `y`
     * @param zm average value of `z`
     * @param xd standard deviation along `x` axis
     * @param yd standard deviation along `y` axis
     * @param zd standard deviation along `z` axis
     */
    gaussian(xm: number, ym: number, zm: number, xd: number, yd = xd, zd = xd): this {
        this[0] = gaussian(xm, xd);
        this[1] = gaussian(ym, yd);
        this[2] = gaussian(zm, zd);
        return this;
    }

    static get dim(): number {
        return 3;
    }

    /** vector filled with `0` */
    static get zeros(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    /** vector filled with `1` */
    static get ones(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /** vector filled with `s` */
    static scalar(s: number): Vector3 {
        return new Vector3(s, s, s);
    }

    /** vector filled with uniform random values.  See [[random]] for more details. */
    static random(): Vector3 {
        return new Vector3(Math.random(), Math.random(), Math.random());
    }

    /** vector with coordinates following gaussian law. See [[Vector3.gaussian]] for more details. */
    static gaussian(xm: number, ym: number, zm: number, xd: number, yd = xd, zd = xd): Vector3 {
        return new Vector3(gaussian(xm, xd), gaussian(ym, yd), gaussian(zm, zd));
    }

    /** vector with given cylindrical coordinates. See [[this.rthz]] for more details. */
    static rthz(rxy: number, theta: number, z: number): Vector3 {
        return new Vector3(rxy * Math.cos(theta), rxy * Math.sin(theta), z);
    }

    /** vector with given spherical coordinates. See [[rthph]] for more details. */
    static rthph(r: number, theta: number, phi: number): Vector3 {
        const s = r * Math.sin(phi);
        return new Vector3(s * Math.cos(theta), s * Math.sin(theta), r * Math.cos(phi));
    }

    /** first vector of canonical basis, equivalent to right */
    static get ex(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    /** opposite of the first vector of canonical basis, equivalent to left */
    static get exn(): Vector3 {
        return new Vector3(-1, 0, 0);
    }

    /** second vector of canonical basis, equivalent to up */
    static get ey(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    /** opposite of the second vector of canonical basis, equivalent to down */
    static get eyn(): Vector3 {
        return new Vector3(0, -1, 0);
    }

    /** third vector of canonical basis, equivalent to forward */
    static get ez(): Vector3 {
        return new Vector3(0, 0, 1);
    }

    /** third vector of canonical basis, equivalent to backward */
    static get ezn(): Vector3 {
        return new Vector3(0, 0, -1);
    }

    /**
     * @brief canonical basis vector
     * @example `e(0) == ex`, `e(1) == ey`, `e(2) == ez`.
     * @param k {number} order of the vector in basis
     */
    static e(k: number): Vector3 {
        const ek = new Vector3(0, 0, 0);
        ek[k] = 1;
        return ek;
    }

    /**
     * @brief radial vector of spherical basis
     * @param u position of local basis from origin
     */
    static er(u: Vector3): Vector3 {
        const theta = u.theta, phi = u.phi, s = Math.sin(phi);
        return new Vector3(s * Math.cos(theta), s * Math.sin(theta), Math.cos(phi));
    }

    /**
     * @brief prograde vector of spherical basis
     * @details Prograde vector is perpendicular to the radial vector and oriented in the positive `theta` direction.
     * This vector also correspond to the prograde vector of cylindrical basis.
     * @param u position of local basis from origin
     */
    static etheta(u: Vector3): Vector3 {
        const theta = u.theta;
        return new Vector3(-Math.sin(theta), Math.cos(theta), 0);
    }

    /**
     * @brief normal vector of spherical basis
     * @details Normal vector is perpendicular to the radial vector and oriented in the positive `phi` direction.
     * @param u position of local basis from origin
     */
    static ephi(u: Vector3): Vector3 {
        const theta = u.theta, phi = u.phi, c = Math.cos(phi);
        return new Vector3(c * Math.cos(theta), c * Math.sin(theta), -Math.sin(phi));
    }

    /** vector from coordinates of array in the form `[x, y, z]`*/
    static array(arr: number[]): Vector3 {
        return new Vector3(arr[0], arr[1], arr[2]);
    }
}