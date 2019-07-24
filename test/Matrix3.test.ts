import {assert} from "chai";
import * as assert3 from "./assert3";
import {Vector3} from "../src/Vector3";
import {Matrix3} from "../src/Matrix3";
import {epsilon} from "../src/Algebra";

describe("Matrix3 Tests", () => {

    let eye: Matrix3, a: Matrix3, b: Matrix3, c: Matrix3, magic: Matrix3, zeros: Matrix3, ones: Matrix3;

    beforeEach(() => {
        eye = new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1);

        a = new Matrix3(
            2, 0, 0,
            0, 2, 0,
            0, 0, 2);

        b = new Matrix3(
            2, -1, 0,
            -1, 2, -1,
            0, -1, 2);

        // inverse of b
        c = new Matrix3(
            0.75, 0.50, 0.25,
            0.50, 1.00, 0.50,
            0.25, 0.50, 0.75);

        zeros = new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0);

        ones = new Matrix3(
            1, 1, 1,
            1, 1, 1,
            1, 1, 1);

        magic = new Matrix3(
            1, 2, 3,
            1, 2, 3,
            1, 2, 3);
    });

    it("initialized", () => assert3.equal1D([
        magic[0], magic[3], magic[6],
        magic[1], magic[4], magic[7],
        magic[2], magic[5], magic[8],
    ], [
        1, 2, 3,
        1, 2, 3,
        1, 2, 3
    ]));

    describe("Zero", () => {
        it("gets zero norm 2", () => assert.isTrue(zeros.zero2()));
        it("differentiates zeros norm 2", () => assert.isFalse(ones.zero2()));
    });

    describe("Equality", () => {
        it("differentiates norm 2", () => assert.isFalse(ones.equal2(magic)));
        it("equals norm 2", () => assert.isTrue(magic.equal2(magic)));
    });

    describe("Clone/Copy", () => {
        it("clones object", () => assert3.equal(eye.clone(), new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1)));
        it("does not modify original object", () => {
            magic.clone()[0] = 5;
            assert.equal(magic[0], 1);
        });
        it("copies object", () => assert3.equal(eye.copy(magic), magic));
    });

    describe("Generators", () => {
        it("gets zeros", () => assert3.equal(Matrix3.zeros, zeros));
        it("gets ones", () => assert3.equal(Matrix3.ones, ones));
        it("gets scalar", () => assert3.equal(Matrix3.scalar(2), a));
        it("gets identity", () => assert3.equal(Matrix3.eye, eye));
        it("gets diagonal", () => assert3.equal(Matrix3.diag(1, 1, 1), eye));
        it("gets symmetrical", () => assert3.equal(Matrix3.sym(2, 2, 2, -1, -1), b));
        it("gets anti-symmetrical", () => assert3.equal(Matrix3.asym(2, 2, 2, 1, 1), new Matrix3(
            2, 1, 0,
            -1, 2, 1,
            0, -1, 2
        )));

        describe("Circular Rotation", () => {
            const angle = Math.PI / 2;

            it("rotates around Ox", () =>
                assert3.equal(Matrix3.rotX(Math.PI / 2).at(Vector3.ey), Vector3.ez));
            it("rotates around Oy", () =>
                assert3.equal(Matrix3.rotY(Math.PI / 2).at(Vector3.ez), Vector3.ex));
            it("rotates around Oz", () =>
                assert3.equal(Matrix3.rotZ(Math.PI / 2).at(Vector3.ex), Vector3.ey));

            it("generates rotation of axis Ox", () =>
                assert3.equal(Matrix3.rotX(angle), Matrix3.rot(Vector3.ex, angle)));
            it("generates rotation of axis Oy", () =>
                assert3.equal(Matrix3.rotY(angle), Matrix3.rot(Vector3.ey, angle)));
            it("generates rotation of axis Oz", () =>
                assert3.equal(Matrix3.rotZ(angle), Matrix3.rot(Vector3.ez, angle)));
        });

        describe("Elliptic Rotation", () => {
            const angle = Math.PI / 2;
            const a = 2, b = 1;
            const cos = (theta: number) => Math.cos(theta),
                sin = (theta: number) => b / a * Math.sin(theta);

            it("rotates around Ox", () =>
                assert3.equal(Matrix3.rotX(Math.PI / 2, cos, sin).at(Vector3.ey.mul(a)), Vector3.ez));
            it("rotates around Oy", () =>
                assert3.equal(Matrix3.rotY(Math.PI / 2, cos, sin).at(Vector3.ez.mul(a)), Vector3.ex));
            it("rotates around Oz", () =>
                assert3.equal(Matrix3.rotZ(Math.PI / 2, cos, sin).at(Vector3.ex.mul(a)), Vector3.ey));

            it("generates rotation of axis Ox", () =>
                assert3.equal(Matrix3.rotX(angle, cos, sin), Matrix3.rot(Vector3.ex, angle, cos, sin)));
            it("generates rotation of axis Oy", () =>
                assert3.equal(Matrix3.rotY(angle, cos, sin), Matrix3.rot(Vector3.ey, angle, cos, sin)));
            it("generates rotation of axis Oz", () =>
                assert3.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.rot(Vector3.ez, angle, cos, sin)));
        });

        describe("Hyperbolic Rotation", () => {
            const angle = Math.PI / 2, tol = 0.2e-6;
            const cos = (theta: number) => Math.cosh(theta),
                sin = (theta: number) => Math.sinh(theta);

            const resX = Matrix3.rotX(angle, cos, sin).at(Vector3.ey),
                resY = Matrix3.rotY(angle, cos, sin).at(Vector3.ez),
                resZ = Matrix3.rotZ(angle, cos, sin).at(Vector3.ex);

            it("rotates around Ox", () =>
                assert.approximately(resX.y ** 2 - resX.z ** 2, 1, tol, `\nresX : ${resX}`));
            it("rotates around Oy", () =>
                assert.approximately(resY.z ** 2 - resY.x ** 2, 1, tol, `\nresY : ${resY}`));
            it("rotates around Oz", () =>
                assert.approximately(resZ.x ** 2 - resZ.y ** 2, 1, tol, `\nresZ : ${resZ}`));

            it("generates rotation of axis Ox",
                () => assert3.equal(Matrix3.rotX(angle, cos, sin), Matrix3.rot(Vector3.ex, angle, cos, sin)));
            it("generates rotation of axis Oy",
                () => assert3.equal(Matrix3.rotY(angle, cos, sin), Matrix3.rot(Vector3.ey, angle, cos, sin)));
            it("generates rotation of axis Oz",
                () => assert3.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.rot(Vector3.ez, angle, cos, sin)));
        });
    });

    describe("Coordinates", () => {
        it("gets xx", () => assert.equal(b.xx, 2));
        it("gets yx", () => assert.equal(b.yx, -1));
        it("gets zx", () => assert.equal(b.zx, 0));
        it("gets xy", () => assert.equal(b.xy, -1));
        it("gets yy", () => assert.equal(b.yy, 2));
        it("gets zy", () => assert.equal(b.zy, -1));
        it("gets xz", () => assert.equal(b.xz, 0));
        it("gets yz", () => assert.equal(b.yz, -1));
        it("gets zz", () => assert.equal(b.zz, 2));
    });

    describe("Manipulators", () => {
        describe("Rows", () => {
            describe("Getters", () => {
                const array0 = [1, 0, 0], array1 = [0, 1, 0], array2 = [0, 0, 1];
                const u0 = Vector3.array(array0), u1 = Vector3.array(array1), u2 = Vector3.array(array2);

                it("gets row 0", () => assert3.equal1D(eye.row(0), array0));
                it("gets row 1", () => assert3.equal1D(eye.row(1), array1));
                it("gets row 2", () => assert3.equal1D(eye.row(2), array2));
                it("gets row x", () => assert3.equal(eye.x, u0));
                it("gets row y", () => assert3.equal(eye.y, u1));
                it("gets row z", () => assert3.equal(eye.z, u2));
                it("gets all rows as 2D array", () => assert3.equal2D(eye.rows, [array0, array1, array2]));
                it("gets all rows as vectors", () => assert3.equal(eye.xyz, [u0, u1, u2]));
            });

            describe("Setters", () => {
                it("set row with vector", () => {
                    eye.x = Vector3.ez;
                    assert3.equal(eye, new Matrix3(0, 0, 1, 0, 1, 0, 0, 0, 1));
                });
                it("sets all rows with vectors", () => {
                    eye.xyz = [Vector3.ez, Vector3.ey, Vector3.ex];
                    assert3.equal(eye, new Matrix3(0, 0, 1, 0, 1, 0, 1, 0, 0,));
                });
                it("sets all rows with 2D array", () => {
                    magic.rows = [[2, 0, 0], [0, 2, 0], [0, 0, 2]];
                    assert3.equal(magic, a);
                });
            });
        });

        describe("Cols", () => {
            describe("Getters", () => {
                const array0 = [1, 1, 1], array1 = [2, 2, 2], array2 = [3, 3, 3];
                const u0 = Vector3.array(array0), u1 = Vector3.array(array1), u2 = Vector3.array(array2);

                it("gets col 0", () => assert3.equal1D(magic.col(0), array0));
                it("gets col 1", () => assert3.equal1D(magic.col(1), array1));
                it("gets col 2", () => assert3.equal1D(magic.col(2), array2));
                it("gets all columns as 2D array", () => assert3.equal2D(magic.cols, [array0, array1, array2]));
                it("gets all columns as vectors", () => assert3.equal(magic.xyzt, [u0, u1, u2]));
            });

            describe("Setters", () => {
                it("sets all columns with vectors", () => {
                    eye.xyzt = [Vector3.ez, Vector3.ey, Vector3.ex];
                    assert3.equal(eye, new Matrix3(0, 0, 1, 0, 1, 0, 1, 0, 0));
                });
                it("sets all columns with 2D array", () => {
                    magic.cols = [[2, 0, 0], [0, 2, 0], [0, 0, 2]];
                    assert3.equal(magic, a);
                });
            });
        });
    });

    describe("Algebra", () => {
        describe("Transposition", () => {
            it("gets transpose", () => assert3.equal(magic.transc(), new Matrix3(
                1, 1, 1,
                2, 2, 2,
                3, 3, 3
            )));
        });

        describe("Matrix Multiplication", () => {
            it("conserves identity", () => assert3.equal(eye.prodc(eye), Matrix3.eye));
            it("gets product", () => assert3.equal(magic.prodc(a), magic.mulc(2)));
        });

        describe("Vector Multiplication", () => {
            const u = Vector3.ones;
            it("conserves identity", () => assert3.equal(eye.atc(u), u));
            it("gets product", () => assert3.equal(magic.atc(u), Vector3.scalar(6)));
        });

        describe("Determinant", () => {
            it("gets 1 on identity", () => assert.approximately(eye.det, 1, epsilon));
            it("gets 0 on non invertible", () => assert.approximately(magic.det, 0, epsilon));
            it("gets determinant", () => assert.approximately(b.det, 4, epsilon));
        });

        describe("Inversion", () => {
            it("conserves identity", () => assert3.equal(eye.invc(), Matrix3.eye));
            it("gets inverse", () => assert3.equal(b.invc(), c));
            it("can return to neutral", () => assert3.equal(b.prod(b.invc()), eye));
        });

        describe("Exponentiation", () => {
            it("conserves identity", () => assert3.equal(eye.powc(3), eye));
            it("return identity on 0", () => assert3.equal(magic.powc(0), eye));
            it("is neutral on 1", () => assert3.equal(b.powc(1), b));
            it("gets product on positive", () => assert3.equal(eye.mulc(2).pow(4), Matrix3.eye.mul(16)));
            it("gets product on negative", () => assert3.equal(b.powc(-1), c));
        });
    });

    describe("Geometry", () => {
        describe("Magnitude", () => {
            it("gets magnitude", () => assert.equal(a.mag, Math.sqrt(12)));
            it("gets squared magnitude", () => assert.equal(a.mag2, 12));
        });

        describe("Distance", () => {
            it("gets distance", () => assert.equal(eye.dist(a), Math.sqrt(3)));
            it("gets squared distance", () => assert.equal(eye.dist2(a), 3));
        });
    });

    describe("Serialize", () => {
        const a2D = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        const a1D = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        it("encodes to 1D array", () => assert3.equal1D(eye.array(), a1D));
        it("encodes to string", () => assert.equal(eye.string(), "(1, 0, 0)\n(0, 1, 0)\n(0, 0, 1)"));
        it("decodes from 1D array", () => assert3.equal(Matrix3.array(a1D), eye));
        it("decodes from 2D array", () => assert3.equal(Matrix3.rows(a2D), eye));
    });

    describe("Generators", () => {
    });
});