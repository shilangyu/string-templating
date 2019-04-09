import * as fs from 'fs'
import * as path from 'path'
import { range } from './helpers'

interface Stringifiable {
	toString: () => string
}

type IteratorMap = {
	[key: string]: () => Iterator<Stringifiable>
}

type ReturnerMap = {
	[key: string]: (iteratorValues: any) => Stringifiable
}

type Props = {
	amount: number
	template: string
	outFile?: fs.PathLike | null
	iterators: IteratorMap
	returners?: ReturnerMap
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
	returners = {},
	recycle = false
}: Props): string[] => {
	const outputs = new Array<string>(amount)

	const initIters = initializeIters(iterators)

	for (const i of range(amount)) {
		let curr = template

		const iterVals: { [key: string]: Stringifiable | Stringifiable[] } = {}

		for (const key of Object.keys(initIters)) {
			const toReplace = '${iterator.' + key + '}'

			if (recycle) {
				iterVals[key] = []
				while (true) {
					if (curr.includes(toReplace)) {
						const currVal = initIters[key].next().value
						curr = curr.replace(toReplace, currVal.toString())
						;(iterVals[key] as Stringifiable[]).push(currVal)
					} else break
				}
			} else {
				const currVal = initIters[key].next().value
				curr = curr.split(toReplace).join(currVal.toString())
				iterVals[key] = currVal
			}
		}

		for (const key of Object.keys(returners)) {
			const toReplace = '${returner.' + key + '}'

			const currVal = returners[key](iterVals)
			curr = curr.split(toReplace).join(currVal.toString())
		}

		outputs[i] = curr
	}

	if (outFile !== null) {
		const ext = path.extname(outFile as string)

		fs.writeFileSync(outFile, ext === '.json' ? JSON.stringify(outputs) : outputs.join('\n'))
	}

	return outputs
}

export * from './helpers'
