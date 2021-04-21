const $ = (n) => document.querySelector(n)

window.onload = () => {
  let theme = window.localStorage.getItem('theme')
  if (!theme) theme = 'dark'
  if (['dark', 'light'].includes(theme)) document.body.classList.add(theme)
}

let form = $('.calculator-container')
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
  $('.min-x-input').value = ''
  $('.max-x-input').value = ''
  toggleResults('close')
}

form.onsubmit = (e) => {
  e.preventDefault()
  let n = parseFloat($('.number-of-trials-field input').value)
  let p = parseFloat($('.probability-field input').value)
  let minX = parseFloat($('.min-x-input').value)
  let maxX = parseFloat($('.max-x-input').value)

  if (isNaN(minX)) minX = 0
  if (isNaN(maxX)) maxX = n

  if ([n, p].includes(NaN)) {
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

let distType = 'binomial'
let distOptions = ['binomial', 'geometric']
let dropdown = $('.dropdown')
let distTypeBtn = $('.distribution-type')
let distTypes = dropdown.querySelectorAll('.dropdown-item')

distTypeBtn.onclick = (e) => {
  dropdown.classList.toggle('hidden')
}

distTypes.forEach((type) => {
  type.onclick = (e) => {
    dropdown.classList.add('hidden')
    let t = e.target.dataset.distType
    if (t !== distType) {
      distType = t
      $('.distribution-type-name').innerText = e.target.innerText
      return changeDistType(t)
    }
  }
})

const changeDistType = (type) => {}
