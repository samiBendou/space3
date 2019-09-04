# space3 is a general purpose maths framework !
[![Version](https://img.shields.io/npm/v/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)
[![Build status](https://img.shields.io/travis/samiBendou/space3.svg?style=flat-square)](https://travis-ci.org/samiBendou/space3)
[![License](https://img.shields.io/npm/l/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)

## Brief

_space3_ is a **rich and intuitive 3D maths API** for _algebra_, _geometry_, _ODE solving_ and _curve manipulation_.

It reaches **surprisingly fast computation** while **keeping mathematical code natural** to read and write.

## Featuring

- **WebGL support** with array based classes inheriting from `Float64Array`, column-major matrices, ...

- **Three.js support** with compatible 3D coordinates manipulation, ...

- **Vast API** designed to perform maths computation useful for _computer graphics_, _numerical simulation_, _mechanics_, _physics_...

- **Object oriented** and **functional** intuitive syntax that makes formulas easy to drop. 

- **Written in Typescript** with standardized interfaces to allow easily subclassing over the framework and make the API simpler to use.

- **Fully documented** with step-by-step guides and a complete reference

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
let u = new Vector3(1, 2, 3), v = Vector3.ones, er = Vector3.er(u);
let w = sub(u, v, v.mulc(10));
let r = 5;
u.add(v).mul(6);
v.copy(er.mul(r));

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

The documentation website contains a **complete reference** and **step-by-step guides**.

The guides are written such that beginners in maths and/or programming can easily get started 
but provides rigorous documentation for more advanced users.

**[Documentation Website](https://samibendou.github.io/space3/)**

**[Unit tests](https://github.com/samiBendou/space3/tree/master/test)**

## Contributions
If you want to improve math javascript experience don't hesitate to contribute. 
All kind of improvements are welcomed !

**[CONTRIBUTING.md](https://github.com/samiBendou/space3/blob/master/CONTRIBUTING.md)**