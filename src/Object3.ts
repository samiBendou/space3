import Vector from "./Vector";

/**
 *
 * ## Introduction
 * Standardizes components accessors and rotations between objects of 3D space.
 *
 * ## Components accessors
 * Provides `x`, `y` and `z` accessors such that if the object is of dimension `N`, `x` is of dimension `N/3`.
 *
 * ### Example
 * ```js
 * m.x // Vector3
 * u.z // number
 * m.xyz // [Vector3, Vector3, Vector3]
 * u.xyz // [number, number, number]
 * ```
 *
 * ## Rotations
 * 3D rotations for matrices and vectors are both very powerful and computationally efficient. It allows to generate
 * custom rotation matrix and to rotate vectors around any arbitrary axis around any circular-like shape.
 *
 * ```js
 * u.rotX(angle);
 * v.rot(u, angle);
 * w.rot(u, angle, cos, sin);
 * m.rotY(angle);
 * n.rot(u, angle);
 * q.rot(u, angle, cos, sin);
 * ```
 *
 * In the last line, he methods `cos` and `sin` are called the _metric functions_ of the rotation.
 * By default these are let to `Math.cos` and `Math.sin` the resulting rotation will be a circular.
 *
 * ### Elliptic rotation
 * A standard use case for extended features of rotation matrix is the generation of an elliptic rotation matrix.
 * Pass the method `(x) => a * Math.cos(x)` and `(y) => b * Math.sin(y)` as metric functions, the result will
 * be a rotation matrix around an ellipse of semi-axis major `max(a,b)` and semi-axis minor `min(a, b)`.
 *
 * #### Example
 * ```js
 * let a = 2, b = 1; // a is semi-axis major, b is semi-axis minor
 *
 * // +pi/2 rotation around ellipse of axis u
 * m.rot(u, Math.PI / 2, (x) => a * Math.cos(x), (y) => b * Math.sin(y));
 * ```
 */
export default interface Object3 {
    /** first component */
    x: any;

    /** second component */
    y: any;

    /** third component */
    z: any;

    /** array containing `[x, y, z]` */
    xyz: any;

    /** array containing the transpose of `x`, `y` and `z` `[xt, yt, zt]`*/
    xyzt?: any;

    /**
     * @brief rotates the vector around `x` axis
     * @details See [[Object3]] for more details.
     * @param theta angle of rotation
     * @param cos `y` metric function of the rotation
     * @param sin `z` metric function of the rotation
     */
    rotX(theta: number, cos?: (x: number) => number, sin?: (x: number) => number): this;


    /**
     * @brief rotation around `y` axis
     * @details See [[Object3]] for more details.
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `z` metric function of the rotation
     */
    rotY(theta: number, cos?: (x: number) => number, sin?: (x: number) => number): this;


    /**
     * @brief rotation around `z` axis
     * @details See [[Object3]] for more details.
     * @param theta angle of rotation
     * @param cos `x` metric function of the rotation
     * @param sin `y` metric function of the rotation
     */
    rotZ(theta: number, cos?: (x: number) => number, sin?: (x: number) => number): this;


    /**
     * @brief rotation around `u` axis
     * @details `ux` and `uy` are such that they form a orthonormal basis `(ux, uy, u)`.
     * See [[Object3]] for more details.
     * @param u axis of rotation
     * @param theta angle of rotation
     * @param cos `ux` metric function of the rotation
     * @param sin `uy` metric function of the rotation
     */
    rot(u: Vector, theta: number, cos?: (x: number) => number, sin?: (x: number) => number): this;
}