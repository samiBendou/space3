import {Vector3} from "./Vector3";
import {Matrix3} from "./Matrix3";
import {dist, epsilon2, mag, mag2, Object3, Vector} from "./Algebra";

/**
 * @brief couple of points
 * @details Represents a point of 3D affine space. [[Point3]] objects behave mostly like [[Vector3]] objects.
 *
 * - Each point comes with it's own origin
 *
 * - addition and subtraction following Chalses's relation
 *
 * - manipulate **relative and absolute** coordinates `position`, `absolute`, `at`, ...
 *
 * - **affine geometry** displacement and origin changes `origin`, `to`, ...
 */

export class Point3 implements Vector, Object3 {

    dim: Readonly<number> = 3;

    /** relative coordinates of the point */
    position: Vector3;

    /** coordinates of the origin*/
    private readonly _origin: Vector3;

    /** construct a point by giving it's position */
    constructor(position = Vector3.zeros, origin = Vector3.zeros) {
        this.position = position;
        this._origin = origin.clone();
    }

    get x(): number {
        return this.position[0];
    }

    set x(newX) {
        this.position[0] = newX;
    }

    get y(): number {
        return this.position[1];
    }

    set y(newY) {
        this.position[1] = newY;
    }

    get z(): number {
        return this.position[2];
    }

    set z(newZ) {
        this.position[2] = newZ;
    }

    get xyz(): [number, number, number] {
        return [this.position[0], this.position[1], this.position[2]];
    }

    set xyz(coordinates: [number, number, number]) {
        this.position[0] = coordinates[0];
        this.position[1] = coordinates[1];
        this.position[2] = coordinates[2];
    }

    get mag(): number {
        return mag(this.position);
    }

    get mag2(): number {
        return mag2(this.position);
    }

    get origin(): Vector3 {
        return this._origin;
    }

    set origin(newOrigin) {
        let ox = newOrigin[0],
            oy = newOrigin[1],
            oz = newOrigin[2];
        this.position[0] += this._origin[0] - ox;
        this.position[1] += this._origin[1] - oy;
        this.position[2] += this._origin[2] - oz;
        this._origin[0] = ox;
        this._origin[1] = oy;
        this._origin[2] = oz;
    }

    get absolute(): Vector3 {
        const x = this.position[0] + this._origin[0],
            y = this.position[1] + this._origin[1],
            z = this.position[2] + this._origin[2];
        return new Vector3(x, y, z);
    }

    set absolute(newAbsolute) {
        this.position[0] = newAbsolute[0] - this._origin[0];
        this.position[1] = newAbsolute[1] - this._origin[1];
        this.position[2] = newAbsolute[2] - this._origin[2];
    }

    assign(x: number, y: number, z: number = 0): this {
        this.position.assign(x, y, z);
        return this;
    }

    copy(p: Point3): this {
        this._origin.copy(p._origin);
        this.position.copy(p.position);
        return this;
    }

    clone(): Point3 {
        return new Point3(this.position, this._origin);
    }

    reset0(): this {
        this.position.reset0();
        return this;
    }

    reset1(): this {
        this.position.reset1();
        return this;
    }

    random(): this {
        this.position.random();
        return this;
    }

    floor(): this {
        this.position.floor();
        return this;
    }

    floorc(): Point3 {
        return this.clone().floor();
    }

    ceil(): this {
        this.position.ceil();
        return this;
    }

    ceilc(): Point3 {
        return this.clone().ceil();
    }

    round(): this {
        this.position.round();
        return this;
    }

    roundc(): Point3 {
        return this.clone().round();
    }

    trunc(decimals: number): this {
        this.position.trunc(decimals);
        return this;
    }

    truncc(decimals: number): Point3 {
        return this.clone().trunc(decimals);
    }

    abs(): this {
        this.position.abs();
        return this;
    }

    absc(): Point3 {
        return this.clone().abs();
    }

    min(p: Point3): this {
        const u = p._at(this._origin);
        this.position[0] = Math.min(this.position[0], u[0]);
        this.position[1] = Math.min(this.position[1], u[1]);
        this.position[2] = Math.min(this.position[2], u[2]);
        return this;
    }

    minc(p: Point3): Point3 {
        return this.clone().min(p);
    }

    max(p: Point3): this {
        const u = p._at(this._origin);
        this.position[0] = Math.max(this.position[0], u[0]);
        this.position[1] = Math.max(this.position[1], u[1]);
        this.position[2] = Math.max(this.position[2], u[2]);
        return this;
    }

    maxc(p: Point3): Point3 {
        return this.clone().max(p);
    }

    fill(s: number): this {
        this.position.fill(s);
        return this;
    }

    fillc(s: number): Point3 {
        return this.clone().fill(s);
    }

    norm(): this {
        this.position.norm();
        return this;
    }

    normc(): Point3 {
        return this.clone().norm();
    }

    add(p: Point3): this {
        this.position[0] += p.position[0] + p._origin[0] - this._origin[0];
        this.position[1] += p.position[1] + p._origin[1] - this._origin[1];
        this.position[2] += p.position[2] + p._origin[2] - this._origin[2];
        return this;
    }

    addc(p: Point3): Point3 {
        return this.clone().add(p);
    }

    sub(p: Point3): this {
        this.position[0] -= p.position[0] - p._origin[0] + this._origin[0];
        this.position[1] -= p.position[1] - p._origin[1] + this._origin[1];
        this.position[2] -= p.position[2] - p._origin[2] + this._origin[2];
        return this;
    }

    subc(p: Point3): Point3 {
        return this.sub(p).clone();
    }

    neg(): this {
        this.position.neg();
        return this;
    }

    negc(): Point3 {
        return this.clone().neg();
    }

    mul(s: number): this {
        this.position.mul(s);
        return this;
    }

    mulc(s: number): Point3 {
        return this.clone().mul(s);
    }

    div(s: number): this {
        this.position.div(s);
        return this;
    }

    divc(s: number): Point3 {
        return this.clone().div(s);
    }

    comb(s: number, p: Point3): this {
        const u = p._at(this._origin);
        this.position[0] = s * u[0] + this.position[0];
        this.position[1] = s * u[1] + this.position[1];
        this.position[2] = s * u[2] + this.position[2];
        return this;
    }

    combc(s: number, p: Point3): Point3 {
        return this.clone().comb(s, p);
    }

    lerp(p: Point3, t: number): this {
        const x = this.position[0] + this._origin[0],
            y = this.position[1] + this._origin[1],
            z = this.position[2] + this._origin[2];
        const px = p.position[0] + p._origin[0],
            py = p.position[1] + p._origin[1],
            pz = p.position[2] + p._origin[2];
        this.position[0] += (px - x) * t;
        this.position[1] += (py - y) * t;
        this.position[2] += (pz - z) * t;
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

        this.position[0] = this.position[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this.position[1] = this.position[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this.position[2] = this.position[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
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

        this.position[0] = this.position[0] * t0 + u1[0] * t1 + u2[0] * t2 + u[0] * t3;
        this.position[1] = this.position[1] * t0 + u1[1] * t1 + u2[1] * t2 + u[1] * t3;
        this.position[2] = this.position[2] * t0 + u1[2] * t1 + u2[2] * t2 + u[2] * t3;
        return this;
    }

    berpc(p: Point3, p1: Point3, p2: Point3, s: number): Point3 {
        return this.clone().berp(p, p1, p2, s);
    }

    der(ds: number, p: Point3): this {
        const u = p._at(this._origin);
        this.position[0] = (this.position[0] - u[0]) / ds;
        this.position[1] = (this.position[1] - u[1]) / ds;
        this.position[2] = (this.position[2] - u[2]) / ds;
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
        this.position[0] *= p.position[0] + p._origin[0] - this._origin[0];
        this.position[1] *= p.position[1] + p._origin[1] - this._origin[1];
        this.position[2] *= p.position[2] + p._origin[2] - this._origin[2];
        return this;
    }

    prodc(p: Point3) {
        return this.clone().prod(p);
    }

    inv(): this {
        this.position.inv();
        return this;
    }

    invc(): Point3 {
        return this.clone().inv();
    }

    dot(p: Point3): number {
        const u = p._at(this._origin);
        return this.position[0] * u[0] + this.position[1] * u[1] + this.position[2] * u[2];
    }

    dist(p: Point3): number {
        return dist(this, p);
    }

    dist1(vector: Point3): number {
        return 0;
    }

    dist2(p: Point3): number {
        const u = p._at(this._origin);
        const dx = this.position[0] - u[0],
            dy = this.position[1] - u[1],
            dz = this.position[2] - u[2];
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
        const x = this.position[0],
            y = this.position[1],
            z = this.position[2];
        return x * x + y * y + z * z < epsilon2;
    }

    array(): number[] {
        return [...this.position, ...this.origin];
    }

    string(): string {
        return `O ${this._origin.string()}\tP - O ${this.position.string()}`;
    }

    /** position from given origin */
    at(origin: Vector3): Vector3 {
        return Vector3.array(this._at(origin));
    }

    /** displacement vector between two points pointing at `p` */
    to(p: Point3): Vector3 {
        return Vector3.array(this._to(p));
    }

    /** translate a point by a given vector */
    translate(u: Vector3): this {
        this.position[0] += u[0];
        this.position[1] += u[1];
        this.position[2] += u[2];
        return this;
    }

    /** apply a transformation matrix to the position of a point */
    transform(m: Matrix3): this {
        let x = this.position[0],
            y = this.position[1],
            z = this.position[2];
        this.position[0] = m[0] * x + m[3] * y + m[6] * z;
        this.position[1] = m[1] * x + m[4] * y + m[7] * z;
        this.position[2] = m[2] * x + m[5] * y + m[8] * z;
        return this;
    }

    /** apply an affine transform to the position of the point */
    affine(m: Matrix3, u: Vector3): this {
        return this.transform(m).translate(u);
    }

    private _at(origin: Vector3): number[] {
        const x = this.position[0] + this._origin[0] - origin[0],
            y = this.position[1] + this._origin[1] - origin[1],
            z = this.position[2] + this._origin[2] - origin[2];
        return [x, y, z];
    }

    private _to(p: Point3): number[] {
        const x = p.position[0] - this.position[0] - this._origin[0] + p._origin[0],
            y = p.position[1] - this.position[1] - this._origin[1] + p._origin[1],
            z = p.position[2] - this.position[2] - this._origin[2] + p._origin[2];
        return [x, y, z];
    }

    static get dim(): number {
        return 3;
    }

    /** point located at it's origin */
    static zeros(origin = Vector3.zeros): Point3 {
        return new Point3(origin, origin);
    }

    /** point from array containing coordinates of both position and origin */
    static array(arr: number[]): Point3 {
        return new Point3(new Vector3(arr[0], arr[1], arr[2]), new Vector3(arr[3], arr[4], arr[5]));
    }

    /** point with given cartesian coordinates of position */
    static xyz(x: number, y: number, z: number, origin = Vector3.zeros): Point3 {
        return new Point3(new Vector3(x, y, z), origin);
    }

    /** point with given cylindrical coordinates */
    static rthz(rxy: number, theta: number, z: number, origin = Vector3.zeros): Point3 {
        return new Point3(Vector3.rthz(rxy, theta, z), origin);
    }

    /** point with given spherical coordinates */
    static rthph(r: number, theta: number, phi: number, origin = Vector3.zeros): Point3 {
        return new Point3(Vector3.rthph(r, theta, phi), origin);
    }
}