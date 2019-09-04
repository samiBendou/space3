import Vector from "./Vector";

/**
 * ## Brief
 * [[Matrix]] extends [[Vector]] interface with matrix related features.
 *
 * ### Main Features
 * - Efficient manipulation of **rows and columns** `row`, `rows`, `cols`, ...
 * - Matrix **algebra extended features** `pow`, `det`, `prodv`, ...
 *
 * ## Getting started
 *
 * A [[Matrix]] is a 2D array of components. The matrices are represented as :
 * - **1D** contiguous array of components.
 * - **column-major**, ie. ordered by columns
 * - ordered from **up to down** for each column
 *
 * **Note** this representation is compatible with the WebGL specification
 *
 * **Note** `mij` denotes the component of the matrix `m` at i-th row and j-th column
 *
 * ### Rows and columns
 *
 * Even thought that a matrix is stored in a column-major form, it interfaces with `number[][]` so that you can
 * manipulate matrices in a row-major or column-major order as convenience.
 *
 * #### Example
 * ```js
 * m.rows = [[m00, m01, ...], [m10, m11, ...], ...];
 * m.cols = [[m00, m10, ...], [m01, m11, ...], ...];
 * m.row(i) // [mi0, mi1, ...];
 * ```
 *
 * **Note** row-major are stored from left to right.
 *
 * ### Algebra
 *
 * Algebra of [[Matrix]] is the same as [[Vector]] algebra
 * but with the usual matrix product instead of component by component product.
 * Therefore you can take a look at the [glossary of operations](https://samibendou.github.io/space3/)
 * to have an exhaustive list of what's provided.
 */
export default interface Matrix extends Vector {
    /** `this` matrix as 2D array of rows `[[m00, m01, ...], [m10, m11, ...], ...]` */
    rows: number[][];

    /** `this` matrix as 2D array of columns `[[m00, m10, ...], [m01, m11, ...], ...]` */
    cols: number[][];

    /** trace of the matrix `m00 + m11 + ...`*/
    trace: number;

    /** determinant of the matrix */
    det: number;

    /** i-th row of `this` matrix `[mi0, mi1, ...]` */
    row(i: number): number[];

    /** j-th column of `this` matrix `[m0j, m1j, ...]` */
    col(j: number): number[];

    /**
     * @brief left product between a matrix and a vector `m * u`
     * @details the result is stored in `u`
     * @returns reference to `u`
     */
    prodv(u: Vector): Vector;

    prodvc(u: Vector): Vector;

    /** transpose of `this` matrix */
    trans(): this;

    transc(): Matrix;

    /** exponentiation of `this` matrix with positive and negative integer exponent `m ** exp`. */
    pow(exp: number): this;

    powc(exp: number): Matrix;

    /** adjoint of `this` matrix */
    adj(): this;

    adjc(): Matrix;

    /** Frobenius norm of `this` matrix  `mji` */
    frob(): number;
}