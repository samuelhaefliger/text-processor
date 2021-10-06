import { objectProcessor as processor } from './object-processor'
import clone from 'lodash/cloneDeepWith'
import getValue from 'lodash/get'

const createProcessor = (processors?: { [key: string]: (value: any, dataSource: any) => any }) => {
  return processor({ clone, getValue, processors })
} 

const dataSource = {
  contact: {
    title: 'Mister',
    name: 'Doe',
    firstname: 'John',
  },
  invoice: {
    date: new Date(2020, 5, 12).toISOString(),
    text: 'Correction work',
    positions: [
      {
        date: new Date(2020, 5, 2).toISOString(),
        title: 'Material',
        vat: 7.7,
        total: 102.8,
      },
    ],
  },
}

describe('Object processor tests', () => {
  test('Process simple object.', () => {
    const template = {
      info: {
        title: 'Test',
      },
      content: [
        'Dear {{contact.title}} {{contact.firstname}} {{contact.name}}',
        { text: '{{invoice.text}}' },
        { if: 'invoice.date', text: '{{invoice.date;date}}' },
        { if: 'invoice.help', text: 'help' },
      ],
    }
    
    const process = createProcessor()
    const result = process(template, dataSource)

    expect(result).toMatchObject({
      content: [
        'Dear Mister John Doe',
        { text: 'Correction work' },
        { text: '06/12/2020' },
      ],
    })
  })

  test('Process object with key processor', () => {
    const template = {
      info: {
        title: 'Test',
      },
      content: [
        {
          table: {
            widths: [54, 16, 135, 30, 30, 30, 110, 70],
            repeat: "invoice.positions",
            header: [
              [
                { text: "Datum", alignment: "center" },
                { text: "Tarif", alignment: "left" },
                { text: "Tarifziffer", alignment: "left" },
                { text: "Anzahl", alignment: "right" },
                { text: "Preis", alignment: "right" },
                { text: "TPW", alignment: "right" },
                { text: "MWST", alignment: "right" },
                { text: "Betrag", alignment: "right" }
              ],
            ],
            template: [
              [
                { text: "{{invoice.positions[0].date;date}}", alignment: "center" },
                { text: "{{invoice.positions[0].title}}", alignment: "left" },
                { text: "{{invoice.positions[0].rate}}", alignment: "left" },
                { text: "{{invoice.positions[0].amount:2}}", alignment: "right" },
                { text: "{{invoice.positions[0].price:2}}", alignment: "right" },
                { text: "1.00", alignment: "right" },
                { text: "{{invoice.positions[0].vat+%;number:1}}", alignment: "right" },
                { text: "{{invoice.positions[0].total;number:2}}", alignment: "right" }
              ],
              [
                { text: "" },
                { text: "" },
                { text: "{{invoice.positions[0].rateName}}" },
                "", "", "", "", ""
              ]
            ],
          },
        },
      ],
    }
    
    const process = createProcessor({ table: ({ header, template, ...rest }) => ({ ...rest,  body: [...header, ...template] })})
    const result = process(template, dataSource)

    expect(result).toMatchObject({
      content: [
        {
          table: {
            body: [
              [
                { text: "Datum", alignment: "center" },
                { text: "Tarif", alignment: "left" },
                { text: "Tarifziffer", alignment: "left" },
                { text: "Anzahl", alignment: "right" },
                { text: "Preis", alignment: "right" },
                { text: "TPW", alignment: "right" },
                { text: "MWST", alignment: "right" },
                { text: "Betrag", alignment: "right" },
              ],
              [
                { text: "06/02/2020", alignment: "center" },
                { text: "Material", alignment: "left" },
                { text: "", alignment: "left" },
                { text: "", alignment: "right" },
                { text: "", alignment: "right" },
                { text: "1.00", alignment: "right" },
                { text: "7.7%", alignment: "right" },
                { text: "102.80", alignment: "right" }
              ],
              [
                { text: "" },
                { text: "" },
                { text: "" },
                "", "", "", "", ""
              ]
            ],
          },
        },
      ],
    })
  })
})
