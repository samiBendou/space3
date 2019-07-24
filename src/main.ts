/**
 * ## Introduction
 *
 * Welcome to the documentation of **space3** here is explained how to get started with the framework and where to
 * find documentation for a deep dive into the features.
 *
 * ### Summary
 *
 * - Introduction to the framework [here](_algebra_.html)
 * - How to perform algebraical operations [[Vector]] and [[Matrix]]
 * - How to manipulate components and perform rotations [[Object3]] and [[Object9]]
 * - How to serialize objects [[Encoder]]
 * - Introduction to [[Vector3]] features [here](_vector3_.html)
 * - Introduction to [[Matrix3]] features [here](_matrix3_.html)
 * - Introduction to [[Point3]] features [here](_point3_.html)
 *
 * ## Basic concepts
 * **space3** is a general purpose class library for 3D math.
 * - Offers **Typescript interfaces** that standardizes operations between mathematical objects
 * - Comes with a very useful standardized **functional interface for mathematical operations**.
 * - Provides handy **classes for matrices, vectors** and other objects related to 3D space and affine representation.
 *
 * This framework is documented such that beginners in maths and/or programming can get started easily but
 * provide rigorous documentation for more advanced users.
 *
 * ### Guidelines
 * This framework is designed respecting few guidelines :
 * - The **API must be rich** and offer many ways to perform operations
 * - The objects must **respect the WebGL specification**
 * - **Speed is a critical issue**, performance must be comparable to [glMatrix](http://glmatrix.net/)
 *
 * ### API purpose
 * The API is designed to provide high performance and functionality for :
 * - General purpose **linear algebra**
 * - **3D graphics** computation and animation
 * - **Mechanics** simulation
 * - **Physics and numeric** simulation
 *
 * It introduces the same names for vectors and matrices as it's commonly used on math and physics formulas.
 *
 * #### Example
 * ```js
 * let ex = Vector3.ex, ey = Vector3.ey, ez = Vector3.ez; // canonical basis of 3D space
 * console.log(ex.r);
 * console.log(ex.theta);
 *```
 *
 * ## Conventions
 * In all the documentation we assume that :
 * - `u`, `v`, `w` will always name a `Vector3`
 * - `m`, `a`, `b`, `c` will always name a `Matrix3`
 * - `s` will always name a real number
 * - `i` will always name a row index
 * - `j` will always name a column index
 * - A series of vectors will be noted `uk` where `k = 0, 1, 2, ...` same for matrices and real numbers
 *
 * ### API glossary
 * In order to shorten the length of the expression written using the framework, some abbreviations have be introduced.
 * Here is a glossary that resumes the definition of each.
 *
 *
 * | Abbreviation   | Name          | Operation         |
 * | ---------------|---------------|-------------------|
 * | `add`          | addition      |`u += v`           |
 * | `sub`          | subtraction   |`u -= v`           |
 * | `mul`          | multiplication|`u *= s`           |
 * | `div`          | division      |`u /= s`           |
 * | `comb`         | combination   |`u += v * s`       |
 * | `[lhb]erp`     | interpolation |`u += (v-u) * s`   |
 * | `der`          | derivation    |`u = (v-u) / ds`   |
 * | `prod`         | product       |`u *= v`           |
 * | `inv`          | inversion     |`u **= -1`         |
 * | `norm`         | normalization |`u /= u . u`       |
 * | `dot`          | dot product   |`u . v`            |
 * | `dist`         | equality      |`d(u, v)`          |
 * | `equal`        | equality      |`u == v`           |
 * | `zero` or `nil`| 0 comparison  |`u == 0`           |
 * | `rot`          | rotation      |`u = rot(theta)`   |
 */

/** */

// ENTRY POINT FOF NPM PACKAGE

export * from "./Algebra";
export * from "./Vector3";
export * from "./Matrix3";
export * from "./Point3";