import * as assert3 from "./assert3";
import * as Algebra from "../src/Algebra";
import {Vector3} from "../src/Vector3";
import {Matrix3} from "../src/Matrix3";

describe("Algebra Tests", () => {

    let vectors: Vector3[];
    let matrices: Matrix3[];
    let scalars: number[];

    beforeEach(() => {
        vectors = [Vector3.ex, Vector3.ey, Vector3.ez];
        scalars = [1, 2, 3];
        matrices = [Matrix3.eye, Matrix3.ones, Matrix3.scalar(5)];
    });

    describe("Addition", () => {
        it("adds vectors", () => assert3.equal(Algebra.add(vectors), new Vector3(1, 1, 1)));
        it("adds matrices", () => assert3.equal(Algebra.add(matrices), new Matrix3(
            7, 1, 1,
            1, 7, 1,
            1, 1, 7
        )));
        it("does not modify original vector", () => assert3.equal(vectors[0], Vector3.ex));
    });

    describe("Multiplication", () => {
        it("multiplies vectors", () => assert3.equal(Algebra.prod(vectors), new Vector3(0, 0, 0)));
        it("multiplies matrices", () => assert3.equal(Algebra.prod(matrices), new Matrix3(
            5, 5, 5,
            5, 5, 5,
            5, 5, 5
        )));
        it("does not modify original vector", () => assert3.equal(vectors[0], Vector3.ex));
    });

    describe("Linear Combination", () => {
        it("combines vectors", () => assert3.equal(Algebra.comb(scalars, vectors), new Vector3(1, 2, 3)));
        it("combines matrices", () => assert3.equal(Algebra.comb(scalars, matrices), new Matrix3(
            18, 2, 2,
            2, 18, 2,
            2, 2, 18
        )));
        it("does not modify original vector", () => assert3.equal(vectors[0], Vector3.ex));
    });

    describe("Derivation", () => {
        const expected = [new Vector3(-1, 1, 0), new Vector3(0, -1, 1)];
        it("gets derivative", () => assert3.equal(Algebra.der([vectors[0], vectors[1], vectors[2]], 1), expected));
    });
});