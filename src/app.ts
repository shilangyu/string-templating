import * as fs from 'fs'
import * as path from 'path'
import { range } from './helpers'

export interface IStringifiable {
	toString: () => string
}

export type IteratorMap = {
	[key: string]: () => Iterator<IStringifiable>
}

export type ReturnerMap = {
	[key: string]: (iteratorValues: unknown) => IStringifiable
}

export type ExtractIteratorValues<T extends IteratorMap, U extends boolean> = {
	[key in keyof T]: ReturnType<T[key]> extends Iterator<infer B>
		? U extends true
			? B[]
			: B
		: never
}

export interface ITemplatingOptions {
	amount: number
	template: string
	outFile?: fs.PathLike
	iterators: IteratorMap
	returners?: ReturnerMap
	recycle?: boolean
}

const initializeIters = (iterators: IteratorMap) => {
	const initIters: { [key: string]: Iterator<IStringifiable> } = {}

	for (const key of Object.keys(iterators)) {
		initIters[key] = iterators[key]()
	}

	return initIters
}

export default ({
	amount,
	template,
	outFile,
	iterators,
	returners = {},
	recycle = false
}: ITemplatingOptions): string[] => {
	const outputs = new Array<string>(amount)

	const initIters = initializeIters(iterators)

	for (const i of range(amount)) {
		let curr = template

		const iterVals: { [key: string]: IStringifiable | IStringifiable[] } = {}

		for (const key of Object.keys(initIters)) {
			const toReplace = '${iterators.' + key + '}'

			if (recycle) {
				iterVals[key] = []
				while (true) {
					if (curr.includes(toReplace)) {
						const currVal = initIters[key].next().value
						curr = curr.replace(toReplace, currVal.toString())
						;(iterVals[key] as IStringifiable[]).push(currVal)
					} else break
				}
			} else {
				const currVal = initIters[key].next().value
				curr = curr.split(toReplace).join(currVal.toString())
				iterVals[key] = currVal
			}
		}

		for (const key of Object.keys(returners)) {
			const toReplace = '${returners.' + key + '}'

			const currVal = returners[key](iterVals)
			curr = curr.split(toReplace).join(currVal.toString())
		}

		outputs[i] = curr
	}

	if (outFile) {
		const ext = path.extname(outFile as string)

		fs.writeFileSync(outFile, ext === '.json' ? JSON.stringify(outputs) : outputs.join('\n'))
	}

	return outputs
}

export * from './helpers'
