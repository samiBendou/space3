import Curve from "./common/Curve";
import Matrix from "./common/Matrix";
import Vector from "./common/Vector";

export default class BasicCurve<T extends Vector> implements Curve<T> {
  /** position vectors representing the curve */
  positions: T[];

  /** explicitly construct a curve by giving, positions, origins and time step(s) */
  constructor(positions: T[] = []) {
    this.positions = positions;
  }

  get(i: number): T {
    return this.positions[i];
  }
  set(i: number, position: T): this {
    this.positions[i].copy(position);
    return this;
  }

  get first() {
    return this.positions[0];
  }

  set first(newFirst) {
    this.positions[0].copy(newFirst);
  }

  get last() {
    return this.positions[this.positions.length - 1];
  }

  set last(newLast) {
    this.positions[this.positions.length - 1].copy(newLast);
  }

  /** position vector of the curve next to last **/
  get nexto() {
    return this.positions[this.positions.length - 2];
  }

  set nexto(newLast) {
    this.positions[this.positions.length - 2].copy(newLast);
  }

  push(position: T): this {
    this.positions.push(position.clone() as T);
    return this;
  }

  pop(): T {
    return this.positions.pop();
  }

  clear(): this {
    this.positions = [];
    return this;
  }

  translate(u: T) {
    this.positions.forEach((position) => {
      position.add(u);
    });
    return this;
  }

  transform<U extends Matrix>(m: U) {
    this.positions.forEach((position) => {
      m.prodv(position);
    });
    return this;
  }

  affine<U extends Matrix>(m: U, v: T) {
    this.positions.forEach((position) => {
      m.prodv(position).add(v);
    });
    return this;
  }

  indexAt(x: number = 1): [number, number, number] {
    const scale = x * (this.positions.length - 1),
      i0 = Math.floor(scale),
      i1 = Math.min(this.positions.length - 1, i0 + 1);
    return [i0, i1, scale - i0];
  }

  positionAt(x: number = 1): T {
    const [i0, i1, dx] = this.indexAt(x);
    return this.positions[i0].lerpc(this.positions[i1], dx) as T;
  }

  lengthAt(x: number = 1): number {
    const [i0, i1, dx] = this.indexAt(x);
    let length = 0;
    for (let i = 1; i <= i0; i++) {
      length += this.positions[i].dist(this.positions[i - 1]);
    }

    return length + this.positions[i1].dist(this.positions[i0]) * dx;
  }

  /**
   * @brief generates a constant curve ie. a point.
   * @details The position is constant and the step is non zero
   * @param u position of the point
   * @param size number of samples
   * @param dt time step
   */
  static zeros<T extends Vector>(u: T, size: number) {
    let array = [];
    for (let i = 0; i < size; i++) {
      array.push(u.clone());
    }
    return new BasicCurve(array);
  }

  /**
   * @brief generates a curve that is the graph of a function.
   * @details Samples the function `f` from `f(a)` to `f(b)` with constant time step
   * @param f vector valued function that depends only on time.
   * @param a starting point to evaluate `f`
   * @param b ending point to evaluate `f`
   * @param dt constant time step to sample `f`
   */
  static graph<T extends Vector>(
    f: (t: number) => T,
    t0: number,
    t1: number,
    dt: number = 1
  ) {
    let array = [];
    for (let x = t0; x < t1; x += dt) {
      array.push(f(x));
    }
    return new BasicCurve(array);
  }
}
