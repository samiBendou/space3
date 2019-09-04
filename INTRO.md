## Documentation of space3

### Introduction

Welcome to the documentation of the space3 framework !
- **Complete reference** for classes, methods, ...
- **Step by step** guides learn how to use the main features

**Note** step by step guides can be found at the start of each page of this documentation.

This page is a quick start guide that presents the philosophy of the framework
and introduce you to the main features. I advise you to start there even if
you are already familiar with maths framework. The reason is that here is defined :
- **Nomenclature** for mathematical operations
- **Naming** convention used for variables
- **Paradigms** provided by the framework

### Quick start

#### Basic concepts
**space3** is a general purpose class library for 3D math. Welcome to the wonderful land of _algebra_ and _advanced calculus_.
It provides handy **classes for matrices, vectors, curves, ode, ...**

The main goal, is to shorten maths expressions by introducing **standardized and rich API**, but with minimal computational cost.  

The syntax is directly inspired from what can be done with **operators in C**. The main advantage is to keep
implementation of mathematics **as natural as possible**.

**Note** Despite of it's name the framework does not represent only object of dimension 3 or 9

#### Conventions
In all the documentation and the code we will refer to :
- `u`, `v`, `w` as vector
- `m`, `a`, `b`, `c` as matrix
- `p`, `q` as point
- `s`, `t` as real number
- `i` as row index of a matrix
- `j` as column index of a matrix
- A series of vectors/matrices/numbers will be noted `uk` where `k = 0, 1, 2, ...`

### Mathematical operations

This framework provides a huge range of mathematical operations compared to other ones.
In order to keep all theses operations consistent along the classes, this framework comes with **typescript interfaces**.
 
It achieves a **standardization of mathematical operations**,
providing you the same syntax and equivalent specification for all operations that have equivalent meaning along the framework.

#### Example

```js
u.add(v); // vector addition
a.add(b); // matrix addition
p.add(q); // point addition (Chalses relation)
```

If you want to know more about all the mathematical operations provided see :
- [[Vector]] page for algebra
- [[Vector3]] page for geometry
- [[Object3]] page for rotations
- [[Curve]] page for parametrized curves manipulation
- [[Solver]] page for differential equations solving

#### Glossary
The framework introduces a lot of abbreviations.
Here is a glossary that resumes the definition of each.

| Abbreviation   | Name          | Operation        |
| ---------------|---------------|------------------|
| `add`          | addition      |`u += v`          |
| `sub`          | subtraction   |`u -= v`          |
| `mul`          | multiplication|`u *= s`          |
| `div`          | division      |`u /= s`          |
| `comb`         | combination   |`u += v * s`      |
| `[lhb]erp`     | interpolation |`u += (v-u) * s`  |
| `der`          | derivation    |`u = (v-u) / ds`  |
| `prod`         | product       |`u *= v`          |
| `inv`          | inversion     |`u **= -1`        |
| `norm`         | normalization |`u /= u . u`      |
| `dot`          | dot product   |`u . v`           |
| `mag`          | magnitude/norm|`sqrt(u . u)`     |
| `dist`         | distance      |`d2(u, v)`        |
| `equal`        | equality      |`u == v`          |
| `zero` or `nil`| 0 comparison  |`u == 0`          |
| `rot`          | rotation      |`u = rot(theta)`  |

### Object oriented interface
The framework is natively written using object oriented paradigm. `u = u op v` becomes `u.op(v)`.
All mathematical abstraction are classes and quasi all operations are instance method.

#### Example
```js
u1 = u.addc(w).add(v);
u2 = u.subc(w.addc(v).div(s));
a = m1.prodc(m2.powc(2)).prod(m3);
```
It allows to perform binary operations in way such that `u.op(v)` stores the result of `op` in `u`, erasing the
initial content of `u` but avoid cloning objects after operations.

This syntax allows surprisingly fast computing by minimizing the number of new instance to create while performing operations.

**Note** Call `c` suffixed method to return a new instance and avoid modify the calling object.

### Functional interface
The framework provides a functional interface. `u = u op v op w` becomes `u = op(u, v, w)`. 
That is almost the same as the object oriented API but is more convenient for operations over large ranges of vectors. 

#### Example
```js
u1 = add(u, w, v);
u2 = sub(u, div(s, w, v));
a = prod(m1, m2.powc(2), m3);
```
It allows to perform operations using the syntax `op(u, v, w)` instead of `u.opc(v).op(w)` with quasi no performance loss.
The argument objects are not modified during operation, a new instance is always returned.

**Note** Use and mix the two syntax at convenience.

### Generation of objects
All classes comes with handy generators to avoid you writing the same `new Vector(1, 0, 0)` again and again.

#### Example
```js
let u = Vector3.zeros; // new vector filled with 0
let v = Vector3.ex; // new vector (1, 0, 0)
let m = Matrix3.ones; // new matrix filled with 1
let n = Matrix3.eye; // new identity matrix
let q = Matrix3.scalar(6); // diagonal matrix filled with 6
```
