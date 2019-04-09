import * as fs from 'fs'
import * as path from 'path'
import { range } from './helpers'

interface Stringifiable {
	toString: () => string
}

type IteratorMap = {
	[key: string]: () => Iterator<Stringifiable>
}

type Props = {
	amount: number
	template: string
	outFile?: fs.PathLike | null
	iterators: IteratorMap
	recycle?: boolean
}

const initializeIters = (iterators: IteratorMap) => {
	const initIters: { [key: string]: Iterator<Stringifiable> } = {}

	for (const key of Object.keys(iterators)) {
		initIters[key] = iterators[key]()
	}

	return initIters
}

export default ({
	amount,
	template,
	outFile = null,
	iterators,
	recycle = false
}: Props): string => {
	const outputs = new Array<string>(amount)

	const initIters = initializeIters(iterators)

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
				curr = template.split(toReplace).join(initIters[key].next().value.toString())
			}
		}
		outputs[i] = curr
	}

	const result = outputs.join('\n')

	if (outFile !== null) {
		const ext = path.extname(outFile as string)

		fs.writeFileSync(outFile, ext === '.json' ? JSON.stringify(outputs) : result)
	}

	return result
}

export * from './helpers'
