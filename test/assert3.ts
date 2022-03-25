import { assert } from "chai";
import Encoder from "../src/common/Encoder";
import Vector from "../src/common/Vector";

type Vectors = Vector | Vector[] | number[];

const arrayString = (array: number[]) =>
  `(${array.slice(1).reduce((acc, x) => acc + ", " + x, array[0].toString())})`;

const defaultMessage = (
  actual: Encoder | number[],
  expected: Encoder | number[]
) => {
  if (expected instanceof Array || actual instanceof Array)
    return `${actual.constructor.name} not equal :\n${arrayString(
      actual as number[]
    )}\n!=\n${arrayString(expected as number[])}`;
  else
    return `${actual.constructor.name} not equal :\n${(
      actual as Encoder
    ).string()}\n!=\n${(expected as Encoder).string()}`;
};

export function equal(actual: Vectors, expected: Vectors, message?: string) {
  if (actual instanceof Array)
    arrayCompare(actual as Vector[], expected as Vector[]);
  else {
    message = message || defaultMessage(actual as Encoder, expected as Encoder);
    assert((actual as Vector).equal2(expected as Vector), message);
  }
}

export function approximately(
  actual: Vectors,
  expected: Vectors,
  tol: number,
  message?: string
) {
  if (actual instanceof Array)
    arrayCompare(actual as Vector[], expected as Vector[], tol);
  else {
    message = message || defaultMessage(actual as Encoder, expected as Encoder);
    assert.approximately(
      (actual as Vector).dist(expected as Vector),
      0,
      tol,
      message
    );
  }
}

export function equal1D(
  actual: number[],
  expected: number[],
  tol?: number,
  index?: number
) {
  actual.forEach((value: number, i: number) => {
    let message = `\n${actual}\n${expected}\nindex: ${
      index ? i + ", " + index : i
    }`;
    if (tol === undefined) assert.equal(value, expected[i], message);
    else assert.approximately(value, expected[i], tol, message);
  });
}

export function equal2D(
  actual: number[][],
  expected: number[][],
  tol?: number
) {
  actual.forEach((row: number[], i: number) => {
    equal1D(row, expected[i], tol, i);
  });
}

export function solved(
  approx: Vector[],
  exact: (t: number) => Vector,
  tol: number,
  shift = 0
) {
  approx.forEach((u: Vector, index: number) => {
    assert.approximately(
      u.dist(exact(index + shift)),
      0,
      tol,
      `${u} != ${exact(index + shift)} index: ${index}`
    );
  });
}

function arrayCompare(actual: Vector[], expected: Vector[], tol?: number) {
  actual.forEach((value: Vector & Encoder, index: number) => {
    let message = `\n${actual}\n${expected}\nindex: ${index}`;
    if (tol) {
      approximately(value, expected[index], tol, message);
    } else {
      equal(value, expected[index], message);
    }
  });
}
