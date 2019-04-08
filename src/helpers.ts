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

export function random(to: number, decimal?: boolean): number
export function random(from: number, to: number, decimal?: boolean): number

export function random(from: number, to?: number | boolean, decimal = false) {
	if (typeof to === 'boolean' || to === undefined) {
		decimal = to || false
		to = from
		from = 0
	}

	let rand = Math.random() * (to - from) + from
	if (!decimal) rand = Math.floor(rand)

	return rand
}
