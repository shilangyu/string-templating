import { range } from '../app'

describe('`range` helper function', () => {
	it('tests passing only upper limit', () => {
		const result = [...range(5)]
		const expected = [0, 1, 2, 3, 4]

		expect(result).toEqual(expected)
	})

	it('tests passing both limits', () => {
		const result = [...range(3, 10)]
		const expected = [3, 4, 5, 6, 7, 8, 9]

		expect(result).toEqual(expected)
	})

	it('tests passing both limits and a step', () => {
		const result = [...range(3, 21, 2)]
		const expected = [3, 5, 7, 9, 11, 13, 15, 17, 19]

		expect(result).toEqual(expected)
	})
})
