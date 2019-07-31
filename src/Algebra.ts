import Vector from "./Vector";

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