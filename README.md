# space3 is a general purpose maths framework !
[![Version](https://img.shields.io/npm/v/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)
[![Build status](https://img.shields.io/travis/samiBendou/space3.svg?style=flat-square)](https://travis-ci.org/samiBendou/space3)
[![License](https://img.shields.io/npm/l/space3.svg?style=flat-square)](https://www.npmjs.com/package/space3)

#### Algebra and Geometry 
#### Differential equations and Curves

## Brief

_space3_ is a **rich and intuitive API for 3D maths**. 
It allows to perform algebra, geometry, ODE solving and curve manipulation.

It reaches **surprisingly fast computation** while **keeping mathematical code natural** to read and write.

The implementation is largely inspired from [glMatrix](http://glmatrix.net/) codebase but the API is very different.

## Featuring
- **WebGL support** with array based classes inheriting from `Float64Array`, column-major matrices, ...

- **Three.js support** with compatible 3D coordinates manipulation, ...

- **Vast API** designed to perform maths computation useful for _computer graphics_, _numerical simulation_, _mechanics_, _physics_...

- **Object oriented** and **functional** intuitive syntax to use at convenience that makes formulas easy to drop. 

- **Written in Typescript** with standardized interfaces to allow easily subclassing over the framework and make the API simpler to use.

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

The documentation website contains a **complete reference** and **step-by-step guides** for each main feature.

**[Documentation Website](https://samibendou.github.io/space3/)**

**[Unit tests](https://github.com/samiBendou/space3/tree/master/test)**

## Contributions
If you want to improve math javascript experience don't hesitate to contribute. 
All kind of improvements are welcomed !

**[CONTRIBUTING.md](https://github.com/samiBendou/space3/blob/master/CONTRIBUTING.md)**