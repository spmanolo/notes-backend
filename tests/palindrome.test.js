const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of meitex', () => {
  const result = palindrome('meitex')

  expect(result).toBe('xetiem')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
