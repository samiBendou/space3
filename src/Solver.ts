import Vector from "./int/Vector";

type VectorField = (u?: Vector, t?: number) => Vector;

export default class Solver {
    f: VectorField;
    t: number;
    dt: number;
    tmp: Vector;
    u0: Vector;
    u1: Vector;

    constructor(f: VectorField, dt: number, u0: Vector) {
        this.f = f;
        this.dt = dt;
        this.t = 0;
        this.u0 = u0;
        this.u1 = u0.clone();
        this.tmp = u0.clone();
    }

    step(u0?: Vector, dt: number = this.dt): Vector {
        if (u0) {
            this.u0.copy(u0);
            this.u1.copy(u0);
        }

        this.dt = dt;
        this.tmp.copy(this.u1);
        this.u1.comb(this.dt, this.f(this.tmp, this.t));
        this.t += this.dt;
        return this.u1;
    }

    solve(tmax: number, u0?: Vector, dt: number = this.dt): Vector {
        if (u0) {
            this.u0.copy(u0);
            this.u1.copy(u0);
        }
        this.dt = dt;
        for (this.t = 0; this.t < tmax; this.t += dt) {
            this.tmp.copy(this.u1);
            this.u1.comb(this.dt, this.f(this.tmp, this.t));
        }

        return this.u1;
    }
}