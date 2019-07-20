import {Vector, Encoder} from "./Algebra";

/**
 * @brief 3D Vectors
 * @details This class provides an implementation of numeric vectors of dimension 3.
 * The vectors are represented by their coordinates `x`, `y`, `z`.
 *
 * - **algebraical operations** between vectors `add`, `mul`, `prod`, `dot`, ...
 *
 * - **geometrical operations** `angle`, `cross`, `dist`, ...
 *
 * - **many coordinates system** accessors `r`, `theta`, `lat`, `lon` ...
 *
 * - **basis generators** like `ex`, `er`, `e(k)`, ...
 */
export class Vector3 implements Vector, Encoder {

    dim: Readonly<number> = 3;

    /** first cartesian coordinate */
    x: number;

    /** second cartesian coordinate */
    y: number;

    /** third cartesian coordinate */
    z: number;

    /** construct with cartesian coordinates */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /** cartesian coordinates of the vector */
    get xyz() {
        return [this.x, this.y, this.z];
    }

    set xyz(coordinates: [number, number, number]) {
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2];
    }

    /** magnitude of the vector */
    get mag() {
        return Math.sqrt(this.dot(this));
    }

    /** squared magnitude of the vector */
    get mag2() {
        return this.dot(this);
    }

    /** first spherical coordinate, length of the vector */
    get r() {
        return this.mag;
    }

    set r(newR) {
        this.rthph = [newR, this.theta, this.phi];
    }

    /** second cylindrical and spherical coordinate, counterclockwise angle formed with `ex` in radians */
    get theta() {
        return Math.atan2(this.y, this.x);
    }

    set theta(newTheta) {
        this.rthph = [this.r, newTheta, this.phi];
    }

    /** third spherical coordinate, clockwise angle formed with  `ez` in radians */
    get phi() {
        return Math.atan2(this.rxy, this.z);
    }

    set phi(newPhi) {
        this.rthph = [this.r, this.theta, newPhi];
    }

    /** first cylindrical coordinate, length of the projection of the vector on the plane formed with `ex`, `ey` */
    get rxy() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set rxy(newRxy) {
        this.rthz = [newRxy, this.theta, this.z];
    }

    /** latitude of the vector in radians */
    get lat() {
        return Math.PI / 2 - this.phi;
    }

    set lat(newLat) {
        this.rthph = [this.r, this.theta, Math.PI / 2 - newLat];
    }

    /** longitude of the vector in radians */
    get lon() {
        return this.theta <= Math.PI ? this.theta : this.theta - 2 * Math.PI;
    }

    set lon(newLat) {
        this.rthph = [this.r, newLat >= 0 ? newLat : newLat + 2 * Math.PI, this.phi];
    }

    /** cylindrical coordinates of the vector*/
    get rthz() {
        return [this.rxy, this.theta, this.z];
    }

    set rthz(coordinates: [number, number, number]) {
        this.x = coordinates[0] * Math.cos(coordinates[1]);
        this.y = coordinates[0] * Math.sin(coordinates[1]);
        this.z = coordinates[2];
    }

    /** spherical coordinates of the vector */
    get rthph() {
        return [this.r, this.theta, this.phi];
    }

    set rthph(coordinates: [number, number, number]) {
        this.x = coordinates[0] * Math.sin(coordinates[2]) * Math.cos(coordinates[1]);
        this.y = coordinates[0] * Math.sin(coordinates[2]) * Math.sin(coordinates[1]);
        this.z = coordinates[0] * Math.cos(coordinates[2]);
    }

    copy() {
        return new Vector3(this.x, this.y, this.z);
    }

    /** reset to an additive neutral element `0` */
    reset0() {
        return this.fill(0);
    }

    /** reset to a multiplicative neutral element `1` */
    reset1() {
        return this.fill(1);
    }

    fill(s: number) {
        this.x = s;
        this.y = s;
        this.z = s;
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

    add(u: Vector3) {
        this.x += u.x;
        this.y += u.y;
        this.z += u.z;
        return this;
    }

    addc(u: Vector3) {
        return this.copy().add(u);
    }

    sub(u: Vector3) {
        this.x -= u.x;
        this.y -= u.y;
        this.z -= u.z;
        return this;
    }

    subc(u: Vector3) {
        return this.copy().sub(u);
    }

    neg() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    negc() {
        return this.copy().neg();
    }

    mul(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    mulc(s: number) {
        return this.copy().mul(s);
    }

    div(s: number) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    divc(s: number) {
        return this.copy().div(s);
    }

    lerp(u: Vector3, t: number) {
        this.add(u.subc(this).mul(t));
        return this;
    }

    lerpc(u: Vector3, t: number) {
        return this.copy().lerp(u, t);
    }

    trans() {
        return this;
    }

    transc() {
        return this.copy();
    }

    /** hadamard product of two vectors*/
    prod(u: Vector3) {
        this.x *= u.x;
        this.y *= u.y;
        this.z *= u.z;
        return this;
    }

    prodc(u: Vector3) {
        return this.copy().prod(u);
    }

    inv() {
        this.x **= -1;
        this.y **= -1;
        this.z **= -1;
        return this;
    }

    invc() {
        return this.copy().inv();
    }

    dot(u: Vector3) {
        return this.x * u.x + this.y * u.y + this.z * u.z;
    }

    dist(u: Vector3) {
        return this.copy().sub(u).mag;
    }

    dist2(u: Vector3) {
        return this.copy().sub(u).mag2;
    }

    equal(u: Vector3) {
        return Math.abs(this.dist(u)) < Number.EPSILON;
    }

    zero() {
        return this.r < Number.EPSILON;
    }

    string() {
        let x = this.x.toExponential(2), y = this.y.toExponential(2), z = this.z.toExponential(2);
        return `(${x} ${y} ${z})`;
    }

    array() {
        return this.xyz;
    }

    /** cross product of two vector */
    cross(u: Vector3) {
        this.xyz = [
            this.y * u.z - this.z * u.y,
            this.z * u.x - this.x * u.z,
            this.x * u.y - this.y * u.x
        ];
        return this;
    }

    crossc(u: Vector3) {
        return this.copy().cross(u);
    }

    /** angle between two vector in radians */
    angle(u: Vector3) {
        return Math.atan(this.tan(u));
    }

    /** cosine of the angle between two vector */
    cos(u: Vector3) {
        return (!this.zero() && !u.zero()) ? this.dot(u) / (this.r * u.r) : 1;
    }

    /** sine of the angle between two vector */
    sin(u: Vector3) {
        return (!this.zero() && !u.zero()) ? this.copy().cross(u).r / (this.r * u.r) : 0;
    }

    /** tangent of the angle between two vector */
    tan(u: Vector3) {
        return this.sin(u) / this.cos(u);
    }

    static get dim() {
        return 3;
    }

    /** vector filled with `0` */
    static get zeros() {
        return new Vector3();
    }

    /** vector filled with `1` */
    static get ones() {
        return new Vector3(1, 1, 1);
    }

    /** vector filled with `s` */
    static scalar(s: number) {
        return new Vector3(s, s, s);
    }

    /** first vector of canonical basis */
    static get ex() {
        return new Vector3(1, 0, 0);
    }

    /** second vector of canonical basis */
    static get ey() {
        return new Vector3(0, 1, 0);
    }

    /** third vector of canonical basis */
    static get ez() {
        return new Vector3(0, 0, 1);
    }

    /**
     * @brief canonical basis vector
     * @example `e(0) == ex`, `e(1) == ey`, `e(2) == ez`.
     * @param k {number} order of the vector in basis
     */
    static e(k: number) {
        return new Vector3(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0);
    }

    /**
     * @brief radial vector of spherical basis
     * @param u position of local basis from origin
     */
    static er(u: Vector3) {
        return new Vector3(
            Math.sin(u.phi) * Math.cos(u.theta),
            Math.sin(u.phi) * Math.sin(u.theta),
            Math.cos(u.phi)
        );
    }

    /**
     * @brief prograde vector of spherical basis
     * @details Prograde vector is perpendicular to the radial vector and oriented in the positive `theta` direction.
     * Note that this vector also correspond to the prograde vector of cylindrical basis.
     * @param u position of local basis from origin
     */
    static etheta(u: Vector3) {
        return new Vector3(
            -Math.sin(u.theta),
            Math.cos(u.theta),
            0
        );
    }

    /**
     * @brief normal vector of spherical basis
     * @details Normal vector is perpendicular to the radial vector and oriented in the positive `phi` direction.
     * @param u position of local basis from origin
     */
    static ephi(u: Vector3) {
        return new Vector3(
            Math.cos(u.phi) * Math.cos(u.theta),
            Math.cos(u.phi) * Math.sin(u.theta),
            -Math.sin(u.phi)
        );
    }

    /** vector from coordinates of array in the form `[x, y, z]`*/
    static array(arr: number[]) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }

    /** vector with given cylindrical coordinates */
    static rthz(rxy: number, theta: number, z: number) {
        const u = new Vector3();
        u.rthz = [rxy, theta, z];
        return u;
    }

    /** vector with given spherical coordinates */
    static rthph(r: number, theta: number, phi: number) {
        const u = new Vector3();
        u.rthph = [r, theta, phi];
        return u;
    }
}