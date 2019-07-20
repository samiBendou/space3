import {Vector3} from "./Vector3";
import {Matrix3} from "./Matrix3";
import {Vector} from "./Algebra";

/**
 * @brief couple of points
 * @details `Point3` class represents a point of 3D affine space. Each point comes with it own origin such that
 * operations between points are done considering that at the same origin.
 *
 * - behave mostly like [[Vector3]]
 *
 * - addition and subtraction following Chalses's relation
 *
 * - manipulate **relative and absolute** coordinates
 *
 */

export class Point3 implements Vector {

    dim: Readonly<number> = 3;

    /** relative coordinates of the point */
    position: Vector3;

    /** coordinates of the origin*/
    private _origin: Vector3;

    /** construct a point by giving it's position */
    constructor(position = Vector3.zeros, origin = Vector3.zeros) {
        this.position = position;
        this._origin = origin.copy();
    }

    get mag() {
        return this.position.mag;
    }

    get mag2() {
        return this.position.mag2;
    }

    get x() {
        return this.position.x;
    }

    set x(newX) {
        this.position.x = newX;
    }

    get y() {
        return this.position.y;
    }

    set y(newY) {
        this.position.y = newY;
    }

    get z() {
        return this.position.z;
    }

    set z(newZ) {
        this.position.z = newZ;
    }

    get xyz() {
        return this.position.xyz;
    }

    set xyz(coordinates) {
        this.position.xyz = coordinates;
    }

    get origin() {
        return this._origin;
    }

    set origin(newOrigin) {
        this.position.add(this._origin);
        this.position.sub(newOrigin);
        this._origin = newOrigin;
    }

    get absolute() {
        return this.position.addc(this._origin);
    }

    set absolute(newAbsolute) {
        this.position = newAbsolute.subc(this._origin);
    }

    copy() {
        return new Point3(this._origin, this.position);
    }

    reset0() {
        this.position.reset0();
        return this;
    }

    reset1() {
        this.position.reset1();
        return this;
    }

    norm() {
        this.position.norm();
        return this;
    }

    normc() {
        return this.copy().norm();
    }

    fill(s: number) {
        this.position.fill(s);
        return this;
    }

    fillc(s: number) {
        return this.copy().fill(s);
    }

    add(p: Point3) {
        this.position.add(p.position).add(p._origin).sub(this._origin);
        return this;
    }

    addc(p: Point3) {
        return this.copy().add(p);
    }

    sub(p: Point3) {
        this.position.sub(p.position).sub(p._origin).add(this._origin);
        return this;
    }

    subc(p: Point3) {
        return this.sub(p).copy();
    }

    neg() {
        this.position.neg();
        return this;
    }

    negc() {
        return this.copy().neg();
    }

    mul(s: number) {
        this.position.mul(s);
        return this;
    }

    mulc(s: number) {
        return this.copy().mul(s);
    }

    div(s: number) {
        this.position.div(s);
        return this;
    }

    divc(s: number) {
        return this.copy().div(s);
    }

    lerp(u: Vector3, t: number) {
        this.position.lerp(u, t);
        return this;
    }

    lerpc(u: Vector3, t: number) {
        return this.copy().lerp(u, t);
    }

    trans() {
        this.position.trans();
        return this;
    }

    transc() {
        return this.copy().trans();
    }

    prod(p: Point3) {
        this.position.prod(p.at(this._origin));
        return this;
    }

    prodc(p: Point3) {
        return this.copy().prod(p);
    }

    inv() {
        this.position.inv();
        return this;
    }

    invc() {
        return this.copy().inv();
    }

    dot(p: Point3) {
        return this.position.dot(p.at(this._origin));
    }

    dist(p: Point3) {
        return this.absolute.dist(p.absolute);
    }

    dist2(p: Point3): number {
        return this.absolute.dist2(p.absolute);
    }

    equal(p: Point3) {
        return this.absolute.equal(p.absolute);
    }

    zero() {
        return this.position.zero();
    }

    array(): number[] {
        return [...this.position.array(), ...this.origin.array()];
    }

    string() {
        return `O ${this._origin.string()}\tP - O ${this.position.string()}`;
    }

    /** position from given origin */
    at(origin : Vector3) {
        return this.position.addc(this._origin).sub(origin);
    }

    /** vector from this to other point */
    to(p : Point3) {
        return p.position.subc(this.position).sub(this._origin).add(p._origin);
    }

    angle(p : Point3) {
        return this.position.angle(p.at(this._origin));
    }

    translate(u: Vector3) {
        this.position.add(u);
        return this;
    }

    transform(m: Matrix3) {
        m.map(this.position);
        return this;
    }

    affine(m: Matrix3, v: Vector3) {
        return this.transform(m).translate(v);
    }

    static get dim() {
        return 3;
    }

    static zeros(origin = Vector3.zeros) {
        return new Point3(origin, origin);
    }

    static array(arr: number[]) {
        return new Point3(new Vector3(arr[0], arr[1], arr[2]), new Vector3(arr[3], arr[4], arr[5]));
    }

    static xyz(x : number, y : number, z : number, origin = Vector3.zeros) {
        return new Point3(new Vector3(x, y, z), origin);
    }

    /** point with given cylindrical coordinates */
    static rthz(rxy: number, theta: number, z: number, origin = Vector3.zeros) {
        return new Point3(Vector3.rthz(rxy, theta, z), origin);
    }

    /** point with given spherical coordinates */
    static rthph(r: number, theta: number, phi: number, origin = Vector3.zeros) {
        return new Point3(Vector3.rthph(r, theta, phi), origin);
    }
}