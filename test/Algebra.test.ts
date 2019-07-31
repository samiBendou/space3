import {assert} from "chai";
import * as assert3 from "./assert3";
import * as Algebra from "../src/Algebra";
import Vector3 from "../src/Vector3";
import Matrix3 from "../src/Matrix3";
import {epsilon} from "../src/common";

describe("Algebra Tests", () => {

    let vectors: Vector3[];
    let matrices: Matrix3[];
    let scalars: number[];

    beforeEach(() => {
        vectors = [Vector3.ex, Vector3.ey, Vector3.ez];
        scalars = [1, 2, 3];
        matrices = [Matrix3.eye, Matrix3.ones, Matrix3.scalar(5)];
    });

    describe("Equality", () => {
        describe("exact", () => {
            it("differentiates", () => assert.isFalse(Algebra.exact(...vectors)));
            it("equals", () => assert.isTrue(Algebra.exact(vectors[0], vectors[0])));
            it("is epsilon precise", () => assert.isFalse(vectors[0].exact(new Vector3(1 + epsilon, 0, 0))));
        });
        describe("norm 1", () => {
            it("differentiates", () => assert.isFalse(Algebra.equal1(...vectors)));
            it("equals", () => assert.isTrue(Algebra.equal1(vectors[0], vectors[0])));
            it("is epsilon precise", () => assert.isFalse(vectors[0].equal1(new Vector3(1 + epsilon, 0, 0))));
        });
        describe("norm 2", () => {
            it("differentiates", () => assert.isFalse(Algebra.equal2(...vectors)));
            it("equals", () => assert.isTrue(Algebra.equal2(vectors[0], vectors[0])));
            it("is epsilon precise", () => assert.isFalse(vectors[0].equal2(new Vector3(1 + epsilon, 0, 0))));
        });
    });

    describe("Manipulators", () => {
        it("get floor of vector", () => assert3.equal(Algebra.floor(new Vector3(1.6, 1.6, 1.6)), Vector3.ones));
        it("get ceil of vector", () => assert3.equal(Algebra.ceil(new Vector3(1.6, 1.6, 1.6)), new Vector3(2, 2, 2)));
        it("get round of vector", () => assert3.equal(Algebra.round(new Vector3(1.6, 1.6, 1.6)), new Vector3(2, 2, 2)));
        it("get abs of vector", () => assert3.equal(Algebra.abs(new Vector3(-1, -1, -1)), Vector3.ones));
        it("get max of vectors", () => assert3.equal(Algebra.max(...vectors), Vector3.ones));
        it("get min of vectors", () => assert3.equal(Algebra.min(...vectors), Vector3.zeros));
        it("get trunc of vector", () => assert3.equal(Algebra.trunc(1, new Vector3(1.62, 1.62, 1.62)), new Vector3(1.6, 1.6, 1.6)));
        it("normalizes vectors", () => assert3.equal(Algebra.norm(...vectors), Vector3.ones));
    });

    describe("Algebra", () => {
        describe("Addition", () => {
            it("adds vectors", () => assert3.equal(Algebra.add(...vectors), new Vector3(1, 1, 1)));
            it("adds matrices", () => assert3.equal(Algebra.add(...matrices), new Matrix3(
                7, 1, 1,
                1, 7, 1,
                1, 1, 7
            )));
            it("subtracts vectors", () => assert3.equal(Algebra.sub(Vector3.ones, ...vectors), new Vector3(0, 0, 0)));
            it("negates vectors", () => assert3.equal(Algebra.neg(...vectors), new Vector3(-1, -1, -1)));
            it("does not modify original vectors", () => assert3.equal(vectors[0], Vector3.ex));
        });

        describe("Multiplication", () => {
            it("multiplies vectors", () => assert3.equal(Algebra.prod(...vectors), new Vector3(0, 0, 0)));
            it("multiplies matrices", () => assert3.equal(Algebra.prod(...matrices), new Matrix3(
                5, 5, 5,
                5, 5, 5,
                5, 5, 5
            )));
            it("multiplies vectors by scalar", () => assert3.equal(Algebra.mul(2, ...vectors), new Vector3(2, 2, 2)));
            it("divides vectors by scalar", () => assert3.equal(Algebra.div(0.5, ...vectors), new Vector3(2, 2, 2)));
            it("does not modify original vector", () => assert3.equal(vectors[0], Vector3.ex));
        });

        describe("Linear Combination", () => {
            it("combines vectors", () => assert3.equal(Algebra.comb(scalars, ...vectors), new Vector3(1, 2, 3)));
            it("combines matrices", () => assert3.equal(Algebra.comb(scalars, ...matrices), new Matrix3(
                18, 2, 2,
                2, 18, 2,
                2, 2, 18
            )));
            it("does not modify original vector", () => assert3.equal(vectors[0], Vector3.ex));
        });

        describe("Interpolation", () => {
            let curve = [Vector3.zeros, Vector3.ex, new Vector3(2, 0, 0), new Vector3(3, 0, 0), new Vector3(4, 0, 0)];
            describe("Linear", () => {
                it("gets linear interpolation at 0", () => assert3.equal(Algebra.lerp(0, ...vectors), vectors[0]));
                it("gets linear interpolation at 0.25", () => assert3.equal(Algebra.lerp(0.25, ...vectors), new Vector3(0.5, 0.5, 0)));
                it("gets linear interpolation at 0.5", () => assert3.equal(Algebra.lerp(0.5, ...vectors), vectors[1]));
                it("gets linear interpolation at 1", () => assert3.equal(Algebra.lerp(1, ...vectors), vectors[vectors.length - 1]));
            });
            describe("Hermitian", () => {
                it("gets hermitian interpolation at 0", () => assert3.equal(Algebra.herp(0, ...curve), curve[0]));
                it("gets hermitian interpolation at 0.25", () => assert3.equal(Algebra.herp(0.25, ...curve), new Vector3(0.7777777777777777, 0, 0)));
                it("gets hermitian interpolation at 0.5", () => assert3.equal(Algebra.herp(0.5, ...curve), new Vector3(2, 0, 0)));
                it("gets hermitian interpolation at 0.75", () => assert3.equal(Algebra.herp(0.75, ...curve), new Vector3(3, 0, 0)));
                it("gets hermitian interpolation at 1", () => assert3.equal(Algebra.herp(1, ...curve), curve[curve.length - 1]));
            });
            describe("Bezier", () => {
                it("gets Bezier's interpolation at 0", () => assert3.equal(Algebra.berp(0, ...curve), curve[0]));
                it("gets Bezier's interpolation at 0.25", () => assert3.approximately(Algebra.berp(0.25, ...curve), new Vector3(1, 0, 0), 10 * epsilon));
                it("gets Bezier's interpolation at 0.5", () => assert3.equal(Algebra.berp(0.5, ...curve), new Vector3(2, 0, 0)));
                it("gets Bezier's interpolation at 0.75", () => assert3.equal(Algebra.berp(0.75, ...curve), new Vector3(3, 0, 0)));
                it("gets Bezier's interpolation at 1", () => assert3.equal(Algebra.berp(1, ...curve), curve[curve.length - 1]));
            });
        });
    });

    describe("Derivation", () => {
        const expected = [new Vector3(-1, 1, 0), new Vector3(0, -1, 1)];
        it("gets discrete derivative", () => assert3.equal(Algebra.der1(...vectors), expected));
        it("gets 1-st order derivative", () => assert3.equal(Algebra.der(1, ...vectors), expected));
    });
});