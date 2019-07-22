import {dist, epsilon2, mag, mag2, Vector} from "./Algebra";

/**
 * @brief 3D Vectors
 * @details Represents numeric vectors of dimension 3.
 *
 * - **geometrical operations** `angle`, `cross`, `dist`, ...
 *
 * - **many coordinates system** accessors `x`, `y`, `z`, `r`, `theta`, `lat`, `lon` ...
 *
 * - **basis generators** like `ex`, `er`, `e(k)`, ...
 *
 * - **rotations** around `x`, `y`, `z` and custom angles
 *
 * - inherits from `Float64Array` in order to provide double precision computation
 */
export class Vector3 extends Float64Array implements Vector {

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

    /** magnitude of the vector */
    get mag(): number {
        return mag(this);
    }

    /** squared magnitude of the vector */
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
    constructor(x: number, y: number, z: number = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    equal(u: Vector3): boolean {
        return this.dist2(u) < epsilon2;
    }

    zero(): boolean {
        const x = this[0],
            y = this[1],
            z = this[2];
        return x * x + y * y + z * z < epsilon2;
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

    lerp(u: Vector3, t: number): this {
        this[0] += (u[0] - this[0]) * t;
        this[1] += (u[1] - this[1]) * t;
        this[2] += (u[2] - this[2]) * t;
        return this;
    }

    lerpc(u: Vector3, t: number): Vector3 {
        return this.clone().lerp(u, t);
    }

    trans(): this {
        return this;
    }

    transc(): Vector3 {
        return this.clone();
    }

    /** hadamard product of two vectors*/
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
        return dist(this, u);
    }

    dist2(u: Vector3): number {
        const dx = this[0] - u[0],
            dy = this[1] - u[1],
            dz = this[2] - u[2];
        return dx * dx + dy * dy + dz * dz;
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

    /** angle between two vectors in radians */
    angle(u: Vector3): number {
        const t1 = this.normc(), u1 = u.normc();
        return Math.acos(t1.dot(u1));
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

    /** cosine of the angle between two vector */
    cos(u: Vector3): number {
        const t1 = this.normc(), u1 = u.normc();
        return t1.dot(u1);
    }

    /** @brief rotates the vector around `x`
     *  @details Anticlockwise rotation.
     *  @param theta angle of rotation
     *  @param cos `x` metric function of the rotation
     *  @param sin `y` metric function of the rotation
     * */
    rotX(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta), y = this[1], z = this[2];
        this[1] = y * c - z * s;
        this[2] = y * s + z * c;
        return this;
    }

    /** @brief rotates the vector around `y` axis
     *  @details Anticlockwise rotation.
     *  @param theta angle of rotation
     *  @param cos `x` metric function of the rotation
     *  @param sin `y` metric function of the rotation
     **/
    rotY(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = -sin(theta), x = this[0], z = this[2];
        this[0] = x * c + z * s;
        this[2] = x * s - z * c;
        return this;
    }

    /** @brief rotates the vector around `z` axis
     *  @details Anticlockwise rotation.
     *  @param theta angle of rotation
     *  @param cos `x` metric function of the rotation
     *  @param sin `y` metric function of the rotation
     *  */
    rotZ(theta: number, cos = Math.cos, sin = Math.sin): this {
        const c = cos(theta), s = sin(theta), x = this[0], y = this[1];
        this[0] = x * c - y * s;
        this[1] = x * s + y * c;
        return this;
    }

    /** @brief rotates the vector around given axis
     *  @details Anticlockwise rotation.
     *  @param u axis of rotation
     *  @param theta angle of rotation
     *  @param cos `x` metric function of the rotation
     *  @param sin `y` metric function of the rotation
     **/
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

    static get dim(): number {
        return 3;
    }

    /** vector filled with `0` */
    static get zeros(): Vector3 {
        return new Vector3(0, 0);
    }

    /** vector filled with `1` */
    static get ones(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /** vector filled with `s` */
    static scalar(s: number): Vector3 {
        return new Vector3(s, s, s);
    }

    /** vector with given cylindrical coordinates */
    static rthz(rxy: number, theta: number, z: number): Vector3 {
        return new Vector3(rxy * Math.cos(theta), rxy * Math.sin(theta), z);
    }

    /** vector with given spherical coordinates */
    static rthph(r: number, theta: number, phi: number): Vector3 {
        const s = r * Math.sin(phi);
        return new Vector3(s * Math.cos(theta), s * Math.sin(theta), r * Math.cos(phi));
    }

    /** first vector of canonical basis */
    static get ex(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    /** second vector of canonical basis */
    static get ey(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    /** third vector of canonical basis */
    static get ez(): Vector3 {
        return new Vector3(0, 0, 1);
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
     * Note that this vector also correspond to the prograde vector of cylindrical basis.
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