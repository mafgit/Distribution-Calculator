const fact = (n) => {
  if (n === 0) return 1
  if (n < 0) return new Error('Negative numbers not allowed.')
  let result = 1
  for (let i = n; i > 0; i--) {
    result *= i
  }
  return result
}

const checkBinOrGeoError = (n, p, minX, maxX) => {
  if (p > 1 || p < 0) return 'Probability of success (p) must be >= 0 and <= 1'

  if (maxX > n || minX > n || minX < 0 || maxX < 0)
    return 'X must not be greater than the number of trials(n) or smaller than 0'

  if (maxX < minX)
    return 'Minimum value of x must not be greater than the maximum value of x'

  return undefined
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

  if (isNaN(minX)) minX = 0
  if (isNaN(maxX)) maxX = n

  const err = checkBinOrGeoError(n, p, minX, maxX)
  if (err) return new Error(err)

  let expectation = n * p
  let variance = expectation * (1 - p)
  let sd = Math.sqrt(variance)

  let probability = 0
  if (p === 0 && minX === 0) probability = undefined
  else if (maxX === n && minX === 0) probability = 1
  else {
    for (let x = minX; x <= maxX; x++) {
      probability += choose(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x)
    }
  }

  return { probability, expectation, sd, variance }
}

/**
 * Tells the probability using geometric distribution
 * @param {Number} n - No. of trials (Can be infinity if passed Infinity, undefined or NaN)
 * @param {Number} p - Probability of success (between 0 and 1)
 * @param {Number} minX - Minimum value of x
 * @param {Number} maxX - Maximum value of x
 * @returns expectation, sd, variance, and probability
 */
const geometricDist = (n, p, minX, maxX) => {
  // P(X = x) = q^(x-1) * p
  // P(X <= x) = 1 - q^x
  // P(X > x) = q^x
  // Var(X) = q/(p^2)
  // E(X) = 1/p

  if (isNaN(n) || !isFinite(n)) n = Infinity
  if (isNaN(minX)) minX = 0
  if (isNaN(maxX)) maxX = n

  const err = checkBinOrGeoError(n, p, minX, maxX)
  if (err) return new Error(err)

  let q = 1 - p
  let expectation = 1 / p
  let variance = (1 - p) / (p * p)
  let sd = Math.sqrt(variance)
  let probability

  if (minX === 0 && maxX === n) probability = 1
  else if (minX === maxX) probability = Math.pow(q, minX - 1) * p
  else if (minX === 0 && maxX < n) probability = 1 - Math.pow(q, maxX)
  else if (minX > 0 && maxX === n) probability = Math.pow(q, minX - 1)
  else if (minX > 0 && maxX < n)
    probability = 1 - (1 - Math.pow(q, minX - 1)) - Math.pow(q, maxX)
  return { probability, expectation, sd, variance }
}
