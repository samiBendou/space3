import {assert} from "chai";
import * as assert3 from "./assert3";
import {Vector3} from "../src/Vector3";
import {Matrix3} from "../src/Matrix3";
import {Point3} from "../src/Point3";
import {epsilon} from "../src/Algebra";

describe("Point3 Tests", () => {

    let m: Point3, p: Point3;

    beforeEach(() => {
        m = new Point3(Vector3.ex, Vector3.ey);
        p = new Point3(Vector3.ex);
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

        it("gets angle", () => assert.approximately(m.angle(p), Math.PI / 4, 10 * epsilon));
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
                assert3.equal(p.origin, Vector3.zeros);
                p.xyz = [3, 4, 1];
                assert3.equal(p.origin, Vector3.zeros);
            });
            it("sets values", () => {
                p.x = 0;
                p.y = 1;
                p.z = 2;
                assert3.equal(p.position, new Vector3(0, 1, 2));
                p.xyz = [3, 4, 1];
                assert3.equal(p.position, new Vector3(3, 4, 1));
            });
        });
    });

    describe("Origin", () => {
       it("gets", () => assert3.equal(m.origin, Vector3.ey));
       it("sets", () => {
           m.origin = Vector3.zeros;
           assert3.equal(m.position, new Vector3(1, 1, 0));
           assert3.equal(m.origin, Vector3.zeros);
       });
    });

    describe("Absolute Position", () => {
        it("gets", () => assert3.equal(m.absolute, new Vector3(1, 1, 0)));
        it("sets", () => {
            m.absolute = Vector3.zeros;
            assert3.equal(m.position, Vector3.ey.neg());
            assert3.equal(m.origin, Vector3.ey);
        });
    });

    describe("At/To/From", () => {
        it("gets position at origin", () => assert3.equal(m.at(Vector3.zeros), new Vector3(1, 1, 0)));
        it("this to vector", () => assert3.equal(m.to(p), new Vector3(0, -1, 0)));
    });

    describe("Affine", () => {
        it("gets affine transform", () => {
            let affOM = m.clone().affine(Matrix3.rotZ(Math.PI / 4), Vector3.ones);
            assert.approximately(affOM.position.y, affOM.position.y, Number.EPSILON)
        });
    });
});