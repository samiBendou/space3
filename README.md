# space3
[![Version](https://img.shields.io/npm/v/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)
[![Build status](https://img.shields.io/travis/samiBendou/space3.svg?style=flat-square)](https://travis-ci.org/samiBendou/space3)
[![License](https://img.shields.io/npm/l/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)

Javascript has become a language able to perform 3D graphics and numerical simulation in real time.
Theses applications are very expensive in terms of calculation and has imposed the need of both fast and 
easy to use API to perform 3D computation.

_space3_ is a **rich high performance API for maths 3D maths**. It is designed
with hardcore time optimization in mind and achieves performances comparable to [glMatrix](http://glmatrix.net/) on
mathematical operations while keeping maths programming close to written mathematics.

## Featuring
- **WebGL support** with array based classes inheriting from `Float64Array` for matrix and vectors, column-major matrices, ...

- **Vast API** designed to perform many general purpose mathematical operations and specialized operations 
useful for computer graphics, mechanics and numeric simulation, geometry...

- **Written in Typescript** with standardized interfaces to allow easily subclassing over the framework and 
make the API simpler to use.

- **Object oriented** and **functional** paradigm for mathematical operations in order to make syntax as clear as possible
while staying concise.

- **Intuitive syntax** that makes formulas easy to drop. You'll almost never find yourself
writing a math formula on more than a code line.

- **Full [reference and tutorials](https://samibendou.github.io/space3/modules/_main_.html)** 
to easily get started even if you're new in programming.

## Usage

### Import
#### Typescript and ES6
```typescript
import * as space3 from "space3";
import {Vector3, Matrix3} from "space3";
```
#### Node.js
```js
const space3 = require("space3");
const Vector3 = space3.Vector3, Matrix3 = space3.Matrix3;
```

### Syntax overview
```js
let u = new Vector3(1, 2, 3), v = Vector3.ones;
let w = sub(u, v, v.mulc(10));
u.add(v).mul(6);

let m = Matrix3.rotX(Math.PI / 2);
v = m.prodv(add(w, v, u));
u.rot(w, Math.PI);
m.inv();

let p = new Point3(1, 2, 3, Vector3.ey), q = Point3.zeros;
p.origin = Vector3.zeros;
u = p.to(q);
p.translate(u);
```

 ## Introduction
 This module provides various algebra related features. It provides API specification for almost all the framework.
 *
 ## Matrices and vectors
 Interfaces to standardize mathematical operations for matrices and vectors are specified here.
 *
 All the documentation for common mathematical operations can be founded in `Vector` and `Matrix`
 documentations. Theses interface offers a rich object oriented syntax.
 *
 Theses operations are implemented using 3D optimized code that achieve both very high functionality and speed.
 *
 ## Object oriented interface
 This framework is natively written using object oriented paradigm which makes it syntax very close to the natural
 mathematical language. For example `u += v` becomes `u.add(v)`.
 *
 #### Example
 ```js
 a = u.addc(w).add(v);
 b = u.subc(w.addc(v).div(s));
 c = m1.prodc(m2.powc(2)).prod(m3);
 ```
 It allows to perform binary operations in way such that `u.op(v)` stores the result of `op` in `u`, erasing the
 initial content of `u` but avoid cloning objects after operations.
 *
 This syntax allows very fast computing by minimizing the number of new instance to create while performing operations.
 *
 **Note*Call `c` suffixed method to output a new instance and avoid modify the calling object.
 *
 ## Functional interface
 This module provides a functional interface consists on a set of function that partially implement the interface `Vector`.
 It allows to perform operations using the syntax `op(u, v, w)` instead of `u.opc(v).op(w)` with quasi no performance loss.
 It can perform operations with an arbitrary number of vector `op(...vectors)`.
 *
 #### Example
 ```js
 a = add(u, w, v);
 b = sub(u, div(s, w, v));
 c = prod(m1, m2.powc(2), m3);
 ```
 *
 **Note*The original objects are not modified during operation and a new instance is always returned.
 *
 ## Generation of objects
 *
 All classes that implement `Vector` interface allows to generate matrix using many Matlab-like generators
 such as `zeros`, `ones`. Theses generators are designed as static accessors of each vector-like class.
 Each call to this accessors construct a new object.
 *
 #### Example
 ```js
 let u = Vector3.zeros; // new vector filled with 0
 let v = Vector3.ex; // new vector (1, 0, 0)
 let m = Matrix3.ones; // new matrix filled with 1
 let n = Matrix3.eye; // new identity matrix
 let q = Matrix3.scalar(6); // diagonal matrix filled with 6
 ```
 *
 </br>
 <center> 2019 <a href="https://github.com/samiBendou/">samiBendou</a> © All Rights Reserved </center>



## Documentation
Check the [main](https://samibendou.github.io/space3/modules/_main_.html) page of the framework's site to get started.

## Contributions

If you want to improve math javascript experience don't hesitate to contribute. All kind of improvements are welcomed ! [CONTRIBUTING.md](https://github.com/samiBendou/space3/blob/master/CONTRIBUTING.md)