import Vector from "./Vector";

/**
 * ## Brief
 * Add some matrix related features to the [[Vector]] interface.
 * Matrices are stored in memory as 1D contiguous array of columns. Therefore they conforms to the WebGL specification.
 *
 * ### Main Features
 * - Efficient manipulation of **rows and columns** `row`, `rows`, `cols`, ...
 * - Matrix **algebra extended features**`pow`, `det`, `at`, ...
 *
 * For more details see [[Vector]].
 */
export default interface Matrix extends Vector {
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
    prodv(u: Vector): Vector;

    prodvc(u: Vector): Vector;

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