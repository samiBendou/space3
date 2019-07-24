/**
 * ## Introduction
 *
 * Represent 3 dimensional points with an **object oriented interface**. This module only document the class
 * [[Point3]]. See [Algebra](_algebra_.html) page for more general information about the API.
 *
 * ## Point3
 * [[Point3]] is a class that allows to perform many **commons and advanced operations** with 3D points.
 * It is designed to provide fast and intuitive interface for **geometrical** manipulations in **affine space**.
 *
 * ### Inheritance with Vector3
 * [[Point3]] inherits from [[Vector3]]. A point is a vector represented from a given origin. Points overrides all
 * the vectors features.
 *
 * #### Example
 * ```js
 * p.x // x position
 * p.r // r coordinate from origin
 * ```
 *
 * Each operation between points outputs the same result as between vectors but converts coordinates of the right
 * operand in coordinates from origin of the left operand if needed.
 * Therefore operations between two points can be considered as operations between two positions vectors
 * located from the origin of the left operand.
 *
 * ### Position
 * A point stores relative position from current `origin` member, if the origin is modified using `p.origin = ...` syntax
 * then the coordinates of the points are updated to the coordinates from new origin.
 *
 * #### Example
 * ```js
 * let p = Point3.zeros; // sets point (0, 0, 0) from origin (0, 0, 0)
 * p.origin = Vector3.ex; // sets point (-1, 0, 0) from origin (1, 0, 0)
 * ```
 *
 * **Note** If you want to access absolute position of the point use the syntax `p.absolute = ...`.
 *
 * ### Chalses Relation
 * Addition and subtraction are performed using Chalses relation from the origin of the left operand of the operation.
 *
 * #### Example
 * ```js
 * let p = Point3(1, 2, 3), q = Point3(2, 0, 0, Vector3.ex);
 * p.add(q); // sets p to (4, 2, 3) from origin (0, 0, 0)
 * p.sub(q); // sets p to (-2, 2, 3) from origin (0, 0, 0)
 * ```
 *
 * ### Displacement and Origin Changes
 * Represent displacement vector **AB** between two points `a`, `b` with `to` and get coordinates of a point from
 * a given new origin with `at`.
 *
 * ```js
 * let a = Point3.zeros, b = new Point3(1, 0, 0), ex = Vector3.ex;
 * a.to(b); // (1, 0, 0)
 * b.to(a); // (-1, 0, 0)
 * b.at(ex); // (0, 0, 0)
 * a.at(ex); // (-1, 0, 0)
 * ```
 *
 * ### Translation and Transformation
 * Apply matrix transform, translations, affine transforms, ...
 *
 * ```js
 * a.translate(u);
 * a.transform(m);
 * a.affine(m, u);
 * ```
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */
/** */

import {Vector3} from "./Vector3";
import {Matrix3} from "./Matrix3";
import {dist, epsilon2, Object3, Vector} from "./Algebra";

/**
 * @brief couple of points
 * @details Represents a point of 3D affine space. [[Point3]] objects behave mostly like [[Vector3]] objects.
 *
 * - manipulate **relative and absolute** coordinates `origin`, `absolute`,  ...
 * - **affine geometry** displacement and origin changes `at`, `to`, ...
 *
 * See [[Vector]] for more details.
 */

export class Point3 extends Vector3 implements Vector, Object3 {

    dim: Readonly<number> = 3;

    /** coordinates of the origin*/
    private readonly _origin: Vector3;

    /** construct a point by giving it's position */
    constructor(x: number, y: number, z: number, origin = Vector3.zeros) {
        super(x, y, z);
        this._origin = origin;
    }

    /** origin of the point */
    get origin(): Vector3 {
        return this._origin;
    }

    set origin(newOrigin) {
        let ox = newOrigin[0],
            oy = newOrigin[1],
            oz = newOrigin[2];
        this[0] += this._origin[0] - ox;
        this[1] += this._origin[1] - oy;
        this[2] += this._origin[2] - oz;
        this._origin[0] = ox;
        this._origin[1] = oy;
        this._origin[2] = oz;
    }

    /** position from origin `(0, 0, 0)`*/
    get absolute(): Vector3 {
        const x = this[0] + this._origin[0],
            y = this[1] + this._origin[1],
            z = this[2] + this._origin[2];
        return new Vector3(x, y, z);
    }

    set absolute(newAbsolute) {
        this[0] = newAbsolute[0] - this._origin[0];
        this[1] = newAbsolute[1] - this._origin[1];
        this[2] = newAbsolute[2] - this._origin[2];
    }

    assign(x: number, y: number, z: number): this {
        super.assign(x, y, z);
        return this;
    }

    copy(p: Point3): this {
        this._origin.copy(p._origin);
        super.copy(p);
        return this;
    }

    clone(): Point3 {
        return new Point3(this[0], this[1], this[2], this._origin);
    }

    reset0(): this {
        super.reset0();
        return this;
    }

    reset1(): this {
        super.reset1();
        return this;
    }

    random(): this {
        super.random();
        return this;
    }

    floor(): this {
        super.floor();
        return this;
    }

    floorc(): Point3 {
        return this.clone().floor();
    }

    ceil(): this {
        super.ceil();
        return this;
    }

    ceilc(): Point3 {
        return this.clone().ceil();
    }

    round(): this {
        super.round();
        return this;
    }

    roundc(): Point3 {
        return this.clone().round();
    }

    trunc(decimals: number): this {
        super.trunc(decimals);
        return this;
    }

    truncc(decimals: number): Point3 {
        return this.clone().trunc(decimals);
    }

    abs(): this {
        super.abs();
        return this;
    }

    absc(): Point3 {
        return this.clone().abs();
    }

    min(p: Point3): this {
        const u = p._at(this._origin);
        this[0] = Math.min(this[0], u[0]);
        this[1] = Math.min(this[1], u[1]);
        this[2] = Math.min(this[2], u[2]);
        return this;
    }

    minc(p: Point3): Point3 {
        return this.clone().min(p);
    }

    max(p: Point3): this {
        const u = p._at(this._origin);
        this[0] = Math.max(this[0], u[0]);
        this[1] = Math.max(this[1], u[1]);
        this[2] = Math.max(this[2], u[2]);
        return this;
    }

    maxc(p: Point3): Point3 {
        return this.clone().max(p);
    }

    fill(s: number): this {
        super.fill(s);
        return this;
    }

    fillc(s: number): Point3 {
        return this.clone().fill(s);
    }

    norm(): this {
        super.norm();
        return this;
    }

    normc(): Point3 {
        return this.clone().norm();
    }

    add(p: Point3): this {
        this[0] += p[0] + p._origin[0] - this._origin[0];
        this[1] += p[1] + p._origin[1] - this._origin[1];
        this[2] += p[2] + p._origin[2] - this._origin[2];
        return this;
    }

    addc(p: Point3): Point3 {
        return this.clone().add(p);
    }

    sub(p: Point3): this {
        this[0] -= p[0] - p._origin[0] + this._origin[0];
        this[1] -= p[1] - p._origin[1] + this._origin[1];
        this[2] -= p[2] - p._origin[2] + this._origin[2];
        return this;
    }

    subc(p: Point3): Point3 {
        return this.sub(p).clone();
    }

    neg(): this {
        super.neg();
        return this;
    }

    negc(): Point3 {
        return this.clone().neg();
    }

    mul(s: number): this {
        super.mul(s);
        return this;
    }

    mulc(s: number): Point3 {
        return this.clone().mul(s);
    }

    div(s: number): this {
        super.div(s);
        return this;
    }

    divc(s: number): Point3 {
        return this.clone().div(s);
    }

    comb(s: number, p: Point3): this {
        const u = p._at(this._origin);
        this[0] = s * u[0] + this[0];
        this[1] = s * u[1] + this[1];
        this[2] = s * u[2] + this[2];
        return this;
    }

    combc(s: number, p: Point3): Point3 {
        return this.clone().comb(s, p);
    }

    lerp(p: Point3, t: number): this {
        const x = this[0] + this._origin[0],
            y = this[1] + this._origin[1],
            z = this[2] + this._origin[2];
        const px = p[0] + p._origin[0],
            py = p[1] + p._origin[1],
            pz = p[2] + p._origin[2];
        this[0] += (px - x) * t;
        this[1] += (py - y) * t;
        this[2] += (pz - z) * t;
        return this;
    }

    lerpc(p: Point3, t: number) {
        return this.clone().lerp(p, t);
    }

    herp(p: Point3, p1: Point3, p2: Point3, s: number): this {
        const s2 = s * s,
            t0 = s2 * (2 * s - 3) + 1,
            t1 = s2 * (s - 2) + s,
            t2 = s2 * (s - 1),
            t3 = s2 * (3 - 2 * s);
        const u = p._at(this._origin),
            u1 = p1._at(this._origin),
            u2 = p2._at(this._origin);

        this[0] = this[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this[1] = this[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this[2] = this[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
        return this;
    }

    herpc(p: Point3, p1: Point3, p2: Point3, s: number): Point3 {
        return this.clone().herp(p, p1, p2, s);
    }

    berp(p: Point3, p1: Point3, p2: Point3, s: number): this {
        const s2 = s * s,
            inv = 1 - s,
            inv2 = inv * inv,
            t0 = inv2 * inv,
            t1 = 3 * s * inv2,
            t2 = 3 * s2 * inv,
            t3 = s2 * s;
        const u = p._at(this._origin),
            u1 = p1._at(this._origin),
            u2 = p2._at(this._origin);

        this[0] = this[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this[1] = this[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this[2] = this[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
        return this;
    }

    berpc(p: Point3, p1: Point3, p2: Point3, s: number): Point3 {
        return this.clone().berp(p, p1, p2, s);
    }

    der(ds: number, p: Point3): this {
        const u = p._at(this._origin);
        this[0] = (this[0] - u[0]) / ds;
        this[1] = (this[1] - u[1]) / ds;
        this[2] = (this[2] - u[2]) / ds;
        return this;
    }

    derc(ds: number, p: Point3): Point3 {
        return this.clone().der(ds, p);
    }

    trans(): this {
        return this;
    }

    transc(): Point3 {
        return this.clone().trans();
    }

    prod(p: Point3): this {
        this[0] *= p[0] + p._origin[0] - this._origin[0];
        this[1] *= p[1] + p._origin[1] - this._origin[1];
        this[2] *= p[2] + p._origin[2] - this._origin[2];
        return this;
    }

    prodc(p: Point3) {
        return this.clone().prod(p);
    }

    inv(): this {
        super.inv();
        return this;
    }

    invc(): Point3 {
        return this.clone().inv();
    }

    dot(p: Point3): number {
        const u = p._at(this._origin);
        return this[0] * u[0] + this[1] * u[1] + this[2] * u[2];
    }

    dist(p: Point3): number {
        return dist(this, p);
    }

    dist1(vector: Point3): number {
        return 0;
    }

    dist2(p: Point3): number {
        const u = p._at(this._origin);
        const dx = this[0] - u[0],
            dy = this[1] - u[1],
            dz = this[2] - u[2];
        return dx * dx + dy * dy + dz * dz;
    }

    exact(vector: Vector): boolean {
        return false;
    }


    equal1(vector: Vector): boolean {
        return false;
    }


    equal2(p: Point3): boolean {
        return this.dist2(p) < epsilon2;
    }

    nil(): boolean {
        return false;
    }


    zero1(): boolean {
        return false;
    }


    zero2(): boolean {
        const x = this[0],
            y = this[1],
            z = this[2];
        return x * x + y * y + z * z < epsilon2;
    }

    array(): number[] {
        return [...this, ...this._origin];
    }

    string(): string {
        return `O ${this._origin.string()}\tP - O ${super.string()}`;
    }

    /** position from given origin */
    at(origin: Vector3): Vector3 {
        return Vector3.array(this._at(origin));
    }

    /** displacement vector between two points pointing at `p` */
    to(p: Point3): Vector3 {
        return Vector3.array(this._to(p));
    }

    /**
     * @brief translate a point by a given vector
     * @param u vector of translation
     */
    translate(u: Vector3): this {
        super.add(u);
        return this;
    }

    /**
     * @brief apply a transformation matrix to the position of a point
     * @param m matrix of transformation
     */
    transform(m: Matrix3): this {
        m.prodv(this);
        return this;
    }

    /**
     * @brief apply an affine transform to the position of the point
     * @param m matrix of transformation
     * @param u vector of translation
     */
    affine(m: Matrix3, u: Vector3): this {
        return this.transform(m).translate(u);
    }

    private _at(origin: Vector3): number[] {
        const x = this[0] + this._origin[0] - origin[0],
            y = this[1] + this._origin[1] - origin[1],
            z = this[2] + this._origin[2] - origin[2];
        return [x, y, z];
    }

    private _to(p: Point3): number[] {
        const x = p[0] - this[0] - this._origin[0] + p._origin[0],
            y = p[1] - this[1] - this._origin[1] + p._origin[1],
            z = p[2] - this[2] - this._origin[2] + p._origin[2];
        return [x, y, z];
    }

    static get dim(): number {
        return 3;
    }

    /** point located at absolute 0 */
    static get zeros(): Point3 {
        return new Point3(0, 0, 0);
    }

    /**
     * @brief point located at 0 from origin
     * @param origin position of the origin
     */
    static origin(origin: Vector3): Point3 {
        return new Point3(origin[0], origin[1], origin[2], origin);
    }

    /**
     * @brief point from array
     * @param arr array containing coordinates of both position and origin
     * */
    static array(arr: number[]): Point3 {
        return new Point3(arr[0], arr[1], arr[2], new Vector3(arr[3], arr[4], arr[5]));
    }

    /**
     * @brief point at given position as vector
     * @param position position of the point
     * @param origin origin of the point
     */
    static at(position: Vector3, origin = Vector3.zeros): Point3 {
        return new Point3(position[0], position[1], position[2], origin);
    }
}