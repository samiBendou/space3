/** interface to encode values in different native Javascript types */
export interface Encoder {
    /** native Javascript array containing object's content */
    array(): number[];

    /** string containing a summary of object's content */
    string(): string;
}

/**
 * @brief abstract vectors in 3D
 * @details Represents a **vector** in an abstract _normed vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 *
 * - Has to be related to 3D but not necessarily represent an object of dimension 3.
 *
 * - Implements `x`, `y` and `z` members such that if the object is of dimension `N`,
 * `x` is of dimension `N/3`, eg. `.x` of a [[Matrix3]] becomes a [[Vector3]].
 *
 * - Offers algebraical operations `add`, `sub`, `inv`, `mul`, `prod`,  ...
 *
 * - Offers norm based equality, zeros and distance methods `equal`, `mag`, `dist`, ...
 *
 * - Provides immutable operations `addc`, `subc`, ...
 */
export interface Vector extends Encoder {
    /** dimension of the vector */
    dim: number;

    x: any;

    y: any;

    z: any;

    xyz: any;

    /** magnitude of the vector */
    mag: number;

    /** squared magnitude of the vector */
    mag2: number;

    /** assigns coordinates to a vector */
    assign(...args: number[]): this;

    /** copies a source vector into `this` */
    copy(vector: Vector): this;

    /** clone a vector */
    clone(): Vector;

    /** reset to an additive neutral element `0` */
    reset0(): this;

    /** reset to a multiplicative neutral element `1` */
    reset1(): this;

    /** fills the vector with a single value `s` */
    fill(s: number): this;

    fillc(s: number): Vector;

    /** normalizes a vector `u / ||u||` */
    norm(): this;

    normc(): Vector;

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

    /** linear interpolation between `this` and `u` starting at `this` **/
    lerp(vector: Vector, t: number): this;

    lerpc(vector: Vector, t: number): Vector;

    /** transpose of a vector */
    trans(): this;

    transc(): Vector;

    /** product between two vectors `u * v` */
    prod(vector: Vector): this;

    prodc(vector: Vector): Vector;

    /** multiplicative inverse of a vector `u ** -1` **/
    inv(): this;

    invc(): Vector;

    /** usual dot product of two vector `u | v` */
    dot(vector: Vector): number;

    /** dot product based distance `d(u, v)` */
    dist(vector: Vector): number;

    /** squared distance `d(u, v)**2` */
    dist2(vector: Vector): number;

    /** `true` if distance between vectors is 0 */
    equal(vector: Vector): boolean;

    /** `true` if the vector has a 0 magnitude */
    zero(): boolean;
}

export const epsilon = Number.EPSILON;

export const epsilon2 = epsilon * epsilon;

export const mag = (vector: Vector): number => Math.sqrt(vector.dot(vector));

export const mag2 = (vector: Vector): number => vector.dot(vector);

export const dist = (vector1: Vector, vector2: Vector): number => Math.sqrt(vector1.dist2(vector2));

/** adds vectors in array `u0 + u1 + ...` */
export const add = (vectors: Vector[]) =>
    vectors.reduce((acc, u) => acc.add(u), vectors[0].clone().reset0());

/** multiplies vectors in array `u0 * u1 * ...` */
export const prod = (vectors: Vector[]) =>
    vectors.reduce((acc, u) => acc.prod(u), vectors[0].clone().reset1());

/** linear combination of vectors in array `s0 u0 + s1 u1 + ...` */
export const comb = (scalars: number[], vectors: Vector[]) =>
    vectors.reduce((acc, u, index) => acc.add(u.mulc(scalars[index])), vectors[0].clone().reset0());

/**
 * @brief derivative of an array of vector with given steps
 * @details Representing discrete derivative of the array of Vector3.
 *
 * - If the original array is of size `N`, than the derivative is of size `N - 1`.
 *
 * - The derivative is approximated according using lower bound 1-st order approximation
 *
 * @param vectors array of `Vector3` to process
 * @param dt array of numbers representing steps between vector
 * @returns array of `Vector3` representing the value of the derivative
 */
export const der = (vectors: Vector[], dt: number[] | number = 1) => {
    const steps = (typeof dt == "number") ? Array(vectors.length).fill(dt) : dt;
    const der = new Array(vectors.length - 1);
    for (let i = 0; i < vectors.length - 1; i++) {
        der[i] = vectors[i + 1].clone().sub(vectors[i]).div(steps[i]);
    }
    return der;
};