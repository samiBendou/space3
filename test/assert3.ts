import {assert} from "chai";
import {Encoder, Vector} from "../src/Algebra";

type Vectors = Vector | Vector[];

const defaultMessage = (actual: Encoder, expected: Encoder) =>
    `${actual.constructor.name} not equal :\n${(actual as Encoder).string()}\n!=\n${(expected as Encoder).string()}`;

export function equal(actual: Vectors, expected: Vectors, message?: string) {
    if (actual instanceof Array)
        arrayCompare(actual as Vector[], expected as Vector[]);
    else {
        message = message || defaultMessage(actual as Encoder, expected as Encoder);
        assert((actual as Vector).equal2(expected as Vector), message);
    }
}

export function approximately(actual: Vectors, expected: Vectors, tol: number, message?: string) {
    if (actual instanceof Array)
        arrayCompare(actual as Vector[], expected as Vector[], tol);
    else {
        message = message || defaultMessage(actual as Encoder, expected as Encoder);
        assert.approximately((actual as Vector).dist(expected as Vector), 0, tol, message);
    }
}

export function equal1D(actual: number[], expected: number[], tol?: number, index?: number) {
    actual.forEach((value: number, i: number) => {
        let message = `\n${actual}\n${expected}\nindex: ${index ? i + ", " + index : i}`;
        if (tol === undefined)
            assert.equal(value, expected[i], message);
        else
            assert.approximately(value, expected[i], tol, message);
    });
}

export function equal2D(actual: number[][], expected: number[][], tol?: number) {
    actual.forEach((row: number[], i: number) => {
        equal1D(row, expected[i], tol, i)
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
