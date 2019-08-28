import Vector from "./int/Vector";
import Matrix from "./int/Matrix";

/**
 * ## Brief
 * [[Curve]] represents a parametrized curve in an arbitrary affine space.
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
 * A curve is a discrete set of [[Vector]] objects that describes a polygonal curve in ND-space.
 * The curve can be parametrized with different speeds. It also has an origin that is common to all points
 *
 * ### Create a curve
 *
 * First create a set of vectors that represents the polygonal curve and a choose a time step.
 * ```js
 * let positions = [Vector3.ex, Vector3.ey, Vector3.exn, Vector3.eyn];
 * let dt = 0.1;
 * ```
 *
 * If you want to set a variable time step along the curve :
 * ```js
 * let dt = [0.1, 0.01, 1];
 * ```
 *
 * **Note** If `positions` is of size **N** then `dt` is of size **N-1**.
 *
 * Then choose your origin and construct the curve :
 *
 * ```js
 * let curve = new Curve(positions, Vector3.zeros, dt); // origin is (0, 0, 0)
 * ```
 *
 * **Note** It's preferable that the origin does not reference an object contained in the `positions` array and that references
 * in `positions` points to different instances.
 *
 * ### Positions
 * The `positions` array stores position of curve samples relative to `this.origin`, when affecting a new origin,
 * the new relative positions are recomputed. It's the same process as what was done for [[Point3]] class.
 *
 * ### LIFO Structure
 * You can push/pop elements of the curve.
 * When pushing you can specify the position vector to insert but also the time step elapsed between the last
 * stored and the position to add.
 *
 * #### Example
 * ```js
 * curve.push(Vector3.ez) // push with default value of time step
 * curve.push(Vector3.ez, 0.1) // push with given value of time step
 * ```
 *
 * However when popping a value a couple `[lastPosition, lastTimeStep]` is always returned.
 *
 * ### Interpolation
 *
 * As polygonal curves, we can perform linear interpolation between two points of the curve. This allows
 * to get the speed, position along the curve as if it was a polygonal continuous curve.
 *
 * To interpolate any variable use `x` parameter, a real value between `0` and `1`
 *
 * #### Example
 * ```js
 * let u = curve.position(0.5); // middle point of the curve
 * let v = curve.length(1); // total length of the curve
 * let w = curve.speed(0); // initial speed of the curve
 * ```
 *
 * ### Translation and Transformation
 * Apply matrix transform, translations, affine transforms, ...
 *
 * ```js
 * curve.translate(u);
 * curve.transform(m);
 * curve.affine(m, u);
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