import {assert} from "chai";
import * as assert3 from "./assert3";
import {Vector3} from "../src/Vector3";
import {epsilon} from "../src/Algebra";

describe("Vector3 Tests", () => {

    let ex: Vector3, ey: Vector3, ez: Vector3, zeros: Vector3, ones: Vector3, magic: Vector3;

    beforeEach(() => {
        ex = new Vector3(1, 0, 0);
        ey = new Vector3(0, 1, 0);
        ez = new Vector3(0, 0, 1);
        zeros = new Vector3(0, 0, 0);
        ones = new Vector3(1, 1, 1);
        magic = new Vector3(1, 2, 3);
    });

    describe("Equality", () => {
        it("initialized", () => assert(magic.x === 1 && magic.y === 2 && magic.z === 3));
        it("returns true on auto equal", () => assert.isTrue(ex.equal2(ex)));
        it("differentiates object", () => assert.isFalse(ex.equal2(ey)));
        it("should be epsilon precise", () => assert.isFalse(ex.equal2(ex.clone().mul(1 + epsilon))));
    });

    describe("Clone", () => {
        it("clones object", () => assert3.equal(magic, new Vector3(1, 2, 3)));
        it("does not modify original object", () => {
            magic.clone().x = 5;
            assert3.equal(magic, new Vector3(1, 2, 3));
        });
    });

    describe("Manipulators", () => {
        it("fills the vector", () => assert3.equal(ex.fillc(3), new Vector3(3, 3, 3)));

        let d = 1 / Math.sqrt(3);
        it("norms the vector", () => assert3.equal(ones.normc(), new Vector3(d, d, d)));
    });

    describe("Algebra", () => {
        it("adds", () => assert3.equal(magic.addc(ones), new Vector3(2, 3, 4)));
        it("subtracts", () => assert3.equal(magic.subc(ones), new Vector3(0, 1, 2)));
        it("negates", () => assert3.equal(magic.negc(), new Vector3(-1, -2, -3)));
        it("multiplies with scalar", () => assert3.equal(magic.mulc(2), new Vector3(2, 4, 6)));
        it("multiplies with vector", () => assert3.equal(magic.prodc(ey), new Vector3(0, 2, 0)));
        it("inverses with vector", () => assert3.equal(magic.invc(), new Vector3(1, 1 / 2, 1 / 3)));
        it("divides", () => assert3.equal(magic.divc(0.5), new Vector3(2, 4, 6)));
        it("interpolates", () => assert3.equal(ex.lerpc(ex.mulc(2), 0.5), new Vector3(1.5, 0, 0)));
        it("can assign during operation", () => assert3.equal(magic.addc(ones), new Vector3(2, 3, 4)));
    });

    describe("Geometry", () => {
        it("gets dot product", () => assert.equal(magic.dot(magic), 14));

        describe("Magnitude", () => {
            it("gets magnitude", () => assert.equal(magic.mag, Math.sqrt(14)));
            it("gets squared magnitude", () => assert.equal(magic.mag2, 14));
        });

        describe("Cross Product", () => {
            it("gets ex x ey", () => assert3.equal(ex.crossc(ey), ez));
            it("gets ey x ez", () => assert3.equal(ey.crossc(ez), ex));
            it("gets ez x ex", () => assert3.equal(ez.crossc(ex), ey));
            it("gets ex x ex", () => assert3.equal(ex.crossc(ex), zeros));
        });

        describe("Angle", () => {
            it("gets with ex", () => assert.equal(ex.angle(ex), 0.0));
            it("gets with ey", () => assert.equal(ex.angle(ey), Math.PI / 2));
            it("gets with ez", () => assert.equal(ex.angle(ez), Math.PI / 2));
            it("is non oriented", () => assert.equal(ez.angle(ex), Math.PI / 2));
        });

        describe("Area", () => {
            it("gets area with ones and ex", () => assert.equal(ex.area(new Vector3(1, 1, 0)), 1));
            it("gets area with ey and ex", () => assert.equal(ex.area(ey), 1));
            it("gets area with ex and ex", () => assert.equal(ex.area(ex), 0));
        });

        describe("Rotation", () => {
            it("gets rotates around ex", () => assert3.equal(ey.rotX(Math.PI / 2), ez));
            it("gets rotates around ey", () => assert3.equal(ex.rotY(Math.PI / 2), ez.neg()));
            it("gets rotates around ez", () => assert3.equal(ex.rotZ(Math.PI / 2), ey));
            it("gets rotates around axis ex", () => assert3.equal(ey.rot(ex, Math.PI / 2), ez));
            it("gets rotates around axis ey", () => assert3.equal(ex.rot(ey, Math.PI / 2), ez.neg()));
            it("gets rotates around axis ez", () => assert3.equal(ex.rot(ez, Math.PI / 2), ey));
        });
    });

    describe("Coordinates", () => {
        describe("Getters", () => {
            it("gets r for ex", () => assert.equal(ex.r, 1));
            it("gets rxy for ex", () => assert.equal(ex.rxy, 1));
            it("gets theta for ex", () => assert.equal(ex.theta, 0));
            it("gets phi for ex", () => assert.equal(ex.phi, Math.PI / 2));
            it("should gets phi = 0 at 0", () => assert.equal(Vector3.zeros.phi, 0));
            it("should gets theta = 0 at 0", () => assert.equal(Vector3.zeros.theta, 0));
            it("gets cylindrical", () => assert3.equal1D(ex.rthz, [1, 0, 0]));
            it("gets spherical", () => assert3.equal1D(ex.rthph, [1, 0, Math.PI / 2]));
            it("gets latitude of ex", () => assert.equal(ex.lat, 0));
            it("gets longitude of ex", () => assert.equal(ex.lon, 0));
            it("gets latitude of ez", () => assert.equal(ez.lat, Math.PI / 2));
            it("gets longitude of ey", () => assert.equal(ey.lon, Math.PI / 2));
        });

        describe("Setters", () => {
            it("sets r", () => {
                ex.r = 2;
                assert3.equal(ex, new Vector3(2, 0, 0));
            });

            it("sets rxy", () => {
                let d = 1 / Math.sqrt(2);
                ex.y = 1;
                ex.rxy = 1;
                assert3.equal(ex, new Vector3(d, d, 0));
            });

            it("sets theta", () => {
                ex.theta = Math.PI / 2;
                assert3.equal(ex, new Vector3(0, 1, 0));
            });

            it("sets phi", () => {
                ex.phi = 0;
                assert3.equal(ex, new Vector3(0, 0, 1));
            });
            it("sets latitude", () => {
                ex.lat = 0;
                assert3.equal(ex, new Vector3(1, 0, 0));
            });

            it("sets positive longitudes", () => {
                ex.lon = Math.PI / 2;
                assert3.equal(ex, new Vector3(0, 1, 0));
            });

            it("sets negative longitudes", () => {
                ex.lon = -Math.PI / 2;
                assert3.equal(ex, new Vector3(0, -1, 0));
            });
        });
    });

    describe("Serialization", () => {
        const u1D = [1, 0, 0];
        it("encodes to array", () => assert3.equal1D(ex.array(), u1D));
        it("decodes to array", () => assert3.equal(Vector3.array(u1D), ex));
        it("encodes to string", () => assert.equal(ex.string(), "(1, 0, 0)"));
    });

    describe("Coordinates Generators", () => {
        it("gets cylindrical", () => assert3.equal(Vector3.rthz(1, Math.PI / 2, 0), Vector3.ey));
        it("gets spherical", () => assert3.equal(Vector3.rthph(1, Math.PI / 2, Math.PI / 2), Vector3.ey));
    });

    describe("Basis Generators", () => {
        describe("Cartesian", () => {
            it("gets at ex", () => assert3.equal(Vector3.ex, new Vector3(1, 0, 0)));
            it("gets at ey", () => assert3.equal(Vector3.ey, new Vector3(0, 1, 0)));
            it("gets at ez", () => assert3.equal(Vector3.ez, new Vector3(0, 0, 1)));
        });

        describe("Spherical", () => {
            describe("Radial", () => {
                it("gets at ex", () => assert3.equal(Vector3.er(Vector3.ex), Vector3.ex));
                it("gets at ey", () => assert3.equal(Vector3.er(Vector3.ey), Vector3.ey));
                it("gets at ez", () => assert3.equal(Vector3.er(Vector3.ez), Vector3.ez));
            });

            describe("Prograde", () => {
                it("gets at ex", () => assert3.equal(Vector3.etheta(Vector3.ex), Vector3.ey));
                it("gets at ey", () => assert3.equal(Vector3.etheta(Vector3.ey), Vector3.ex.neg()));
                it("gets at ez", () => assert3.equal(Vector3.etheta(Vector3.ez), Vector3.ey));
            });

            describe("Normal", () => {
                it("gets at ex", () => assert3.equal(Vector3.ephi(Vector3.ex), Vector3.ez.neg()));
                it("gets at ey", () => assert3.equal(Vector3.ephi(Vector3.ey), Vector3.ez.neg()));
                it("gets at ez", () => assert3.equal(Vector3.ephi(Vector3.ez), Vector3.ex));
            });
        });
    });
});
