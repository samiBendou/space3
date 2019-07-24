/**
 * ## Introduction
 *
 * This module provides various algebra related features. It provides API specification for almost all the framework.
 *
 * ## Matrices and vectors
 * Interfaces to standardize mathematical operations for matrices and vectors are specified here.
 * All vectors and matrices inherits from [[Float64Array]] in order to provide double precision computation and an array access `u[k]`.
 *
 * All the documentation for common mathematical operations can be founded in [[Vector]] and [[Matrix]]
 * documentations. Theses interface offers a rich object oriented syntax.
 *
 * Theses operations are implemented using 3D optimized code that achieve both very high functionality and speed.
 *
 * ## Object oriented interface
 * This module is natively written using object oriented paradigm which makes it syntax very close to the natural
 * mathematical language. For example `u += v` becomes `u.add(v)`.
 *
 * #### Example
 * ```js
 * a = u.addc(w).add(v);
 * b = u.subc(w.addc(v).div(s));
 * c = m1.prodc(m2.powc(2)).prod(m3);
 * ```
 *
 * **Note** calling objects are modified during the operation, call `c` suffixed method to output a new instance and
 * avoid modify the calling object.
 *
 * ## Functional interface
 * This module provides a functional interface consists on a set of function that partially implement the interface [[Vector]].
 * It allows to perform operations using the syntax `op(u1, u2)` instead of `u1.op(u2)` with quasi no performance loss.
 *
 * #### Example
 * ```js
 * a = add(u, w, v);
 * b = sub(u, div(s, w, v));
 * c = prod(m1, m2.powc(2), m3);
 * ```
 * **Note** this interface is immutable, the original objects are not modified during operation and a new instance is returned.
 */

/** numeric precision limit */
export const epsilon = Number.EPSILON;

export const epsilon2 = epsilon * epsilon;

/** returns a random gaussian number using Box-Muller */
export const gaussian = (mu: number, sigma: number) => {
    const pi2 = 2 * Math.PI;
    let s0: number, s1: number;
    do {
        s0 = Math.random();
        s1 = Math.random();
    } while (s0 <= epsilon);
    return (Math.sqrt(-2.0 * Math.log(s0)) * Math.cos(pi2 * s1)) * sigma + mu;
};


/** Encodes values in different native Javascript types. */
export interface Encoder {
    /** native Javascript array containing object's content */
    array(): number[];

    /** string containing a summary of object's content */
    string(): string;
}

/** @brief Objects of 3D space.
 * @details **Standardize components accessors** between objects of dimension 3.
 * Implements `x`, `y` and `z` members such that if the object is of dimension `N`,
 * `x` is of dimension `N/3`. For example `x` of a [[Matrix3]] is a [[Vector3]].
 */
export interface Object3 {
    x: any;
    y: any;
    z: any;
    xyz: any;
    xyzt?: any;
}

/**
 * @brief Objects of 9D space.
 * @details **Standardize components accessors** between objects of dimension 9.
 * Implements `xx`, `yx` such that if the object represent a matrix the first coordinate index
 * is the row and and the second is the column index.
 */
export interface Object9 {

    xx: any;
    yx: any;
    zx: any;
    xy: any;
    yy: any;
    zy: any;
    xz: any;
    yz: any;
    zz: any;
}

/**
 * @brief Abstract vectors.
 * @details Represents a **vector** in a  _normed vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 *
 * A [[Vector]] has to be related to 3D but not necessarily represent an object of dimension 3.
 * However it must offer the following operations :
 *
 * - Objects copy and clone `copy`, `clone`, `assign`, ...
 * - Basic **manipulators** `floor`, `fill`, `abs`, ...
 * - **Algebraical operations** `add`, `sub`, `inv`, `mul`, `prod`,  ...
 * - Linear, cubic and Bezier's **interpolation** `lerp`, `herp`, ...
 * - **Equality**, zeros and distance methods `equal2`, `mag`, `dist1`, ...
 * - Provide **immutable operations** by cloning `addc`, `subc`, ...
 *
 * In all that follows `u` will always denote vector `this` and `v` vector `vector`.
 */
export interface Vector extends Encoder, Float64Array {
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

    /** Hermite's interpolation between two vectors with two control points. `s` must be between 0 and 1  **/
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

    /** usual dot product of two vector `u | v` */
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

/**
 * @brief Abstract matrices.
 * @details Add some matrix related features to the [[Vector]] interface.
 */
export interface Matrix extends Vector {
    /** matrix as 2D array of rows */
    rows: number[][];

    /** matrix as 2D array of columns */
    cols: number[][];

    trace: number;

    /** determinant of the matrix */
    det: number;

    /** i-th row of the matrix */
    row(i: number): number[];

    /** j-th column of the matrix */
    col(j: number): number[];

    /**
     * @brief product between a matrix and a vector
     * @details the result is stored in `u`
     * @returns reference to `u`
     */
    at(u: Vector): Vector;

    atc(u: Vector): Vector;

    /** transpose of a matrix */
    trans(): this;

    transc(): Matrix;

    /** exponentiation of a matrix with positive and negative integer exponent. */
    pow(exp: number): this;

    powc(exp: number): Matrix;

    /** adjoint matrix */
    adj(): this;

    adjc(): Matrix;

    /** Frobenius norm of the matrix **/
    frob(): number;
}

export const mag = (vector: Vector): number => Math.sqrt(vector.dot(vector));

export const mag2 = (vector: Vector): number => vector.dot(vector);

export const floor = (vector: Vector): Vector => vector.floorc();

export const ceil = (vector: Vector): Vector => vector.ceilc();

export const round = (vector: Vector): Vector => vector.roundc();

export const abs = (vector: Vector): Vector => vector.absc();

export const min = (...vectors: Vector[]): Vector => vectors.reduce((acc, u) => acc.min(u));

export const max = (...vectors: Vector[]): Vector => vectors.reduce((acc, u) => acc.max(u));

export const trunc = (decimals: number = 0, vector: Vector): Vector => vector.truncc(decimals);

/** addition between vectors `u0 + u1 + ...` */
export const add = (...vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.add(u), vectors[0].clone().reset0());

/** subtraction between first vector and other ones `u0 - u1 - ...`*/
export const sub = (vector: Vector, ...vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.sub(u), vector.clone());

/** sum of negated vectors `-u0 - u1 + ...` */
export const neg = (...vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.sub(u), vectors[0].clone().reset0());

/** sum of scaled vectors `s * u0 + s * u1 + ...` */
export const mul = (s: number, ...vectors: Vector[]) =>
    vectors.reduce((acc, u) => acc.comb(s, u), vectors[0].clone().reset0());

/** sum of scaled vectors `u0 / s + u1 / s + ...` */
export const div = (s: number, ...vectors: Vector[]): Vector => {
    const inv = 1 / s;
    return vectors.reduce((acc, u) => acc.comb(inv, u), vectors[0].clone().reset0());
};

/** linear combination of vectors in array `s0 * u0 + s1 * u1 + ...` */
export const comb = (scalars: number[], ...vectors: Vector[]) =>
    vectors.reduce((acc, u, index) => acc.comb(scalars[index], u), vectors[0].clone().reset0());

/** linear interpolation of the vectors, `s = 0` gets the first vector, `s = 1` gets the last vector **/
export const lerp = (s: number, ...vectors: Vector[]): Vector => {
    const sn = (vectors.length - 1) * s, index = Math.ceil(sn);
    return vectors[Math.max(index - 1, 0)].lerpc(vectors[index], sn - index + 1);
};

/** Hermite's interpolation of the vectors, `s = 0` gets the first vector, `s = 1` gets the last vector **/
export const herp = (s: number, ...vectors: Vector[]): Vector => {
    const sn = (vectors.length - 1) * s, index = Math.max(Math.floor(sn) - 3, 0);
    return vectors[index].herpc(vectors[index + 3], vectors[index + 1], vectors[index + 2], (sn - index) / 3);
};

/**  Bezier's interpolation of the vectors, `s = 0` gets the first vector, `s = 1` gets the last vector  */
export const berp = (s: number, ...vectors: Vector[]): Vector => {
    const sn = (vectors.length - 1) * s, index = Math.max(Math.floor(sn) - 3, 0);
    return vectors[index].berpc(vectors[index + 3], vectors[index + 1], vectors[index + 2], (sn - index) / 3);
};

/** discrete derivative of the given vectors `[u1 - u0, u2 - u1, ...]` */
export const der1 = (...vectors: Vector[]): Vector[] =>
    vectors.map((vector, index) => vector.subc(vectors[Math.max(0, index - 1)])).slice(1);

/** 1-st order derivative of the vectors `[(u1 - u0) / ds, (u2 - u1) / ds, ...]` */
export const der = (ds: number, ...vectors: Vector[]): Vector[] =>
    vectors.map((vector, index) => vector.derc(ds, vectors[Math.max(0, index - 1)])).slice(1);

/** multiplication of vectors `u0 * u1 * ...` */
export const prod = (...vectors: Vector[]) =>
    vectors.reduce((acc, u) => acc.prod(u), vectors[0].clone().reset1());

/** sum of normalized vectors `u0 / ||u0|| + u1 / ||u1|| + ...` */
export const norm = (...vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.comb(1 / u.mag, u), vectors[0].clone().reset0());

export const dot = (vector1: Vector, vector2: Vector): number =>
    vector1.dot(vector2);

export const dist = (vector1: Vector, vector2: Vector): number =>
    Math.sqrt(vector1.dist2(vector2));

export const exact = (...vectors: Vector[]): boolean => {
    const len = vectors.length - 1;
    return vectors.reduce((acc, u, index) => acc && vectors[Math.min(index + 1, len)].exact(u), true);
};

export const equal1 = (...vectors: Vector[]): boolean => {
    const len = vectors.length - 1;
    return vectors.reduce((acc, u, index) => acc && vectors[Math.min(index + 1, len)].equal1(u), true);
};

export const equal2 = (...vectors: Vector[]): boolean => {
    const len = vectors.length - 1;
    return vectors.reduce((acc, u, index) => acc && vectors[Math.min(index + 1, len)].equal2(u), true);
};