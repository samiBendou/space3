import Encoder from "./Encoder";

/**
 * ## Brief
 * [[Vector]] represents a **vector** in a  _normed vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 *
 * ### Main Features
 * - **Copy and Clone** `copy`, `clone`, `assign`, ...
 * - **Manipulators** `floor`, `fill`, `abs`, ...
 * - **Algebra** `add`, `sub`, `inv`, `mul`, `prod`,  ...
 * - Linear, cubic and Bezier's **Interpolation** `lerp`, `herp`, ...
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
 * ## Getting Started
 *
 * ### Algebra and interpolation
 *
 * Perform additions, scalar multiplication, linear interpolation and many other common operations.
 * Take a look at the [glossary of operations](https://samibendou.github.io/space3/) to have an exhaustive list.
 *
 * #### Example
 * ```js
 * u.add(v).sub(w).comb(lambda, w);
 * a.prod(b).inv();
 * ```
 *
 * Theses operations are the core of **space3** framework. Almost all classes of the framework
 * provide or use theses.
 *
 * if you need a little refresh on algebra,
 * I recommend you to watch the great algebra curse on [3Blue1Brown](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) channel.
 *
 * The operations are defined in the reference by mentioning two vectors `u` and `v`. it's admitted that :
 * - `u` refers to `this` in the code
 * - `v` refers to the parameter `vector` in the code
 * - The result is stored in `this`
 * - If the method is suffixed by `c`, the result is a newly created [[Vector]]
 *
 * ### Comparison and zeros
 * In order to avoid float precision errors and allow you to choose the most pertinent comparison,
 * a [[Vector]] provides three different ways to compare to another one :
 * - Using the norm 1, manhattan distance
 * - Using the norm 2, dot product distance
 * - Using exact comparison coordinates by coordinates.
 *
 * The first two comparison are based on the following definition of norms :
 *
 * ![Norm](media://norm.png)
 *
 * Given a norm the distance between two vector is defined by :
 *
 * ![Distance](media://distance.png)
 *
 * #### Example
 * ```js
 * let ex = Vector3.ex, ey = Vector3.ey, zeros = Vector3.zeros;
 * ex.equal2(ey) // false
 * ex.equal1(ey) // false
 * ex.exact(ex) // true
 * ex.zero1() // false
 * zeros.nil() // true
 * zeros.add(ex.mul(0.5 * Number.EPSILON)).nil() // false
 * ```
 * **Note** `mag`, `mag2` accessors uses the norm 2
 *
 * If you don't know which comparison to use, I recommend you `dist`, `equal2` and `zero2` to compare objects by default.
 */
export default interface Vector extends Encoder {
    /** dimension of the vector */
    dim: number;

    /** magnitude of the vector `||u||` */
    mag: number;

    /** squared magnitude of the vector `u . u` */
    mag2: number;

    /** assigns components to a vector */
    assign(...coordinates: number[]): this;

    /** copies a source vector into `this` component by component */
    copy(vector: Vector): this;

    /** clone `this` vector */
    clone(): Vector;

    /** reset to an additive neutral element `0` */
    reset0(): this;

    /** reset to a multiplicative neutral element `1` */
    reset1(): this;

    /** `Math.random` components by components */
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

    /** truncation of the components given a number of decimals to keep */
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

    /** fills `this` vector with a single scalar value `s` */
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

    /** linear combination of a scalar and a vector `u + s * v` */
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
     * @details `s` must be between 0 and 1. Starting vector is `this`.
     * @param target destination of interpolation
     * @param vector1 control point number 1
     * @param vector2 control point number 2
     * @param s parameter of the interpolation.
     */
    herp(target: Vector, vector1: Vector, vector2: Vector, s: number): this;

    herpc(target: Vector, vector1: Vector, vector2: Vector, s: number): Vector;

    /**
     * @brief Bezier's interpolation between two vectors
     * @details `s` must be between 0 and 1. Starting vector is `this`.
     * @param target destination of interpolation
     * @param vector1 control point number 1
     * @param vector2 control point number 2
     * @param s parameter of the interpolation.
     */
    berp(target: Vector, vector1: Vector, vector2: Vector, s: number): this;

    berpc(target: Vector, vector1: Vector, vector2: Vector, s: number): Vector;

    /** derivative between the two vectors with given step `(u - v) / ds`*/
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