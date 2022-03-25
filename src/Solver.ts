import Vector from "./common/Vector";

type VectorField<T> = (u?: T, t?: number) => T;

/**
 * ## Brief
 * [[Solver]] is a tool class to represent ordinary differential equation between vector-valued functions
 *
 * ### Main features
 * - First, second and third order non-linear solving
 * - Bufferization of result for best performance
 *
 * ## Getting started
 * A solver is an object that models an ode between any object of type [[Vector]]. The equation has the following form
 *
 * ![ODE](media://ode.png)
 *
 * Where `u` is an unknown vector valued function and `f` a smooth time dependant vector field.
 *
 * ### Initialize a solver
 * Solver objects are initialized with the value of the initial condition `u0`, the function `f` and the time step `dt`
 * Therefore to initialize a solver, simply choose values of theses parameters that models your problem.
 *
 * #### Example
 * ```js
 * let f = u => u; // equation du/dt = u first order linear equation
 * let dt = 0.1; // time step
 * let u0 = new Vector3(1, 0, 0); // initial condition
 * let solver = new Solver(f, dt, u0),
 * console.log(solver.dt) // prints 0.1
 * ```
 *
 * ### Solve equations
 * Once you've initialized the solver, you can start compute solutions of your equation. There is two ways to do that :
 * - Compute values step-by-step
 * - Compute value after a maximum duration
 *
 * ```js
 * let u = solver.step();
 * let v = solver.solve(tmax);
 * ```
 *
 * You can change initial condition and time step each time you call `step` and `solve` methods.
 *
 * ```js
 * let u0 = Vector3(2, 3, 7);
 * let dt = 0.1;
 * let u = solver.step(u0, dt);
 * ```
 *
 * **Note** currently only Euler's explicit method is provided.
 *
 * ### Time dependant equations
 *
 * Time dependant equations uses the member `t` to count time from the last initialisation/reset of the solver.
 * Each time an equation is solved, `t` is set to it's final value after solving. If you want to reset the value of `t`,
 * call the `reset` method.
 *
 */
export default class Solver<T extends Vector> {
  /** time dependant vector field **f** */
  f: VectorField<T>;

  /** time elapsed, incremented each time `step` or `solve` methods are called */
  t: number;

  /** current time step */
  dt: number;

  /** buffer value, stores the value of the last `f(u, t)` computed */
  tmp: T;

  /** last initial condition used */
  u0: T;

  /** last solution computed */
  u1: T;

  constructor(f: VectorField<T>, dt: number, u0: T) {
    this.f = f;
    this.dt = dt;
    this.t = 0;
    this.u0 = u0;
    this.u1 = u0.clone() as T;
    this.tmp = u0.clone() as T;
  }

  /**
   * @brief compute next value of solution according to current `u0`
   * @param u0 initial condition
   * @param dt time step
   * @returns reference to `this.u1` after computation
   */
  step(u0?: T, dt: number = this.dt): T {
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
   * @details `this.u1` is set to `u(tmax)`
   * @param tmax instant where to compute the solution
   * @param u0 initial condition
   * @param dt time step
   * @returns reference to `this.u1` after computation
   */
  solve(tmax: number, u0?: T, dt: number = this.dt): T {
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

  /**
   * @brief reset the solver with initial condition and time step
   * @details the timer member `this.t` is set to `0`.
   * @param u0 initial condition
   * @param dt time step
   */
  reset(u0: T = this.u0, dt: number = this.dt): this {
    this.t = 0;
    this.u0.copy(u0);
    this.u1.copy(u0);
    this.tmp.copy(u0);
    this.dt = dt;
    return this;
  }
}
