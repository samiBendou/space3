import {assert} from "chai";
import * as assert3 from "./assert3";
import {Vector3} from "../src/Vector3";
import {Matrix3} from "../src/Matrix3";

describe("Matrix3 Tests", () => {

    let a: Matrix3, b: Matrix3, c: Matrix3, cInv: Matrix3, magic: Matrix3;

    beforeEach(() => {
        a = Matrix3.eye;

        b = new Matrix3(
            2, 0, 0,
            0, 2, 0,
            0, 0, 2
        );

        c = new Matrix3(
            2, -1, 0,
            -1, 2, -1,
            0, -1, 2
        );

        cInv = new Matrix3(
            0.75, 0.50, 0.25,
            0.50, 1.00, 0.50,
            0.25, 0.50, 0.75
        );

        magic = new Matrix3(
            1, 2, 3,
            1, 2, 3,
            1, 2, 3
        );
    });


    describe("Geometry", () => {
        let d = 1 / Math.sqrt(3);
        it("norms the vector", () => assert3.equal(a.normc(), new Matrix3(
            d, 0, 0,
            0, d, 0,
            0, 0, d
        )));

        describe("Magnitude", () => {
            it("gets magnitude", () => assert.equal(b.mag, Math.sqrt(12)));
            it("gets squared magnitude", () => assert.equal(b.mag2, 12));
        });

        describe("Distance", () => {
            it("gets distance", () => assert.equal(a.dist(b), Math.sqrt(3)));
            it("gets squared distance", () => assert.equal(a.dist2(b), 3));
        });
    });

    describe("Transposition", () => {
        it("gets transpose", () => assert3.equal(magic.transc(), new Matrix3(
            1, 1, 1,
            2, 2, 2,
            3, 3, 3
        )));
    });

    describe("Matrix Multiplication", () => {
        it("conserves identity", () => assert3.equal(a.prodc(a), new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        )));
        it("gets product", () => assert3.equal(magic.prodc(b), magic.mulc(2)));
    });

    describe("Vector Multiplication", () => {
        let u = Vector3.ones;
        it("conserves identity", () => assert3.equal(a.mapc(u), u));
        it("gets product", () => assert3.equal(magic.mapc(u), new Vector3(6, 6, 6)));
    });

    describe("Determinant", () => {
        it("gets 1 on identity", () => assert.approximately(a.det, 1, Number.EPSILON));
        it("gets 0 on non invertible", () => assert.approximately(magic.det, 0, Number.EPSILON));
        it("gets determinant", () => assert.approximately(c.det, 4, Number.EPSILON));
    });

    describe("Inversion", () => {
        it("conserves identity", () => assert3.equal(a.invc(), a));
        it("gets inverse", () => assert3.equal(c.invc(), cInv));
        it("can return to neutral", () => assert3.equal(c.prod(c.invc()), a));
    });

    describe("Exponentiation", () => {
        it("conserves identity", () => assert3.equal(a.powc(3), a));
        it("return identity on 0", () => assert3.equal(magic.powc(0), a));
        it("is neutral on 1", () => assert3.equal(c.powc(1), c));
        it("gets product on positive", () => assert3.equal(a.mulc(2).pow(4), Matrix3.eye.mul(16)));
        it("gets product on negative", () => assert3.equal(c.powc(-1), cInv));
    });

    describe("Row/Col", () => {
        let assertRow = new Vector3(1, 2, 3);
        it("gets row 0", () => assert3.equal(magic.row(0), assertRow));
        it("gets row 2", () => assert3.equal(magic.row(2), assertRow));

        it("gets col 0", () => assert3.equal(a.col(0), Vector3.ex));
        it("gets col 2", () => assert3.equal(a.col(2), Vector3.ez));

        it("sets row with vectors", () => {
            a.xyz = [Vector3.ez, Vector3.ey, Vector3.ex];
            assert3.equal(a, new Matrix3(
                0, 0, 1,
                0, 1, 0,
                1, 0, 0,
            ));})
    });

    describe("Circular Rotation", () => {
        const angle = Math.PI / 2;

        it("rotates around Ox", () =>
            assert3.equal(Matrix3.rotX(Math.PI / 2).map(Vector3.ey), Vector3.ez));
        it("rotates around Oy", () =>
            assert3.equal(Matrix3.rotY(Math.PI / 2).map(Vector3.ez), Vector3.ex));
        it("rotates around Oz", () =>
            assert3.equal(Matrix3.rotZ(Math.PI / 2).map(Vector3.ex), Vector3.ey));

        it("generates rotation of axis Ox", () =>
            assert3.equal(Matrix3.rotX(angle), Matrix3.makeRot(Vector3.ex)(angle)));
        it("generates rotation of axis Oy", () =>
            assert3.equal(Matrix3.rotY(angle), Matrix3.makeRot(Vector3.ey)(angle)));
        it("generates rotation of axis Oz", () =>
            assert3.equal(Matrix3.rotZ(angle), Matrix3.makeRot(Vector3.ez)(angle)));
    });

    describe("Elliptic Rotation", () => {
        const angle = Math.PI / 2;
        const a = 2, b = 1;
        const cos = (theta: number) => Math.cos(theta);
        const sin = (theta: number) => b / a * Math.sin(theta);

        it("rotates around Ox", () =>
            assert3.equal(Matrix3.rotX(Math.PI / 2, cos, sin).map(Vector3.ey.mul(a)), Vector3.ez));
        it("rotates around Oy", () =>
            assert3.equal(Matrix3.rotY(Math.PI / 2, cos, sin).map(Vector3.ez.mul(a)), Vector3.ex));
        it("rotates around Oz", () =>
            assert3.equal(Matrix3.rotZ(Math.PI / 2, cos, sin).map(Vector3.ex.mul(a)), Vector3.ey));

        it("generates rotation of axis Ox", () =>
            assert3.equal(Matrix3.rotX(angle, cos, sin), Matrix3.makeRot(Vector3.ex, cos, sin)(angle)));
        it("generates rotation of axis Oy", () =>
            assert3.equal(Matrix3.rotY(angle, cos, sin), Matrix3.makeRot(Vector3.ey, cos, sin)(angle)));
        it("generates rotation of axis Oz", () =>
            assert3.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.makeRot(Vector3.ez, cos, sin)(angle)));
    });

    describe("Hyperbolic Rotation", () => {
        const angle = Math.PI / 2;
        const cos = (theta: number) => Math.cosh(theta);
        const sin = (theta: number) => Math.sinh(theta);

        const resX = Matrix3.rotX(angle, cos, sin).map(Vector3.ey);
        const resY = Matrix3.rotY(angle, cos, sin).map(Vector3.ez);
        const resZ = Matrix3.rotZ(angle, cos, sin).map(Vector3.ex);

        it("rotates around Ox", () =>
            assert.equal(resX.y ** 2 - resX.z ** 2, 1, `\nresX : ${resX}`));
        it("rotates around Oy", () =>
            assert.equal(resY.z ** 2 - resY.x ** 2, 1, `\nresY : ${resY}`));
        it("rotates around Oz", () =>
            assert.equal(resZ.x ** 2 - resZ.y ** 2, 1, `\nresZ : ${resZ}`));

        it("generates rotation of axis Ox",
            () => assert3.equal(Matrix3.rotX(angle, cos, sin), Matrix3.makeRot(Vector3.ex, cos, sin)(angle)));
        it("generates rotation of axis Oy",
            () => assert3.equal(Matrix3.rotY(angle, cos, sin), Matrix3.makeRot(Vector3.ey, cos, sin)(angle)));
        it("generates rotation of axis Oz",
            () => assert3.equal(Matrix3.rotZ(angle, cos, sin), Matrix3.makeRot(Vector3.ez, cos, sin)(angle)));
    });

    describe("Serialize", () => {
        let a2D = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        let a1D = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        it("encodes to 1D array", () => assert3.equal1D(a.array(), a1D));
        it("encodes to 2D array", () => assert3.equal2D(a.array2(), a2D));

        it("decodes from 1D array", () => assert3.equal(Matrix3.array(a1D), a));
        it("decodes from 2D array", () => assert3.equal(Matrix3.array2(a2D), a));

        it("encodes to string", () =>
            assert.equal(a.string(), "(1.00e+0 0.00e+0 0.00e+0)\n(0.00e+0 1.00e+0 0.00e+0)\n(0.00e+0 0.00e+0 1.00e+0)"));
    });

    describe("Generators", () => {
        it("gets diagonal", () => assert3.equal(Matrix3.diag(1, 1, 1), a));
        it("gets symmetrical", () => assert3.equal(Matrix3.sym(2, 2, 2, -1, -1), c));
        it("gets anti-symmetrical", () => assert3.equal(Matrix3.asym(2, 2, 2, 1, 1), new Matrix3(
            2, 1, 0,
            -1, 2, 1,
            0, -1, 2
        )));
    });
});