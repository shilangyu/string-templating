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
})
