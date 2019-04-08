import * as fs from 'fs'
import { range } from './helpers'

interface Stringifiable {
	toString: () => string
}

type Props = {
	amount: number
	template: string
	outFile?: fs.PathLike | null
	iterators: { [key: string]: () => Iterator<Stringifiable> }
	recycle?: boolean
}

export default ({
	amount,
	template,
	outFile = null,
	iterators,
	recycle = false
}: Props): string => {
	const outputs = new Array<string>(amount)

	const initIters: { [key: string]: Iterator<Stringifiable> } = {}
	for (const key of Object.keys(iterators)) {
		initIters[key] = iterators[key]()
	}

	for (const i of range(amount)) {
		let curr = template
		for (const key of Object.keys(initIters)) {
			const toReplace = '${iterator.' + key + '}'

			if (recycle) {
				while (true) {
					if (curr.includes(toReplace)) {
						curr = curr.replace(toReplace, initIters[key].next().value.toString())
					} else break
				}
			} else {
				curr = template
					.split('${iterator.' + key + '}')
					.join(initIters[key].next().value.toString())
			}
		}
		outputs[i] = curr
	}

	const result = outputs.join('\n')

	if (outFile !== null) {
		const {
			groups: { ext }
		} = (outFile as string).match(/\.(?<ext>\w+)$/) as { groups: { [key: string]: string } }

		fs.writeFileSync(outFile, ext === 'json' ? JSON.stringify(outputs) : result)
	}

	return result
}

export * from './helpers'
