import { describe, it, expect } from '@jest/globals'
import { parseLanguage } from './newParser'


describe('Parser', () => {
    it('should properly parse select only', () => {
        expect(parseLanguage('SELECT * FROM files')).toEqual({
            tables: [],
            queryPart: 'SELECT * FROM files',
            intermediateContent: ''
        })
    })

    it('should parse properly table and select', () => {
        expect(parseLanguage(`TABLE x = file(a.csv)
SELECT * FROM files`)).toEqual({
            tables: [{
                tableName: 'x',
                fileName: 'a.csv'
            }],
            queryPart: 'SELECT * FROM files',
            intermediateContent: ''
        })
    })

    it('should parse properly multiple tables in the same file', () => {
        expect(parseLanguage(`TABLE x = file(a.csv)
TABLE y = file(very-long-name.csv)
SELECT * FROM a JOIN y ON a.id=y.id`)).toEqual({
            tables: [{
                tableName: 'x',
                fileName: 'a.csv'
            },
            {
                tableName: 'y',
                fileName: 'very-long-name.csv'
            }],
            queryPart: 'SELECT * FROM a JOIN y ON a.id=y.id',
            intermediateContent: ''
        })
    })

    it('should parse properly multiple tables in the same file', () => {
        expect(parseLanguage(`TABLE x = file(a.csv)
TABLE y = file(very-long-name.csv)

PLOT {
    x: 5,
    y: 654
}
SELECT * FROM a JOIN y ON a.id=y.id`)).toEqual({
            tables: [{
                tableName: 'x',
                fileName: 'a.csv'
            },
            {
                tableName: 'y',
                fileName: 'very-long-name.csv'
            }],
            queryPart: 'SELECT * FROM a JOIN y ON a.id=y.id',
            intermediateContent: `PLOT {
    x: 5,
    y: 654
}`
        })
    })

    it('should properly parse query where SELECT is lowercase', () => {
        expect(parseLanguage(`
HTML
select * from files`)).toEqual({
            "intermediateContent": "HTML",
            "queryPart": "select * from files",
            "tables": [],
        })
    })

    it('should properly parse query where SELECT is in sPoNgeBoB-cAsE', () => {
        expect(parseLanguage(`
HTML
sElEcT * fRoM files`)).toEqual({
            "intermediateContent": "HTML",
            "queryPart": "sElEcT * fRoM files",
            "tables": [],
        })
    })

    it('should allow for lowercase TABLE syntax', () => {
        expect(parseLanguage(`
            
            table x = file(a.csv)

            html

            select * from files
            
            `)).toEqual({
            'intermediateContent': 'html',
            'queryPart': 'select * from files',
            tables: [
                {
                    tableName: 'x',
                    fileName: 'a.csv'
                }
            ]
        })
    })
})