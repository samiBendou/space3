import BasicCurve from "./BasicCurve";
import Curve from "./common/Curve";
import Vector from "./common/Vector";

export default class BufferCurve<T extends Vector>
  extends BasicCurve<T>
  implements Curve<T>
{
  private _addIndex: number;

  /** explicitly construct a curve by giving, positions, origins and time step(s) */
  constructor(positions: T[] = []) {
    super(positions);
    this._addIndex = 0;
  }

  get(i: number): T {
    return this.positions[(i + this._addIndex) % this.positions.length];
  }

  set(i: number, position: T): this {
    this.positions[(i + this._addIndex) % this.positions.length].copy(position);
    return this;
  }

  get first() {
    return this.positions[this._addIndex];
  }

  set first(newFirst) {
    this.positions[this._addIndex].copy(newFirst);
  }

  get last() {
    return this.positions[this._lastIndex];
  }

  set last(newLast) {
    this.positions[this._lastIndex].copy(newLast);
  }

  get nexto() {
    return this.positions[this._nextoIndex];
  }

  set nexto(newNexto) {
    this.positions[this._nextoIndex].copy(newNexto);
  }

  /** index of last position in trajectory **/
  private get _lastIndex() {
    return this._addIndex > 0 ? this._addIndex - 1 : this.positions.length - 1;
  }

  /** index of nexto last position in trajectory **/
  get _nextoIndex() {
    return this._addIndex > 1
      ? this._addIndex - 2
      : this.positions.length - 2 + this._addIndex;
  }

  push(position: T): this {
    this.positions[this._addIndex].copy(position);
    this._addIndex = (this._addIndex + 1) % this.positions.length;
    return this;
  }

  pop(): T {
    const position = this.positions[this._lastIndex];
    this._addIndex =
      this._addIndex === 0 ? this.positions.length - 1 : this._addIndex - 1;
    return position;
  }

  clear(): this {
    this._addIndex = 0;
    return this;
  }

  indexAt(x: number = 1): [number, number, number] {
    const scale = x * (this.positions.length - 1),
      i0 = Math.floor(scale + this._addIndex) % this.positions.length,
      i1 = Math.min(this.positions.length - 1, i0 + 1);
    return [i0, i1, scale - Math.floor(scale)];
  }

  positionAt(x: number = 1): T {
    const [i0, i1, dx] = this.indexAt(x);
    return this.positions[i0].lerpc(this.positions[i1], dx) as T;
  }

  lengthAt(x: number = 1): number {
    const [i0, i1, dx] = this.indexAt(x);
    let length = 0;
    for (let i = this._addIndex; i <= i0; i++) {
      length += this.positions[i].dist(this.positions[i - 1]);
    }

    return length + this.positions[i1].dist(this.positions[i0]) * dx;
  }

  static bufferize<T extends Vector>(curve: BasicCurve<T>) {
    return new BufferCurve(curve.positions);
  }
}
