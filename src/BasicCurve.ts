import Matrix from "./common/Matrix";
import Vector from "./common/Vector";

/**
 * ## Brief
 * [[Curve]] represents a parametrized curve in an arbitrary affine space.
 *
 * ### Main features
 *
 * - **LIFO** of vectors `push`, `pop`
 * - **linear interpolation** of position, speed, length
 * - **manipulate origin** of the curve `origin`
 * - **geometrical transforms** `translate`, `affine`, ...
 *
 * ## Getting started
 *
 * A curve is a discrete set of [[Vector]] objects that describes a polygonal curve in ND-space.
 * It has an origin that is common to all points.
 * The curve can be parametrized with different speeds along it.
 *
 * ![Curve diagram](media://curve_diagram.png)
 *
 * ### Create a curve
 *
 * First create a set of vectors that represents the polygonal curve and a choose a time step.
 * ```js
 * let positions = [Vector3.ex, Vector3.ey, Vector3.exn, Vector3.eyn];
 * let dt = 0.1;
 * ```
 *
 * If you want to set a variable time step along the curve you can specify `dt` as an array
 * ```js
 * let dt = [0.1, 0.01, 1];
 * ```
 *
 * **Note** If `positions` is of size N then `dt` is of size N-1.
 *
 * Then choose your origin and construct the curve :
 *
 * ```js
 * const origin = Vector3.zeros
 * let curve = new Curve(positions, origin, dt); // origin is (0, 0, 0)
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
 * When pushing you have to specify the position vector to insert.
 * You can also specify a time step `dt` which correspond to the duration to perform a displacement from the last
 * stored to the position to insert.
 *
 * #### Example
 * ```js
 * curve.push(Vector3.ez) // push with default value of time step
 * curve.push(Vector3.ez, 0.1) // push with given value of time step
 * ```
 *
 * However when popping a value a couple with duration and position is always returned.
 *
 * #### Example
 * ```js
 * arr = curve.pop() // [u, dt]
 * ```
 *
 * ### Interpolation
 *
 * As polygonal curves, we can perform linear interpolation between two points of the curve. This allows
 * to get the speed, position and many other values along the curve as if it was a polygonal continuous curve.
 *
 * All the interpolation functions uses `x` parameter, a real value between `0` and `1` :
 * - `x = 0` denotes the starting of the curve
 * - `x = 1` denotes the ending of the curve
 * - `x = 0.5` denotes the middle of the curve
 *
 * ![Interpolation diagram](media://interpolation_diagram.png)
 *
 * **Note** γ denotes the position vector on the curve according to the parametrization with `x`.
 *
 * #### Example
 * ```js
 * let u = curve.position(0.5); // middle point of the curve
 * let v = curve.length(1); // total length of the curve
 * let w = curve.speed(0); // initial speed of the curve
 * ```
 *
 * ### Translation and Transformation
 * Apply matrix transform, translations and affine transforms the same way as for [[Point3]] class..
 *
 * ```js
 * curve.translate(u);
 * curve.transform(m);
 * curve.affine(m, u);
 *```
 * </br>
 * <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>
 */

export default class BasicCurve<T extends Vector> {
  /** position vectors representing the curve */
  positions: T[];

  /**
   * array of duration elapsed for each displacement between two successive positions.
   * Must be of length  `position.length - 1`.
   */
  dt: number[];

  /** explicitly construct a curve by giving, positions, origins and time step(s) */
  constructor(positions: T[] = [], dt: number[] | number = 1) {
    this.positions = positions;
    this.dt =
      typeof dt == "number"
        ? Array(Math.max(positions.length - 1, 0)).fill(dt)
        : dt;
  }

  /** initial position vector of the curve **/
  get first() {
    return this.positions[0];
  }

  set first(newFirst) {
    this.positions[0] = newFirst;
  }

  /** final position vector of the curve **/
  get last() {
    return this.positions[this.positions.length - 1];
  }

  set last(newLast) {
    this.positions[this.positions.length - 1] = newLast;
  }

  /** position vector of the curve next to last **/
  get nexto() {
    return this.positions[this.positions.length - 2];
  }

  set nexto(newLast) {
    this.positions[this.positions.length - 2] = newLast;
  }

  /**
   * @brief add a new position to the trajectory
   * @details If you let `dt` undefined, then the method will take the last added step if it exists.
   * @param position position vector to insert
   * @param dt duration elapsed since `last` position
   */
  push(position: T, dt?: number): this {
    this.dt.push(dt || this.dt[this.dt.length - 1] || 1);
    this.positions.push(position);
    return this;
  }

  pop(): [T, number] {
    return [this.positions.pop(), this.dt.pop()];
  }

  /**
   * @brief clears the curve
   * @details Removes all position and steps.
   */
  clear(): this {
    this.positions = [];
    this.dt = [];
    return this;
  }

  translate(u: T) {
    this.positions.forEach((position) => {
      position.add(u);
    });
    return this;
  }

  transform<U extends Matrix>(m: U) {
    this.positions.forEach((position) => {
      m.prodv(position);
    });
    return this;
  }

  affine<U extends Matrix>(m: U, v: T) {
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
  position(x: number = 1): T {
    const scale = x * (this.positions.length - 1),
      i0 = Math.floor(scale),
      i1 = Math.min(this.positions.length - 1, i0 + 1);
    return this.positions[i0].lerpc(this.positions[i1], scale - i0) as T;
  }

  /**
   * @brief speed on parametrized curve
   * @param x parameter between `0` and `1`
   * @returns value of position at `x`
   */
  speed(x: number = 1): T {
    const scale = x * (this.positions.length - 1),
      i0 = Math.min(this.positions.length - 2, Math.floor(scale)),
      i1 = i0 + 1;
    return this.positions[i1].derc(this.dt[i0], this.positions[i0]) as T;
  }

  /**
   * @brief duration on parametrized curve
   * @details It's the total duration to go from position at `0` to position at `x` according to the parametrization of the curve.
   * @param x parameter between `0` and `1`
   * @returns value of the duration at `x`
   */
  duration(x: number = 1): number {
    const scale = x * (this.positions.length - 1),
      i0 = Math.floor(scale);
    return (
      this.dt.slice(0, i0).reduce((acc, dt) => acc + dt, 0) +
      (scale - i0) * this.dt[Math.min(this.dt.length - 1, i0)]
    );
  }

  /**
   * @brief length on parametrized curve
   * @details It's the total length to go from position at `0` to position at `x`.
   * @param x parameter between `0` and `1`
   * @returns value of the length at `x`
   */
  length(x: number = 1): number {
    const scale = x * (this.positions.length - 1),
      i0 = Math.floor(scale),
      i1 = Math.min(this.positions.length - 1, i0 + 1);

    let length = 0;
    for (let i = 1; i <= i0; i++)
      length += this.positions[i].dist(this.positions[i - 1]);

    return length + this.positions[i1].dist(this.positions[i0]) * (scale - i0);
  }

  /**
   * @brief generates a constant curve ie. a point.
   * @details The position is constant and the step is non zero
   * @param u position of the point
   * @param size number of samples
   * @param dt time step
   */
  static zeros<T extends Vector>(
    u: T,
    size: number,
    dt: number[] | number = 1
  ) {
    let array = [];
    for (let i = 0; i < size; i++) {
      array.push(u.clone());
    }
    return new BasicCurve(array, dt);
  }

  /**
   * @brief generates a curve that is the graph of a function.
   * @details Samples the function `f` from `f(a)` to `f(b)` with constant time step
   * @param f vector valued function that depends only on time.
   * @param a starting point to evaluate `f`
   * @param b ending point to evaluate `f`
   * @param dt constant time step to sample `f`
   */
  static graph<T extends Vector>(
    f: (t: number) => T,
    a: number,
    b: number,
    dt: number = 1
  ) {
    let array = [];
    for (let x = a; x < b; x += dt) {
      array.push(f(x));
    }
    return new BasicCurve(array, dt);
  }
}
