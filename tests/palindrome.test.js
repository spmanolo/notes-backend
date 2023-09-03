const { palindrome } = require('../utils/for_testing')

test('palindrome of meitex', () => {
  const result = palindrome('meitex')

  expect(result).toBe('xetiem')
})

test('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
