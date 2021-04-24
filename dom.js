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
let distType = 'binomial'

resetBtn.style.display = 'none'

let expectationResult = $('.expectation-result p')
let sdResult = $('.sd-result p')
let varianceResult = $('.variance-result p')
let probabilityResult = $('.probability-result p')

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

const resetFields = () => {
  $('.number-of-trials-field input').value = ''
  $('.probability-field input').value = ''
  $('.min-x-input').value = ''
  $('.max-x-input').value = ''
  toggleResults('close')
}

resetBtn.onclick = () => resetFields()

form.onsubmit = (e) => {
  e.preventDefault()
  if (distType === 'binomial') {
    let n = parseFloat(
      $('.binomial-parameters .number-of-trials-field input').value
    )
    let p = parseFloat($('.binomial-parameters .probability-field input').value)
    let minX = parseFloat($('.binomial-parameters .min-x-input').value)
    let maxX = parseFloat($('.binomial-parameters .max-x-input').value)

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
        expectationResult.innerText = expectation
        sdResult.innerText = sd
        varianceResult.innerText = variance
        probabilityResult.innerText = probability
        return toggleResults('open')
      }
    }
  } else if (distType === 'geometric') {
    let n = parseFloat(
      $('.geometric-parameters .number-of-trials-field input').value
    )
    let p = parseFloat(
      $('.geometric-parameters .probability-field input').value
    )
    let minX = parseFloat($('.geometric-parameters .min-x-input').value)
    let maxX = parseFloat($('.geometric-parameters .max-x-input').value)

    if (isNaN(p)) {
      alert('Fill the required fields (p)')
    } else {
      const { message, expectation, sd, variance, probability } = geometricDist(
        n,
        p,
        minX,
        maxX
      )
      if (message) {
        alert(message)
        return
      } else {
        expectationResult.innerText = expectation
        sdResult.innerText = sd
        varianceResult.innerText = variance
        probabilityResult.innerText = probability
        return toggleResults('open')
      }
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

const changeDistType = (type) => {
  resetFields()
  distOptions.forEach((i) => {
    $(`.${i}-parameters`).style.display = 'none'
  })

  distTypes.forEach((i) => {
    if (i.dataset.distType === type) {
      i.classList.add('active-item')
    } else i.classList.remove('active-item')
  })

  $(`.${type}-parameters`).style.display = 'flex'
}
