# space3

[![Version](https://img.shields.io/npm/v/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)
[![Build status](https://img.shields.io/travis/samiBendou/space3.svg?style=flat-square)](https://travis-ci.org/samiBendou/space3)
[![License](https://img.shields.io/npm/l/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)

Javascript has become a very common language for 3D animation and physics simulation.
Theses applications are very intensive and impose the need of both fast computation and 
easy to use API.


space3 is a **rich high performance API for maths 3D maths**. It is designed
with hardcore time optimization in mind and achieve performances comparable to [glMatrix](http://glmatrix.net/) on
mathematical operations.

## Featuring

- **WebGL support** with array based classes for matrix and vectors inheriting from `Float64Array`, column-major matrices, ...

- **Vast API** designed to perform many general purpose mathematical operations and specialized operations 
for computer graphics, mechanics and numeric simulation, geometry...

- **Typescript implementation** with standardized interfaces to allow easily subclassing over the framework and 
simplifies API.

- **Object oriented** and **functional** paradigm for mathematical operations in order to make syntax as clear as possible
while staying concise and compact.

- **Intuitive syntax** that makes 3D maths intuitive and formulas easy to drop. You'll almost never find yourself
writing a math formula on more than a code line.

- **Fully documented** with [examples]() and [reference]()

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

### Syntax

```js
let u = new Vector3(1, 2, 3), v = Vector3.ones;
let w = sub(u, v, v.mulc(10));
u.add(v).mul(6);

let m = Matrix3.rotX(Math.PI / 2);
v = m.prodv(add(w, v, u));
u.rot(w, Math.PI);

let p = new Point3(1, 2, 3, Vector3.ey), q = Point3.zeros;
p.origin = Vector3.zeros;
let u = p.to(q);
p.translate(u);
```

### Contribution guidelines

If you want to improve math javascript experience
don't hesitate to contribute all kind of improvements are welcomed [CONTRIBUTING.md](https://github.com/samiBendou/space3/blob/master/CONTRIBUTING.md)