/**
 *
 * ## Brief
 *
 * Standardizes components accessors between objects of dimension 9.
 *
 * ## Getting Started
 *
 * ### Components accessors
 * Access a component using an equivalent of cartesian coordinates `u.ij` where :
 * - `i` is an index which value can be `x`, `y`, `z`
 * - `j` is an index which value can be `x`, `y`, `z`
 *
 * #### Example
 * ```js
 * m.xx = 2;
 * s = m.yz + u.x;
 * z = m.zz;
 * ```
 */
export default interface Object9 extends Float64Array {

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