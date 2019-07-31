/**
 *
 * ## Introduction
 * Encodes values in different native Javascript types.
 *
 * #### Example
 * ```js
 * u.string(); // "(ux, uy, uz)"
 * m.array(); // [mxx, myx, mzx, mxy, ... ]
 * ```
 *
 * ## Float64Array
 *  [[Encoder]] class inherits from [[Float64Array]] in order to provide double precision computation, an array access `u[k]`.
 * and native C/C++ array compatibility.
 * */
export default interface Encoder extends Float64Array {
    /** native Javascript array containing object's content */
    array(): number[];

    /** string containing a summary of object's content */
    string(): string;
}