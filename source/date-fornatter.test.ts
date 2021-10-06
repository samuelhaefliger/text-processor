import { format } from './date-formatter'


describe('Date formatter test', () => {
  test('Format simple date', () => {
    expect(format(new Date(2020, 6, 9, 0, 0, 0, 0), 'DD.MM.YYYY')).toBe('09.07.2020')
  })
})
