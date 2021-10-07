import { parseOptions } from './parser'

describe('Parser tests', () => {
  test('Process emtpy string.', () => {
    expect(parseOptions('')).toMatchObject({ dataPaths: [] })
  })
  test('Process simple data path.', () => {
    expect(parseOptions('test')).toMatchObject({ dataPaths: [ 'test' ] })
  })

  test('Process data path with defaultValue.', () => {
    expect(parseOptions('test!defaultValue')).toMatchObject({ dataPaths: [ 'test' ], defaultValue: 'defaultValue' })
  })

  test('Process data path with addition.', () => {
    expect(parseOptions('test+ CHF')).toMatchObject({ dataPaths: [ 'test' ], addition: ' CHF' })
  })

  test('Process data path with type.', () => {
    expect(parseOptions('test;date')).toMatchObject({ dataPaths: [ 'test' ], type: 'date' })
  })

  test('Process data path with  and format.', () => {
    expect(parseOptions('test;date:DD.MM.YYYY')).toMatchObject({ dataPaths: [ 'test' ], type: 'date', format: 'DD.MM.YYYY' })
  })
})
