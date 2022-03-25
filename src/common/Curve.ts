import Matrix from "./Matrix";

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
export default interface Curve<T> {
  /** position vectors representing the curve */
  positions: T[];

  /** initial position vector of the curve **/
  first: T;

  /** final position vector of the curve **/
  last: T;

  /** position vector of the curve next to last **/
  nexto: T;

  get(i: number): T;

  set(i: number, position: T): this;

  /**
   * @brief add a new position to the trajectory
   * @details If you let `dt` undefined, then the method will take the last added step if it exists.
   * @param position position vector to insert
   * @param dt duration elapsed since `last` position
   */
  push(position: T): this;

  pop(): T;

  /**
   * @brief clears the curve
   * @details Removes all position and steps.
   */
  clear(): this;

  translate(u: T): this;

  transform<U extends Matrix>(m: U): this;

  affine<U extends Matrix>(m: U, v: T): this;

  indexAt(x: number): [number, number, number];

  /**
   * @brief position on parametrized curve
   * @param x parameter between `0` and `1`
   * @returns value of position at `x`
   */
  positionAt(x: number): T;

  /**
   * @brief length on parametrized curve
   * @details It's the total length to go from position at `0` to position at `x`.
   * @param x parameter between `0` and `1`
   * @returns value of the length at `x`
   */
  lengthAt(x: number): number;
}
