export const epsilon = Number.EPSILON;

export const epsilon2 = epsilon * epsilon;

export const gaussian = (mu: number, sigma: number) => {
    const pi2 = 2 * Math.PI;
    let s0: number, s1: number;
    do {
        s0 = Math.random();
        s1 = Math.random();
    } while (s0 <= epsilon);
    return (Math.sqrt(-2.0 * Math.log(s0)) * Math.cos(pi2 * s1)) * sigma + mu;
};


/** encode values in different native Javascript types */
export interface Encoder {
    /** native Javascript array containing object's content */
    array(): number[];

    /** string containing a summary of object's content */
    string(): string;
}

/** @brief objects of 3D space
 * @details add 3D utilities accessors to an object
 *  * - Implements `x`, `y` and `z` members such that if the object is of dimension `N`,
 * `x` is of dimension `N/3`, eg. `.x` of a [[Matrix3]] becomes a [[Vector3]].
 */
export interface Object3 {
    x: any;
    y: any;
    z: any;
    xyz: any;
    xyzt?: any;
}

/**
 * @brief objects of 9D space
 * @details add accessors to an object
 * - Implements `xx`, `yx` such that if the object represent a matrix the first coordinate index
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
 * @brief abstract vectors
 * @details Represents a **vector** in an abstract _normed vector space_.
 * It might be numerical vectors, matrices, or something more complicated.
 *
 * - Has to be related to 3D but not necessarily represent an object of dimension 3.
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

    /** magnitude of the vector */
    mag: number;

    /** squared magnitude of the vector */
    mag2: number;

    /** assigns coordinates to a vector */
    assign(...coordinates: number[]): this;

    /** copies a source vector into `this` */
    copy(vector: Vector): this;

    /** clone a vector */
    clone(): Vector;

    /** reset to an additive neutral element `0` */
    reset0(): this;

    /** reset to a multiplicative neutral element `1` */
    reset1(): this;

    /** components by components `Math.random` */
    random(): this;

    /** components by components `Math.floor` */
    floor(): this;

    floorc(): Vector;

    /** components by components `Math.ceil` */
    ceil(): this;

    ceilc(): Vector;

    /** components by components `Math.round` */
    round(): this;

    roundc(): Vector;

    /** components by components truncate method keeping a given amount of decimals */
    trunc(decimals: number): this;

    truncc(decimals: number): Vector;

    /** components by components `Math.abs` */
    abs(): this;

    absc(): Vector;

    /** components by components `Math.min` */
    min(vector: Vector): this;

    minc(vector: Vector): Vector;

    /** components by components `Math.max` */
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

    /** linear combination of scalar and vector `s * u + v` */
    comb(s: number, vector: Vector): this;

    combc(s: number, vector: Vector): Vector;

    /** linear interpolation between two vectors. `s` must be between 0 and 1 **/
    lerp(target: Vector, s: number): this;

    lerpc(target: Vector, s: number): Vector;

    /** Hermite's interpolation between two vectors with two control points. `s` must be between 0 and 1  **/
    herp(target: Vector, vector1: Vector, vector2: Vector, s: number): this;

    herpc(target: Vector, vector1: Vector, vector2: Vector, s: number): Vector;

    /** Bezier's interpolation between two vectors with two control points. `s` must be between 0 and 1  */
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

    /** dot product based distance `d2(u, v)` */
    dist(vector: Vector): number;

    /** manhattan distance between two vectors `d1(u, v)` */
    dist1(vector: Vector): number;

    /** squared dot product based distance `d2(u, v)**2` */
    dist2(vector: Vector): number;

    /** `true` if the vectors have exactly the same coordinates */
    exact(vector: Vector): boolean;

    /** `true` if the manhattan distance between vectors is 0 */
    equal1(vector: Vector): boolean

    /** `true` if the dot product based distance between vectors is 0 */
    equal2(vector: Vector): boolean;

    /** `true` if the vector has only exacts 0 as coordinates */
    nil(): boolean;

    /** `true` if the vector has a 0 manhattan distance */
    zero1(): boolean;

    /** `true` if the vector has a 0 magnitude */
    zero2(): boolean;
}

/**
 * @brief abstract matrix
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
    vectors.reduce((acc, u) => acc.add(u.mulc(s)), vectors[0].clone().reset0());

/** sum of scaled vectors `u0 / s + u1 / s + ...` */
export const div = (s: number, ...vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.add(u.divc(s)), vectors[0].clone().reset0());

/** linear combination of vectors in array `s0 * u0 + s1 * u1 + ...` */
export const comb = (scalars: number[], ...vectors: Vector[]) =>
    vectors.reduce((acc, u, index) => u.combc(scalars[index], acc), vectors[0].clone().reset0());

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

/** multiplication of inverse vectors `u0 ** -1 * u1 ** -1 * ...` */
export const inv = (...vectors: Vector[]) =>
    vectors.reduce((acc, u) => acc.prod(u.invc()), vectors[0].clone().reset1());

/** sum of normalized vectors `u0 / ||u0|| + u1 / ||u1|| + ...` */
export const norm = (...vectors: Vector[]): Vector =>
    vectors.reduce((acc, u) => acc.add(u.normc()), vectors[0].clone().reset0());

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