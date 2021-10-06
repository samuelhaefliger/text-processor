import { textProcessor } from './text-processor'

const createProcessor = () => {
  return textProcessor()
}

describe('Text Processor Tests', () => {
  test('Replace simple text.', () => {
    const process = createProcessor()
    const result = process('Simple {{value}}', { value: 'text' })

    expect(result).toBe('Simple text')
  })

  test('Replace empty string.', () => {
    const process = createProcessor()
    const result = process('Empty {{value}}', { value: '' })

    expect(result).toBe('Empty')
  })

  test('Replace null value.', () => {
    const process = createProcessor()
    const result = process('Null {{value}}', { value: null })

    expect(result).toBe('Null')
  })

  test('Replace undefined value.', () => {
    const process = createProcessor()
    const result = process('Undefined {{value}}', {})

    expect(result).toBe('Undefined')
  })

  test('Replace simple number.', () => {
    const process = createProcessor()
    const result = process('Number {{value;number}}', { value: 12 })

    expect(result).toBe('Number 12')
  })

  test('Replace zero number.', () => {
    const process = createProcessor()
    const result = process('Zero {{value;number}}', { value: 0 })

    expect(result).toBe('Zero 0')
  })

  test('Replace null number.', () => {
    const process = createProcessor()
    const result = process('Zero {{value;number}}', { value: null })

    expect(result).toBe('Zero 0')
  })

  test('Replace undefined number.', () => {
    const process = createProcessor()
    const result = process('Zero {{value;number}}', {})

    expect(result).toBe('Zero 0')
  })

  test('Replace formatted number.', () => {
    const process = createProcessor()
    const result = process('Number {{value;number:2}}', { value: 12 })

    expect(result).toBe('Number 12.00')
  })

  test('Replace formatted number zero.', () => {
    const process = createProcessor()
    const result = process('Number {{value;number:2}}', { value: 0 })

    expect(result).toBe('Number 0.00')
  })

  test('Replace formatted null number.', () => {
    const process = createProcessor()
    const result = process('Null {{value;number:2}}', { value: null })

    expect(result).toBe('Null 0.00')
  })

  test('Replace formatted undefined number.', () => {
    const process = createProcessor()
    const result = process('Undefined {{value;number:2}}', {})

    expect(result).toBe('Undefined 0.00')
  })

  test('Replace number with format -2.', () => {
    const process = createProcessor()
    const result = process('Number {{value;number:-2}}', { value: 12 })

    expect(result).toBe('Number 12.00')
  })

  test('Replace zero number with format -2.', () => {
    const process = createProcessor()
    const result = process('Zero {{value;number:-2}}', { value: 0 })

    expect(result).toBe('Zero')
  })

  test('Replace null number with format -2.', () => {
    const process = createProcessor()
    const result = process('Null {{value;number:-2}}', { value: null })

    expect(result).toBe('Null')
  })

  test('Replace undefined number with format -2.', () => {
    const process = createProcessor()
    const result = process('Undefined {{value;number:-2}}', {})

    expect(result).toBe('Undefined')
  })

  test('Replace number with format -.', () => {
    const process = createProcessor()
    const result = process('Number {{value;number:-}}', { value: 12 })

    expect(result).toBe('Number 12')
  })

  test('Replace zero number with format -.', () => {
    const process = createProcessor()
    const result = process('Zero {{value;number:-}}', { value: 0 })

    expect(result).toBe('Zero')
  })

  test('Replace null number with format -.', () => {
    const process = createProcessor()
    const result = process('Null {{value;number:-}}', { value: null })

    expect(result).toBe('Null')
  })

  test('Replace undefined number with format -.', () => {
    const process = createProcessor()
    const result = process('Undefined {{value;number:-}}', {})

    expect(result).toBe('Undefined')
  })

  test('Replace number without type.', () => {
    const process = createProcessor()
    const result = process('Number {{value}}', { value: 34 })

    expect(result).toBe('Number 34')
  })

  test('Replace date.', () => {
    const process = createProcessor()
    const result = process('Date {{value;date}}', { value: new Date(2020, 5, 3).toISOString() })

    expect(result).toBe('Date 06/03/2020')
  })

  test('Replace null date.', () => {
    const process = createProcessor()
    const result = process('Null {{value;date}}', { value: null })

    expect(result).toBe('Null')
  })

  test('Replace undefined date.', () => {
    const process = createProcessor()
    const result = process('Undefined {{value;date}}', {})

    expect(result).toBe('Undefined')
  })

  test('Replace date with format.', () => {
    const process = createProcessor()
    const result = process('Date {{value;date:long}}', { value: new Date(2020, 5, 3).toISOString() })

    expect(result).toBe('Date 06/03/2020')
  })
})

