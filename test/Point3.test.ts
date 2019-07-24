import {assert} from "chai";
import * as assert3 from "./assert3";
import {Vector3} from "../src/Vector3";
import {Matrix3} from "../src/Matrix3";
import {Point3} from "../src/Point3";

describe("Point3 Tests", () => {

    let m: Point3, p: Point3, zeros: Point3;

    beforeEach(() => {
        m = new Point3(1, 0, 0, Vector3.ey);
        p = new Point3(1, 0, 0);
        zeros = new Point3(0, 0, 0);
    });
    it("initialized", () => assert.isTrue(m[0] === 1 && m[1] === 0 && m[2] === 0 && m.origin.equal2(Vector3.ey)));

    describe("Generators", () => {
    });

    describe("Zero", () => {
        describe("norm 2", () => {
            it("gets zero", () => assert.isTrue(zeros.zero2()));
            it("differentiates zeros", () => assert.isFalse(p.zero2()));
        });
    });

    describe("Manipulators", () => {
        it("gets max", () => assert3.equal(p.maxc(m), new Point3(1, 1, 0)));
        it("gets min", () => assert3.equal(p.minc(m), new Point3(1, 0, 0)));
    });

    describe("Algebra", () => {
        it("adds points", () => assert3.equal(p.addc(m), new Point3(2, 1, 0)));
        it("adding doesn't change origin", () => assert3.equal(p.add(m).origin, [0, 0, 0]));
        it("subtract points", () => assert3.equal(p.subc(m), new Point3(0, 1, 0)));
        it("subtracting doesn't change origin", () => assert3.equal(p.sub(m).origin, [0, 0, 0]));
        it("combines points", () => assert3.equal(m.combc(2, p), new Point3(3, -2, 0, Vector3.ey)));
        it("interpolates points", () => assert3.equal(m.lerpc(p, 0.5), new Point3(1, -0.5, 0, Vector3.ey)));
    });

    describe("Geometry", () => {
        describe("Magnitude", () => {
            it("gets magnitude", () => assert.equal(m.mag, 1));
            it("gets squared magnitude", () => assert.equal(m.mag2, 1));
        });

        describe("Distance", () => {
            it("gets magnitude", () => assert.equal(m.dist(p), 1));
            it("gets squared magnitude", () => assert.equal(m.dist2(p), 1));
        });
    });

    describe("Coordinates", () => {
        describe("Getters", () => {
            it("gets x", () => assert.equal(m.x, 1));
            it("gets y", () => assert.equal(m.y, 0));
            it("gets z", () => assert.equal(m.z, 0));
            it("gets xyz", () => assert3.equal1D(m.xyz, [1, 0, 0]));
        });

        describe("Setters", () => {
            it("doesn't change origin", () => {
                p.z = 2;
                assert3.equal(p.origin, new Point3(0, 0, 0));
                p.xyz = [3, 4, 1];
                assert3.equal(p.origin, Vector3.zeros);
            });
            it("sets values", () => {
                p.x = 0;
                p.y = 1;
                assert3.equal(p, new Point3(0, 1, 0));
                p.xyz = [3, 4, 1];
                assert3.equal(p, new Point3(3, 4, 1));
            });
        });
    });

    describe("Origin", () => {
       it("gets", () => assert3.equal(m.origin, Vector3.ey));
       it("sets", () => {
           m.origin = Vector3.zeros;
           assert3.equal(m, new Point3(1, 1, 0));
           assert3.equal(m.origin, Vector3.zeros);
       });
    });

    describe("Absolute Position", () => {
        it("gets", () => assert3.equal(m.absolute, new Point3(1, 1, 0)));
        it("sets", () => {
            m.absolute = Vector3.zeros;
            assert3.equal(m.origin, [0, 1, 0]);
            assert3.equal(m, new Point3(0, -1, 0, Vector3.ey));
        });
    });

    describe("At/To", () => {
        it("gets position at origin", () => assert3.equal(m.at(Vector3.zeros), new Point3(1, 1, 0)));
        it("this to vector", () => assert3.equal(m.to(p), new Vector3(0, -1, 0)));
    });

    describe("Affine", () => {
        it("gets affine transform", () => {
            let affOM = m.clone().affine(Matrix3.rotZ(Math.PI / 4), Vector3.ones);
            assert.approximately(affOM.y, affOM.y, Number.EPSILON)
        });
    });
});