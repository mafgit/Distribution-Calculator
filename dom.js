const $ = (n) => document.querySelector(n)

window.onload = () => {
  let theme = window.localStorage.getItem('theme')
  if (!theme) theme = 'dark'
  if (['dark', 'light'].includes(theme)) document.body.classList.add(theme)
}

let calculateBtn = $('.calculate-btn')
let resetBtn = $('.reset-btn')
let calculationResults = $('.calculation-results')
let isCalculated = false
resetBtn.style.display = 'none'

const toggleResults = (action) => {
  if (action === 'open') {
    isCalculated = true
    calculationResults.classList.remove('hidden')
    resetBtn.style.display = 'block'
  } else if (action === 'close') {
    isCalculated = false
    resetBtn.style.display = 'none'
    calculationResults.classList.add('hidden')
  }
}

resetBtn.onclick = (e) => {
  $('.number-of-trials-field input').value = ''
  $('.probability-field input').value = ''
  $('.minimum-x-field input').value = ''
  $('.maximum-x-field input').value = ''
  toggleResults('close')
}

calculateBtn.onclick = (e) => {
  let n = parseFloat($('.number-of-trials-field input').value)
  let p = parseFloat($('.probability-field input').value)
  let minX = parseFloat($('.minimum-x-field input').value)
  let maxX = parseFloat($('.maximum-x-field input').value)
  if ([n, p, minX].includes(NaN)) {
    alert('Fill the required fields')
  } else {
    const { message, expectation, sd, variance, probability } = binomialDist(
      n,
      p,
      minX,
      maxX
    )
    if (message) {
      alert(message)
      return
    } else {
      let expectationResult = $('.expectation-result p')
      let sdResult = $('.sd-result p')
      let varianceResult = $('.variance-result p')
      let probabilityResult = $('.probability-result p')
      expectationResult.innerText = expectation
      sdResult.innerText = sd
      varianceResult.innerText = variance
      probabilityResult.innerText = probability
      return toggleResults('open')
    }
  }
}

let toggleThemeBtn = $('.toggle-theme-btn')
let theme = window.localStorage.getItem('theme')

toggleThemeBtn.onclick = (e) => {
  if (theme === 'dark') theme = 'light'
  else theme = 'dark'
  document.body.classList.toggle('dark')
  document.body.classList.toggle('light')
  return window.localStorage.setItem('theme', theme)
}
