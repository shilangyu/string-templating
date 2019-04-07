export function range(to: number): Iterable<number>
export function range(from: number, to: number, step?: number): Iterable<number>

export function* range(from: number, to?: number, step = 1) {
	if (to === undefined) {
		to = from
		from = 0
	}
	for (let i = from; i < to; i += step) {
		yield i
	}
}
