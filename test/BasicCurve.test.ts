import { assert } from "chai";
import BasicCurve from "../src/BasicCurve";
import { epsilon } from "../src/common/utils";
import Matrix3 from "../src/Matrix3";
import Vector3 from "../src/Vector3";
import * as assert3 from "./assert3";

describe("Curve Tests", function () {
  let dt: number;
  let zero: Vector3,
    ex: Vector3,
    ey: Vector3,
    ez: Vector3,
    exn: Vector3,
    eyn: Vector3,
    ezn: Vector3;
  let square: BasicCurve<Vector3>,
    linear0: BasicCurve<Vector3>,
    linear1: BasicCurve<Vector3>,
    zeros: BasicCurve<Vector3>;

  beforeEach(() => {
    dt = 0.1;
    zero = Vector3.zeros;
    ex = Vector3.ex;
    ey = Vector3.ey;
    ez = Vector3.ez;
    exn = Vector3.exn;
    eyn = Vector3.eyn;
    ezn = Vector3.ezn;

    square = new BasicCurve([ex, ey, exn, eyn, ex.clone()]);
    linear0 = new BasicCurve([exn, zero, ex]);
    linear1 = new BasicCurve([ex, zero, exn]);
    zeros = new BasicCurve([zero]);
  });

  describe("Initialization", () => {
    it("should has the right size", () => {
      assert.equal(square.positions.length, 5);
    });
    it("should set the elements", () => {
      assert3.equal(square.positions, [ex, ey, exn, eyn, ex]);
    });
  });

  describe("Push/Pop", () => {
    describe("Push without dt", () => {
      it("should push position", () =>
        assert3.equal(zeros.push(ex).positions[1], ex));
    });
    describe("Push with dt", () => {
      it("should push position", () =>
        assert3.equal(zeros.push(ex).positions[1], ex));
    });
    describe("Pop", () => {
      it("should return position", () => assert3.equal(square.pop(), ex));
      it("should pop position", () => {
        square.pop();
        assert.equal(square.positions.length, 4);
        assert3.equal(square.last, eyn);
      });
    });
  });

  describe("Geometry", () => {
    it("should translate the curve", () =>
      assert3.equal(linear0.translate(ex.clone()).positions, [
        Vector3.zeros,
        Vector3.ex,
        Vector3.ex.mul(2),
      ]));
    it("should rotate the curve", () =>
      assert3.approximately(
        square.transform(Matrix3.rotZ(Math.PI / 2)).positions,
        [Vector3.ey, Vector3.exn, Vector3.eyn, Vector3.ex, Vector3.ey],
        epsilon
      ));
  });

  describe("Cinematic", () => {
    describe("Position", () => {
      it("should get initial position", () =>
        assert3.equal(linear1.positionAt(0), linear1.first));
      it("should get final position", () =>
        assert3.equal(linear1.positionAt(1), linear1.last));
      it("should get middle position", () =>
        assert3.equal(linear1.positionAt(0.5), linear1.positions[1]));
      it("should get x = 0.25 position", () =>
        assert3.equal(linear1.positionAt(0.25), ex.mulc(0.5)));
      it("should get x = 0.75 position", () =>
        assert3.equal(linear1.positionAt(0.75), ex.mulc(-0.5)));
    });

    describe("Length", () => {
      it("should get initial length", () =>
        assert.equal(linear0.lengthAt(0), 0));
      it("should get final length", () => assert.equal(linear0.lengthAt(1), 2));
      it("should get middle length", () =>
        assert.equal(linear0.lengthAt(0.5), 1));
      it("should get x = 0.25 length", () =>
        assert.equal(linear0.lengthAt(0.25), 0.5));
      it("should get x = 0.75 length", () =>
        assert.approximately(linear0.lengthAt(0.75), 1.5, epsilon));
    });

    describe("Generators", () => {
      it("gets zeros", () =>
        assert3.equal(BasicCurve.zeros(ex, 2).positions, [ex, ex]));
      it("gets graph", () =>
        assert3.equal(
          BasicCurve.graph(
            (x) => new Vector3(Math.cos(x), Math.sin(x), 0),
            0,
            2 * Math.PI,
            Math.PI / 2
          ).positions,
          square.positions
        ));
    });
  });
});
