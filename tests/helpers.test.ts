import { range, random } from '../src/app'

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

describe('`random` helper function', () => {
	it('tests passing only upper limit', () => {
		Math.random = () => 0.5
		const result = random(5)
		const expected = 2

		expect(result).toBe(expected)
	})

	it('tests passing only upper limit as decimal', () => {
		Math.random = () => 0.6
		const result = random(7, true)
		const expected = 4.2

		expect(result).toBe(expected)
	})

	it('tests passing both limits', () => {
		Math.random = () => 0.6
		const result = random(5, 7)
		const expected = 6

		expect(result).toBe(expected)
	})

	it('tests passing both limits as decimal', () => {
		Math.random = () => 0.6
		const result = random(-3, -1, true)
		const expected = -1.8

		expect(result).toBe(expected)
	})

	it('tests passing an array', () => {
		Math.random = () => 0.6
		const result = random([-3, -1, true])
		const expected = -1

		expect(result).toBe(expected)
	})
})
