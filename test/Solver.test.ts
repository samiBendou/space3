import * as assert3 from "./assert3";
import Vector3 from "../src/Vector3";
import Solver from "../src/Solver";
import Vector6 from "../src/Vector6";

describe("Solver Tests", function () {

    let osolver: Solver, gsolver: Solver;
    let pulse: number, amp: Vector3, freq: number;
    let k: number;
    let tol: number, count: number;
    let gdt: number, odt: number;

    let o = (t: number) => new Vector6(
        ...amp.mulc(Math.sin(pulse * t * odt) / pulse),
        ...amp.mulc(Math.cos(pulse * t * odt)));
    let g = (t: number) => new Vector6(
        ...Vector3.ez.mul(0.5 * k * gdt ** 2 * t * (t - 1)),
        ...Vector3.ez.mul(k * (t * gdt))
    );

    beforeEach(() => {
        freq = 1 / 100;
        pulse = freq * 2 * Math.PI;
        amp = Vector3.ez;
        k = 9.81;
        tol = 0.01;
        count = Math.floor(5 / (freq * gdt));
        gdt = 0.0001;
        odt = 0.0001 / freq / Math.PI;

        osolver = new Solver((u: Vector6) => {
            const lower = u.lower;
            u.neg().mul(pulse ** 2);
            u.upper = lower;
            return u;
        }, odt, Vector6.e(5)); // harmonic oscillator d2u/dt2 = -w * u
        gsolver = new Solver((u: Vector6) => {
            u.assign(u[3], u[4], u[5], 0, 0, k);
            return u;
        }, gdt, Vector6.zeros); // constant gravity d2u/dt2 = k
    });

    describe("Step", function () {
        const samples = 100;
        it("should compute oscillator step", () => {
            const solution = [];
            for (let i = 0; i < samples; i++) {
                solution.push(osolver.step().clone());
            }
            assert3.solved(solution, o, tol, 1);
        });
        it("should compute gravity step", () => {
            const solution = [];
            for (let i = 0; i < samples; i++) {
                solution.push(gsolver.step().clone());
            }
            assert3.solved(solution, g, tol, 1)
        });
    });

    describe("Solve", () => {
        const tmax = 10;
        it("should compute gravity solve", () => assert3.solved([gsolver.solve(tmax)], g, tol, tmax / gdt));
        it("should compute oscillator solve", () => assert3.solved([osolver.solve(tmax)], o, 50 * tol, tmax / odt));
    });
});