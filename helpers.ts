export const range: (from: number, to?: number, step?: number) => Iterable<number> = function*(
	from,
	to,
	step = 1
) {
	if (to === undefined) {
		to = from
		from = 0
	}
	for (let i = from; i < to; i += step) {
		yield i
	}
}
