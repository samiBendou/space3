import Encoder from "./Encoder";

/**
 * ## Introduction
 *
 * Represents a **vector** in a  _normed vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 * A [[Vector]] is not necessarily an object of dimension 3.
 *
 * ## Operations
 *
 * A [[Vector]] provides the following operations :
 *
 * - Objects **copy and clone** `copy`, `clone`, `assign`, ...
 * - Basic **manipulators** `floor`, `fill`, `abs`, ...
 * - **Algebraical operations** `add`, `sub`, `inv`, `mul`, `prod`,  ...
 * - Linear, cubic and Bezier's **interpolation** `lerp`, `herp`, ...
 * - **Equality**, zeros and distance methods `equal2`, `mag`, `dist1`, ...
 * - Provide **immutable operations** by cloning `addc`, `subc`, ...
 *
 * #### Example
 *
 * ```js
 * let u = Vector3.ex.mul(5.5), v = u.clone();
 * u.floor(); // u = (5, 0, 0)
 * u.lerp(v, 0.5) // u = (5.25, 0, 0);
 * u.comb(2, v) // u = (16.25, 0, 0);
 * ```
 *
 * The documentation of each method contains a more precise description of the API.
 *
 * ## Equality and norm based operations
 * In order to avoid float precision errors and to give different way to compare vectors,
 * [[Vector]] interface provides three different ways to compare vectors :
 * - Using the norm 1, manhattan distance `||u|| = |ux| + |uy| + |uz|`
 * - Using the norm 2, dot product distance `||u|| = sqrt(|ux|**2 + |uy|**2 + |uz|**2)`
 * - Using exact comparison coordinates by coordinates.
 *
 * #### Example
 *
 * ```js
 * let ex = Vector3.ex, ey = Vector3.ey, zeros = Vector3.zeros;
 * ex.equal2(ey) // false
 * ex.equal1(ey) // false
 * ex.exact(ex) // true
 * ex.zero1() // false
 * zeros.nil() // true
 * ```
 *
 * **Note** `mag` accessors is computed using the norm 2. Use `dist`, `equal2` and `zero2` to compare objects by default.
 */
export default interface Vector extends Encoder {
    /** dimension of the vector */
    dim: number;

    /** magnitude of the vector */
    mag: number;

    /** squared magnitude of the vector */
    mag2: number;

    /** assigns components to a vector */
    assign(...coordinates: number[]): this;

    /** copies a source vector into `this` */
    copy(vector: Vector): this;

    /** clone a vector */
    clone(): Vector;

    /** reset to an additive neutral element `0` */
    reset0(): this;

    /** reset to a multiplicative neutral element `1` */
    reset1(): this;

    /** `Math.random` of the components */
    random(): this;

    /** `Math.floor` of the components */
    floor(): this;

    floorc(): Vector;

    /** `Math.ceil` of the components */
    ceil(): this;

    ceilc(): Vector;

    /** `Math.round` of the components */
    round(): this;

    roundc(): Vector;

    /** truncate method keeping a given amount of decimals */
    trunc(decimals: number): this;

    truncc(decimals: number): Vector;

    /** `Math.abs` of the components */
    abs(): this;

    absc(): Vector;

    /** `Math.min` between the components of the two vectors  */
    min(vector: Vector): this;

    minc(vector: Vector): Vector;

    /** `Math.max` between the components of the two vectors */
    max(vector: Vector): this;

    maxc(vector: Vector): Vector;

    /** fills the vector with a single value `s` */
    fill(s: number): this;

    fillc(s: number): Vector;

    /** usual addition between two vectors `u + v` */
    add(vector: Vector): this;

    addc(vector: Vector): Vector;

    /** usual subtraction between two vectors `u - v` */
    sub(vector: Vector): this;

    subc(vector: Vector): Vector;

    /** usual opposite of the vector `-u` */
    neg(): this;

    negc(): Vector;

    /** usual scalar multiplication of the vector `s * u` */
    mul(s: number): this;

    mulc(s: number): Vector;

    /** usual scalar division of the vector `u / s` */
    div(s: number): this;

    divc(s: number): Vector;

    /** linear combination of scalar and vector `u + s * v` */
    comb(s: number, vector: Vector): this;

    combc(s: number, vector: Vector): Vector;

    /**
     * @brief linear interpolation between two vectors `u + (v - u) * s`
     * @details `s` must be between 0 and 1.
     * @param target destination of interpolation
     * @param s parameter of the interpolation.
     */
    lerp(target: Vector, s: number): this;

    lerpc(target: Vector, s: number): Vector;

    /**
     * @brief Hermite's interpolation between two vectors
     * @details `s` must be between 0 and 1.
     * @param target destination of interpolation
     * @param vector1 control point number 1
     * @param vector2 control point number 2
     * @param s parameter of the interpolation.
     */
    herp(target: Vector, vector1: Vector, vector2: Vector, s: number): this;

    herpc(target: Vector, vector1: Vector, vector2: Vector, s: number): Vector;

    /**
     * @brief Bezier's interpolation between two vectors
     * @details `s` must be between 0 and 1.
     * @param target destination of interpolation
     * @param vector1 control point number 1
     * @param vector2 control point number 2
     * @param s parameter of the interpolation.
     */
    berp(target: Vector, vector1: Vector, vector2: Vector, s: number): this;

    berpc(target: Vector, vector1: Vector, vector2: Vector, s: number): Vector;

    /** 1-th order derivative between the two vectors with given step `(u - v) / ds`*/
    der(ds: number, vector: Vector): this;

    derc(ds: number, vector: Vector): Vector;

    /** product between two vectors `u * v` */
    prod(vector: Vector): this;

    prodc(vector: Vector): Vector;

    /** multiplicative inverse of a vector `u ** -1` **/
    inv(): this;

    invc(): Vector;

    /** normalizes a vector `u / ||u||` */
    norm(): this;

    normc(): Vector;

    /** usual dot product of two vector `u . v` */
    dot(vector: Vector): number;

    /** distance distance between two vectors `d2(u, v)` */
    dist(vector: Vector): number;

    /** distance between two vectors given by norm 1 `d1(u, v)` */
    dist1(vector: Vector): number;

    /** squared distance between two vectors given by norm 2 `d2(u, v)**2` */
    dist2(vector: Vector): number;

    /** `true` if the vectors have exactly the same coordinates */
    exact(vector: Vector): boolean;

    /** `true` if the distance 1 between vectors is 0 */
    equal1(vector: Vector): boolean

    /** `true` if the distance 2 between vectors is 0 */
    equal2(vector: Vector): boolean;

    /** `true` if the vector has only exacts 0 as coordinates */
    nil(): boolean;

    /** `true` if the vector has a 0 norm 1 */
    zero1(): boolean;

    /** `true` if the vector has a 0 norm 2 */
    zero2(): boolean;
}