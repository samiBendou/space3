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
    it("initialized", () => assert3.equal1D([magic[0], magic[1], magic[2]], [1, 2, 3]));

    describe("Zero", () => {
        describe("exact", () => {
            it("gets zero", () => assert.isTrue(zeros.nil()));
            it("differentiates zeros", () => assert.isFalse(ex.nil()));
        });
        describe("norm 1", () => {
            it("gets zero", () => assert.isTrue(zeros.zero1()));
            it("differentiates zeros", () => assert.isFalse(ex.zero1()));
        });
        describe("norm 2", () => {
            it("gets zero", () => assert.isTrue(zeros.zero2()));
            it("differentiates zeros", () => assert.isFalse(ex.zero2()));
        });
    });

    describe("Clone/Copy", () => {
        it("clones object", () => assert3.equal(magic.clone(), [1, 2, 3]));
        it("does not modify original object", () => {
            magic.clone()[0] = 5;
            assert3.equal(magic, new Vector3(1, 2, 3));
        });
        it("copies object", () => assert3.equal(magic.copy(ex), ex));
    });

    describe("Generators", () => {
        it("gets zeros", () => assert3.equal(Vector3.zeros, [0, 0, 0]));
        it("gets ones", () => assert3.equal(Vector3.ones, [1, 1, 1]));
        it("gets scalar", () => assert3.equal(Vector3.scalar(3), [3, 3, 3]));

        describe("Basis", () => {
            describe("Cartesian", () => {
                it("gets at ex", () => assert3.equal(Vector3.ex, [1, 0, 0]));
                it("gets at -ex", () => assert3.equal(Vector3.exn, [-1, 0, 0]));
                it("gets at ey", () => assert3.equal(Vector3.ey, [0, 1, 0]));
                it("gets at -ey", () => assert3.equal(Vector3.eyn, [0, -1, 0]));
                it("gets at ez", () => assert3.equal(Vector3.ez, [0, 0, 1]));
                it("gets at -ez", () => assert3.equal(Vector3.ezn, [0, 0, -1]));
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

        describe("Coordinates", () => {
            it("gets cylindrical", () => assert3.equal(Vector3.rthz(1, Math.PI / 2, 0), Vector3.ey));
            it("gets spherical", () => assert3.equal(Vector3.rthph(1, Math.PI / 2, Math.PI / 2), Vector3.ey));
        });
    });

    describe("Coordinates", () => {
        describe("Getters", () => {
            it("gets r for ex", () => assert.equal(ex.r, 1));
            it("gets rxy for ex", () => assert.equal(ex.rxy, 1));
            it("gets theta for ex", () => assert.equal(ex.theta, 0));
            it("gets phi for ex", () => assert.equal(ex.phi, Math.PI / 2));
            it("should gets phi = 0 at 0", () => assert.equal(zeros.phi, 0));
            it("should gets theta = 0 at 0", () => assert.equal(zeros.theta, 0));
            it("gets cylindrical", () => assert3.equal1D(ex.rthz, [1, 0, 0]));
            it("gets spherical", () => assert3.equal1D(ex.rthph, [1, 0, Math.PI / 2]));
            it("gets latitude of ex", () => assert.equal(ex.lat, 0));
            it("gets longitude of ex", () => assert.equal(ex.lon, 0));
            it("gets latitude of ez", () => assert.equal(ez.lat, Math.PI / 2));
            it("gets longitude of ey", () => assert.equal(ey.lon, Math.PI / 2));
            it("gets xyz", () => assert3.equal1D(magic.xyz, [1, 2, 3]));
        });

        describe("Setters", () => {
            it("sets r", () => {
                ex.r = 2;
                assert3.equal(ex, [2, 0, 0]);
            });

            it("sets rxy", () => {
                let d = 1 / Math.sqrt(2);
                ex.y = 1;
                ex.rxy = 1;
                assert3.equal(ex, [d, d, 0]);
            });

            it("sets theta", () => {
                ex.theta = Math.PI / 2;
                assert3.equal(ex, ey);
            });

            it("sets phi", () => {
                ex.phi = 0;
                assert3.equal(ex, ez);
            });
            it("sets latitude", () => {
                ez.lat = 0;
                assert3.equal(ez, ex);
            });

            it("sets positive longitudes", () => {
                ex.lon = Math.PI / 2;
                assert3.equal(ex, ey);
            });

            it("sets negative longitudes", () => {
                ex.lon = -Math.PI / 2;
                assert3.equal(ex, [0, -1, 0]);
            });

            it("sets xyz", () => {
                ex.xyz = [1, 2, 3];
                assert3.equal(ex, magic);
            });
        });
    });

    describe("Algebra", () => {
        it("adds", () => assert3.equal(magic.addc(ones), [2, 3, 4]));
        it("subtracts", () => assert3.equal(magic.subc(ones), [0, 1, 2]));
        it("negates", () => assert3.equal(magic.negc(), [-1, -2, -3]));
        it("multiplies with scalar", () => assert3.equal(magic.mulc(2), [2, 4, 6]));
        it("multiplies with vector", () => assert3.equal(magic.prodc(ey), [0, 2, 0]));
        it("inverses with vector", () => assert3.equal(magic.invc(), [1, 1 / 2, 1 / 3]));
        it("divides", () => assert3.equal(magic.divc(0.5), [2, 4, 6]));
        it("interpolates", () => assert3.equal(ex.lerpc(ex.mulc(2), 0.5), [1.5, 0, 0]));
        it("can assign during operation", () => assert3.equal(magic.addc(ones), [2, 3, 4]));
    });

    describe("Geometry", () => {
        it("gets dot product", () => assert.equal(magic.dot(magic), 14));

        describe("Magnitude", () => {
            it("gets magnitude", () => assert.equal(magic.mag, Math.sqrt(14)));
            it("gets squared magnitude", () => assert.equal(magic.mag2, 14));
        });

        describe("Distance", () => {
            it("gets distance", () => assert.equal(ex.dist(ey), Math.sqrt(2)));
            it("gets squared distance", () => assert.equal(zeros.dist2(ones), 3));
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
            it("gets area with ones and ex", () => assert.equal(ex.area(ones), Math.SQRT2));
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

        describe("Cosine", () => {
            it("gets cos of ex and ey", () => assert.equal(ex.cos(ey), 0));
            it("gets cos of ex and ex", () => assert.equal(ex.cos(ex), 1));
            it("gets cos of ex and ex+ey", () => assert.approximately(ex.cos(new Vector3(1, 1, 0)), Math.SQRT2 / 2, 10 * epsilon));
        });
    });

    describe("Serialization", () => {
        const u1D = [1, 0, 0];
        it("encodes to array", () => assert3.equal1D(ex.array(), u1D));
        it("decodes to array", () => assert3.equal(Vector3.array(u1D), ex));
        it("encodes to string", () => assert.equal(ex.string(), "(1, 0, 0)"));
    });
});
