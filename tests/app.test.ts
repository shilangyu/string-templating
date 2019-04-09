import StrTempl from '../src/app'
import * as fs from 'fs'

const cleanFile = (path: fs.PathLike) => {
	if (fs.existsSync(path)) {
		fs.unlinkSync(path)
	}
}

describe('app', () => {
	it('tests if returned value is correct', () => {
		const result = StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield i
					}
				}
			}
		})
		const expected = [
			`i should be incrementing: 1`,
			`i should be incrementing: 2`,
			`i should be incrementing: 3`,
			`i should be incrementing: 4`,
			`i should be incrementing: 5`
		]

		expect(result).toEqual(expected)
	})

	it('tests if it creates a file', () => {
		StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield i
					}
				}
			},
			outFile: 'out.txt'
		})

		const result = fs.existsSync('out.txt')
		const expected = true

		cleanFile('out.txt')

		expect(result).toBe(expected)
	})

	it('tests if the file has correct content (txt)', () => {
		StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield i
					}
				}
			},
			outFile: 'out.txt'
		})

		const result = fs.readFileSync('out.txt').toString()
		const expected = `i should be incrementing: 1
i should be incrementing: 2
i should be incrementing: 3
i should be incrementing: 4
i should be incrementing: 5`

		cleanFile('out.txt')

		expect(result).toEqual(expected)
	})

	it('tests if the file has correct content (json)', () => {
		StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield i
					}
				}
			},
			outFile: 'out.json'
		})

		const result = fs.readFileSync('out.json').toString()
		const expected = `["i should be incrementing: 1","i should be incrementing: 2","i should be incrementing: 3","i should be incrementing: 4","i should be incrementing: 5"]`

		cleanFile('out.json')

		expect(result).toBe(expected)
	})

	it('tests if the file has same content as return value', () => {
		const result = StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield i
					}
				}
			},
			outFile: 'out.txt'
		}).join('\n')

		const expected = fs.readFileSync('out.txt').toString()

		cleanFile('out.txt')

		expect(result).toBe(expected)
	})

	it('tests recycling', () => {
		const result = StrTempl({
			amount: 5,
			template: 'i should be incrementing twice: ${iterator.inc} ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 10; i++) {
						yield i
					}
				}
			},
			recycle: true
		})

		const expected = [
			`i should be incrementing twice: 1 2`,
			`i should be incrementing twice: 3 4`,
			`i should be incrementing twice: 5 6`,
			`i should be incrementing twice: 7 8`,
			`i should be incrementing twice: 9 10`
		]

		cleanFile('out.txt')

		expect(result).toEqual(expected)
	})

	it('tests returners', () => {
		const result = StrTempl({
			amount: 5,
			template: '${iterator.num}+${iterator.num}=${returner.sum}',
			iterators: {
				num: function*() {
					yield* [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
				}
			},
			returners: {
				sum: iterVals => iterVals.num[0] + iterVals.num[1]
			},
			recycle: true
		})

		const expected = [`1+2=3`, `3+4=7`, `5+6=11`, `7+8=15`, `9+10=19`]

		expect(result).toEqual(expected)
	})
})
