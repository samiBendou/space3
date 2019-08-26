import {assert} from "chai";
import * as assert3 from "./assert3";
import Vector3 from "../src/Vector3";
import Curve from "../src/Curve";
import Matrix3 from "../src/Matrix3";
import {epsilon} from "../src/common";

describe("Curve Tests", function () {

    let dt: number;
    let origin: Vector3, ex: Vector3, ey: Vector3, ez: Vector3, exn: Vector3, eyn: Vector3, ezn: Vector3;
    let square: Curve, linear0: Curve, linear1: Curve, zeros: Curve;

    beforeEach(() => {
        dt = 0.1;
        origin = Vector3.zeros;
        ex = Vector3.ex;
        ey = Vector3.ey;
        ez = Vector3.ez;
        exn = Vector3.exn;
        eyn = Vector3.eyn;
        ezn = Vector3.ezn;

        square = new Curve([ex, ey, exn, eyn, ex.clone()], origin.clone(), dt);
        linear0 = new Curve([exn, origin, ex], origin.clone(), dt);
        linear1 = new Curve([ex, origin, exn]);
        zeros = new Curve([origin], origin.clone(), dt);
    });

    describe("Initialization", () => {
        it("should has the right size", () => {
            assert.equal(square.positions.length, 5);
            assert.equal(square.dt.length, 4);
            assert.equal(zeros.dt.length, 0);
        });
        it("should set the elements", () => {
            assert3.equal(square.positions, [ex, ey, exn, eyn, ex]);
        });
        it("should set the right default values", () => {
            assert3.equal(linear1.origin, origin);
            assert3.equal1D(linear1.dt, [1, 1]);
        });
    });

    describe("Push/Pop", () => {
        describe("Push without dt", () => {
            it("should push step 1", () => assert.equal(zeros.push(ex).dt[0], 1));
            it("should clone step", () => assert.equal(square.push(ex).dt[square.dt.length - 1], 0.1));
            it("should push position", () => assert3.equal(zeros.push(ex).positions[1], ex));
        });
        describe("Push with dt", () => {
            it("should push step", () => assert.equal(zeros.push(ex, 0.1).dt[0], 0.1));
            it("should push position", () => assert3.equal(zeros.push(ex).positions[1], ex));
        });
        describe("Pop", () => {
            it("should return position", () => assert3.equal(square.pop()[0], ex));
            it("should return step", () => assert.equal(square.pop()[1], 0.1));
            it("should pop position and step", () => {
                square.pop();
                assert.equal(square.positions.length, 4);
                assert.equal(square.dt.length, 3);
                assert3.equal(square.last, eyn);
            });
        });
    });

    describe("Geometry", () => {
        it("should translate the curve", () => assert3.equal(linear0.translate(ex.clone()).positions, [Vector3.zeros, Vector3.ex, Vector3.ex.mul(2)]));
        it("should rotate the curve", () => assert3.approximately(square.transform(Matrix3.rotZ(Math.PI / 2)).positions, [Vector3.ey, Vector3.exn, Vector3.eyn, Vector3.ex, Vector3.ey], epsilon))
    });

    describe("Cinematic", () => {
        describe("Position", () => {
            it("should get initial position", () => assert3.equal(linear1.position(0), linear1.first));
            it("should get final position", () => assert3.equal(linear1.position(1), linear1.last));
            it("should get middle position", () => assert3.equal(linear1.position(0.5), linear1.positions[1]));
            it("should get x = 0.25 position", () => assert3.equal(linear1.position(0.25), ex.mulc(0.5)));
            it("should get x = 0.75 position", () => assert3.equal(linear1.position(0.75), ex.mulc(-0.5)));
        });

        describe("Speed", () => {
            it("should get initial speed", () => assert3.equal(square.speed(0), exn.addc(ey).mul(10)));
            it("should get final speed", () => assert3.equal(square.speed(1), ex.addc(ey).mul(10)));
            it("should get middle speed", () => assert3.equal(square.speed(0.5), ex.addc(eyn).mul(10)));
            it("should get x = 0.25 speed", () => assert3.equal(square.speed(0.25), exn.addc(eyn).mulc(10)));
            it("should get x = 0.75 speed", () => assert3.equal(square.speed(0.75), ex.addc(ey).mul(10)));
        });

        describe("Duration", () => {
            it("should get initial duration", () => assert.equal(linear0.duration(0), 0));
            it("should get final duration", () => assert.equal(linear0.duration(1), 0.2));
            it("should get middle duration", () => assert.equal(linear0.duration(0.5), 0.1));
            it("should get x = 0.25 duration", () => assert.equal(linear0.duration(0.25), 0.05));
            it("should get x = 0.75 duration", () => assert.approximately(linear0.duration(0.75), 0.15, epsilon));
        });

        describe("Length", () => {
            it("should get initial length", () => assert.equal(linear0.length(0), 0));
            it("should get final length", () => assert.equal(linear0.length(1), 2));
            it("should get middle length", () => assert.equal(linear0.length(0.5), 1));
            it("should get x = 0.25 length", () => assert.equal(linear0.length(0.25), 0.5));
            it("should get x = 0.75 length", () => assert.approximately(linear0.length(0.75), 1.5, epsilon));
        });

        describe("Generators", () => {
            it("gets zeros", () => assert3.equal(Curve.zeros(ex, 2).positions, [ex, ex]));
            it("gets graph", () => assert3.equal(Curve.graph(x => new Vector3(Math.cos(x), Math.sin(x), 0), 0, 2 * Math.PI, Math.PI / 2).positions, square.positions));
        });
    });

    describe("Origin", () => {
        describe("Set", () => {
            it("should set origin", () => {
                linear0.origin = exn.clone();
                assert3.equal(linear0.origin, Vector3.exn);
            });
            it("should transform positions", () => {
                linear0.origin = exn.clone();
                assert3.equal(linear0.positions, [Vector3.zeros, Vector3.ex, Vector3.ex.mulc(2)]);
            });
        })
    })
});