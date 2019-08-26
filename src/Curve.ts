import Vector from "./Vector";
import Matrix from "./Matrix";

/**
 * ## Brief
 * [[Curve]] represent a parametrized curve in an arbitrary vector space.
 *
 * ## Main features
 *
 * - LIFO of vectors `push`, `pop`
 * - linear interpolation of position, speed, length
 * - manipulate geometrical origin of the point `origin`
 * - **geometrical transforms** `translate`, `affine`, ...
 *
 * ## Getting started
 *
 *
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */

export default class Curve {

    /** position vectors representing the curve */
    positions: Vector[];

    private readonly _origin: Vector;

    /** array of duration between each successive position. Must be of length  `position.length - 1`. **/
    dt: number[];

    constructor(positions: Vector[] = [], origin?: Vector, dt: number[] | number = 1) {
        this.positions = positions;
        this._origin = origin || positions[0].clone().reset0();
        this.dt = (typeof dt == "number") ? Array(Math.max(positions.length - 1, 0)).fill(dt) : dt;
    }

    /** initial position of the mobile **/
    get first() {
        return this.positions[0];
    }

    set first(newFirst) {
        this.positions[0] = newFirst;
    }

    /** final position of the mobile **/
    get last() {
        return this.positions[this.positions.length - 1];
    }

    set last(newLast) {
        this.positions[this.positions.length - 1] = newLast;
    }

    /** position of the mobile next to last **/
    get nexto() {
        return this.positions[this.positions.length - 2];
    }


    set nexto(newLast) {
        this.positions[this.positions.length - 2] = newLast;
    }

    /** origin of the curve */
    get origin(): Vector {
        return this._origin;
    }

    set origin(newOrigin: Vector) {
        this.positions.forEach(position => {
            position.add(this._origin).sub(newOrigin);
        });
        this._origin.copy(newOrigin);
    }

    /**
     * @brief add a new position to the trajectory
     * @details If you let `dt` undefined, then the method will take the last added step if it exists.
     * @param position position of the mobile
     * @param dt time step elapsed since `last` position
     * @returns reference to `this`
     */
    push(position: Vector, dt?: number): this {
        this.dt.push(dt || this.dt[this.dt.length - 1] || 1);
        this.positions.push(position);
        return this;
    }

    pop(): [Vector, number] {
        return [this.positions.pop(), this.dt.pop()];
    }

    /**
     * @brief clears the curve
     * @details Removes all position and steps.
     * @returns reference to `this`
     */
    clear(): this {
        this.positions = [];
        this.dt = [];
        return this;
    }

    translate(u: Vector) {
        this.positions.forEach((position) => {
            position.add(u)
        });
        return this;
    }

    transform(m: Matrix) {
        this.positions.forEach((position) => {
            m.prodv(position);
        });
        return this;
    }

    affine(m: Matrix, v: Vector) {
        this.positions.forEach((position) => {
            m.prodv(position).add(v);
        });
        return this;
    }

    /**
     * @brief position on parametrized curve
     * @param x parameter between `0` and `1`
     * @returns value of position at `x`
     */
    position(x: number = 1): Vector {
        const scale = x * (this.positions.length - 1),
            i0 = Math.floor(scale), i1 = Math.min(this.positions.length - 1, (i0 + 1));
        return this.positions[i0].lerpc(this.positions[i1], scale - i0);
    }

    /**
     * @brief speed on parametrized curve
     * @param x parameter between `0` and `1`
     * @returns value of position at `x`
     */
    speed(x: number = 1): Vector {
        const scale = x * (this.positions.length - 1),
            i0 = Math.min(this.positions.length - 2, Math.floor(scale)), i1 = i0 + 1;
        return this.positions[i1].derc(this.dt[i0], this.positions[i0]);
    }

    /**
     * @brief duration on parametrized curve
     * @details Duration is the accumulated time steps `this.dt` since the starting point of the curve
     * @param x parameter between `0` and `1`
     * @returns value of the duration at `x`
     */
    duration(x: number = 1): number {
        const scale = x * (this.positions.length - 1), i0 = Math.floor(scale);
        return this.dt.slice(0, i0).reduce((acc, dt) => acc + dt, 0) + (scale - i0) * this.dt[Math.min(this.dt.length - 1, i0)];
    }

    length(x: number = 1): number {
        const scale = x * (this.positions.length - 1),
            i0 = Math.floor(scale), i1 = Math.min(this.positions.length - 1, (i0 + 1));

        let length = 0;
        for (let i = 1; i <= i0; i++)
            length += this.positions[i].dist(this.positions[i - 1]);

        return length + this.positions[i1].dist(this.positions[i0]) * (scale - i0);
    }

    /**
     * @brief generates an constant curve ie. a point.
     * @details The position is constant and step is non null
     * @param u position of the point
     * @param size number of samples
     * @param dt time step
     */
    static zeros(u: Vector, size: number, dt: number[] | number = 1) {
        let array = [];
        for (let i = 0; i < size; i++)
            array.push(u.clone());

        return new Curve(array, u.clone().reset0(), dt);
    }

    static graph(f: (t: number) => Vector, a: number, b: number, dt: number = 1) {
        let array = [];
        for (let x = a; x < b; x += dt)
            array.push(f(x));

        return new Curve(array, f(a).reset0(), dt);
    }
}