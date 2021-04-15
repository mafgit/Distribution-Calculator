const fact = (n) => {
  if (n === 0) return 1
  if (n < 0) return new Error('Negative numbers not allowed.')
  let result = 1
  for (let i = n; i > 0; i--) {
    result *= i
  }
  return result
}

/**
 * Tells the number of combinations (nCx)
 * @param {Number} n - Total number of items
 * @param {Number} x - Number of items you wanna choose
 * @returns Number of combinations
 */
const choose = (n, x) => {
  // n! / [x!(n - x)!]
  return fact(n) / (fact(x) * fact(n - x))
}

/**
 * Tells the probability using binomial distribution
 * @param {Number} n - No. of trials
 * @param {Number} p - Probability of success
 * @param {Number} minX - Minimum value of x
 * @param {Number} maxX - Maximum value of x
 * @returns expectation, sd, variance, and probability
 */
const binomialDist = (n, p, minX, maxX) => {
  // nCx . p ^ x . q ^ (n - x)
  // q = 1 - p
  // expectation = np
  // var = npq
  // sd = (npq) ^ (1/2)
  if (p > 1 || p < 0)
    return new Error('Probability of success (p) must be >= 0 and <= 1')

  if (maxX === undefined || isNaN(maxX)) maxX = minX

  if (maxX > n)
    return new Error(
      'Minimum value of x (minX) must not be greater than the number of trials(n)'
    )

  if (maxX < minX)
    return new Error(
      'Minimum value of x (minX) must be greater than or equal to Maximum value of x (maxX)'
    )

  let expectation = n * p
  let variance = expectation * (1 - p)
  let sd = Math.sqrt(variance)

  let probability = 0

  for (let x = minX; x <= maxX; x++) {
    probability += choose(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x)
  }

  return { probability, expectation, sd, variance }
}
