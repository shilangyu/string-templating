import StrTempl from '../app'
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
						yield '' + i
					}
				}
			}
		})
		const expected = `i should be incrementing: 1
i should be incrementing: 2
i should be incrementing: 3
i should be incrementing: 4
i should be incrementing: 5`

		expect(result).toBe(expected)
	})

	it('tests if it creates a file', () => {
		StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield '' + i
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
						yield '' + i
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

		expect(result).toBe(expected)
	})

	it('tests if the file has correct content (json)', () => {
		StrTempl({
			amount: 5,
			template: 'i should be incrementing: ${iterator.inc}',
			iterators: {
				inc: function*() {
					for (let i = 1; i <= 5; i++) {
						yield '' + i
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
						yield '' + i
					}
				}
			},
			outFile: 'out.txt'
		})

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
						yield '' + i
					}
				}
			},
			recycle: true
		})

		const expected = `i should be incrementing twice: 1 2
i should be incrementing twice: 3 4
i should be incrementing twice: 5 6
i should be incrementing twice: 7 8
i should be incrementing twice: 9 10`

		cleanFile('out.txt')

		expect(result).toBe(expected)
	})
})
