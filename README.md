# space3
[![Version](https://img.shields.io/npm/v/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)
[![Build status](https://img.shields.io/travis/samiBendou/space3.svg?style=flat-square)](https://travis-ci.org/samiBendou/space3)
[![License](https://img.shields.io/npm/l/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)

Javascript has become a language able to perform 3D graphics and numerical simulation in real time.
Theses applications are very expensive in terms of calculation and impose the need of both fast and 
handy API to perform 3D computation.

_space3_ is a **rich high performance API for 3D maths**. It is designed
with uncompromising time optimization in mind and reaches performances comparable to the wonderful [glMatrix](http://glmatrix.net/)
for computation while **keeping maths programming close to written mathematics**.

## Featuring
- **WebGL support** with array based classes inheriting from `Float64Array`, column-major matrices, ...

- **Three.js support** with 3D coordinates manipulation and efficient rotations, translation, ...

- **Vast API** designed to perform many general purpose and specialized mathematical operations 
for computer graphics, numeric simulation, geometry, physics...

- **Written in Typescript** with standardized interfaces to allow easily subclassing over the framework and 
make the API simpler to use.

- **Object oriented** and **functional** paradigm for mathematical operations in order to make syntax as clear as possible
while staying concise.

- **Intuitive syntax** that makes formulas easy to drop. You'll almost never find yourself
writing a math formula on more than a code line.

- **[Reference and tutorials](https://samibendou.github.io/space3/)** 
to easily get started even if you're new in programming.

- **Clean unit testing** to allow understand the subtleties of some features   

## Usage

### Import
#### ES6 and Typescript
```js
import * as space3 from "space3";
import {Vector3, Matrix3} from "space3";
```

With Typescript only, you can directly import sources 
```typescript
import Vector3 from "space3/src/Vector3";
```
This makes the syntactic coloration more consistent.
#### Node.js
```js
const space3 = require("space3");
const Vector3 = space3.Vector3, Matrix3 = space3.Matrix3;
```

#### Browser
WIP... Browser bundle coming soon.
For now you can use a browser bundler such as browserify to transpile sources for browser.

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

## Documentation
This framework is documented such that beginners in maths and/or programming can get started easily but 
provides rigorous documentation for more advanced users.

It comes with a complete reference and a step-by-step documentation for each class.
Bellow you can find a short guide that will get you started and give you an overview of the framework.

**[Complete reference](https://samibendou.github.io/space3/)**

## Contributions
If you want to improve math javascript experience don't hesitate to contribute. 
All kind of improvements are welcomed !

**[CONTRIBUTING.md](https://github.com/samiBendou/space3/blob/master/CONTRIBUTING.md)**

## Quick start
### Basic concepts
**space3** is a general purpose class library for 3D math.
It Provides handy **classes for matrices, vectors** and other objects related to 3D space and affine representation.
It Introduces the same names for abstractions that the ones commonly used in physics and geometry.

#### Conventions
In all the documentation and the code we will refer to :
- `u`, `v`, `w` as vector
- `m`, `a`, `b`, `c` as matrix
- `p`, `q` as point
- `s`, `t` as real number
- `i` as row index of a matrix
- `j` as column index of a matrix
- A series of vectors/matrices/numbers will be noted `uk` where `k = 0, 1, 2, ...`

#### Glossary
To shorten the length of the expression written using the framework, some abbreviations have been introduced.
Here is a glossary that resumes the definition of each.

| Abbreviation   | Name          | Operation        |
| ---------------|---------------|------------------|
| `add`          | addition      |`u += v`          |
| `sub`          | subtraction   |`u -= v`          |
| `mul`          | multiplication|`u *= s`          |
| `div`          | division      |`u /= s`          |
| `comb`         | combination   |`u += v s`        |
| `[lhb]erp`     | interpolation |`u += (v-u) s`    |
| `der`          | derivation    |`u = (v-u) / ds`  |
| `prod`         | product       |`u *= v`          |
| `inv`          | inversion     |`u **= -1`        |
| `norm`         | normalization |`u /= u . u`      |
| `dot`          | dot product   |`u . v`           |
| `dist`         | equality      |`d(u, v)`         |
| `equal`        | equality      |`u == v`          |
| `zero` or `nil`| 0 comparison  |`u == 0`          |
| `rot`          | rotation      |`u = rot(theta)`  |

### Standardized algebra
This framework comes with typescript interfaces to standardize mathematical operations. 

This provides you the same syntax and equivalent specification for all operations that have the same mathematical meaning.
For example, `add` will name the addition of two matrices, vectors, position of points...

### Object oriented interface
This framework is natively written using object oriented paradigm which makes the syntax very close to the natural
mathematical language. For example `u += v` becomes `u.add(v)`.

#### Example
```js
a = u.addc(w).add(v);
b = u.subc(w.addc(v).div(s));
c = m1.prodc(m2.powc(2)).prod(m3);
```
It allows to perform binary operations in way such that `u.op(v)` stores the result of `op` in `u`, erasing the
initial content of `u` but avoid cloning objects after operations.

This syntax allows surprisingly fast computing by minimizing the number of new instance to create while performing operations.

**Note** Call `c` suffixed method to output a new instance and avoid modify the calling object.

### Functional interface
This module provides a functional interface that is almost the same as the object oriented API but is more convenient for
operations over array of vectors `op(...vectors)`.
It allows to perform operations using the syntax `op(u, v, w)` instead of `u.opc(v).op(w)` with quasi no performance loss.

#### Example
```js
a = add(u, w, v);
b = sub(u, div(s, w, v));
c = prod(m1, m2.powc(2), m3);
```

**Notes** 
- The original objects are not modified during operation, a new instance is always returned
- Use and mix the two syntax at convenience

### Generation of objects
All classes comes with handy Matlab-style generators to avoid you writing the same `new Vector(1, 0, 0)` again and again.

#### Example
```js
let u = Vector3.zeros; // new vector filled with 0
let v = Vector3.ex; // new vector (1, 0, 0)
let m = Matrix3.ones; // new matrix filled with 1
let n = Matrix3.eye; // new identity matrix
let q = Matrix3.scalar(6); // diagonal matrix filled with 6
```
