/** Numeric precision limit. */
export const epsilon = Number.EPSILON;

export const epsilon2 = epsilon * epsilon;

/**
 * @brief returns a random gaussian number using Box-Muller
 * @param mu mean of the number
 * @param sigma standard deviation of the number
 */
export const gaussian = (mu: number, sigma: number) => {
  const pi2 = 2 * Math.PI;
  let s0: number, s1: number;
  do {
    s0 = Math.random();
    s1 = Math.random();
  } while (s0 <= epsilon);
  return Math.sqrt(-2.0 * Math.log(s0)) * Math.cos(pi2 * s1) * sigma + mu;
};
