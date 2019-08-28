import Vector from "./int/Vector";

type VectorField = (u?: Vector, t?: number) => Vector;

/**
 * ## Brief
 * [[Solver]] represents an ordinary differential equation between any vector-valued function
 *
 * ## Main features
 * - First, second and third order non-linear solving
 * - Bufferization of result for best performance
 *
 * ## Getting started
 * A solver is an object that models an ode between any object of type [[Vector]]. The equation must be in the form
 * **du/dt = f(u, t)** where **u** is the unknown vector-valued function and **f** is a smooth time-dependant vector field.
 *
 * ## Initialize a solver
 * Solver objects contains notably the value of the initial condition, the function **f** and the time step **dt**.
 * Therefore to initialize a solver, simply choose a pertinent value to these parameter.
 *
 * ### Example
 * ```js
 * let f = u => u; // equation du/dt = u (exponential solution)
 * let dt = 0.1; // time step
 * let u0 = new Vector3(1, 0, 0); // initial condition
 * let solver = new Solver(f, dt, u0),
 * console.log(solver.dt) // prints 0.1
 * ```
 *
 * ## Solve equations
 * Once you've initialized the solver, you can start compute solutions of your equation. There is two ways to do that
 * - Compute values step-by-step
 * - Compute value after a maximum duration
 *
 * ```js
 * let u = solver.step();
 * let v = solver.solve(tmax);
 * ```
 *
 * You can impose a new initial condition and a time step each time you call `step` and `solve` methods.
 *
 * ```js
 * let u0 = Vector3(2, 3, 7);
 * let dt = 0.1;
 * let u = solver.step(u0, dt);
 * ```
 *
 * **Note** currently there is implicit methods and only Euler's method is provided.
 *
 */
export default class Solver {
    /** time dependant vector field **f** */
    f: VectorField;

    /** time elapsed, incremented each time `step` or `solve` methods are called */
    t: number;

    /** current time step */
    dt: number;

    /** buffer value, stores the value of the last **f(u, t)** computed */
    tmp: Vector;

    /** last initial condition used */
    u0: Vector;

    /** last solution computed */
    u1: Vector;

    constructor(f: VectorField, dt: number, u0: Vector) {
        this.f = f;
        this.dt = dt;
        this.t = 0;
        this.u0 = u0;
        this.u1 = u0.clone();
        this.tmp = u0.clone();
    }

    /**
     * @brief compute next value of solution according to current `u0`
     * @param u0 initial condition
     * @param dt time step
     * @returns reference to `this.u1` after computation
     */
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

    /**
     * @brief computes value of solution according to current `u0` at `t = tmax`
     * @details `this.u1` is set to **u(tmax)**
     * @param tmax instant where to compute the solution
     * @param u0 initial condition
     * @param dt time step
     * @returns reference to `this.u1` after computation
     */
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