import * as fs from 'fs'
import { range } from './helpers'

interface Generator<T> extends Iterable<T> {
	next: () => { value: T; done: boolean }
}

type Props = {
	amount: number
	template: string
	outFile?: fs.PathLike
	generators: { [key: string]: Generator<string> }
}

export default ({ amount, template, outFile = 'out.txt', generators }: Props) => {
	const outputs = new Array<string>(amount)

	for (const i of range(amount)) {
		let curr = ''
		for (const key of Object.keys(generators)) {
			curr = template.split('${generator.' + key + '}').join(generators[key].next().value)
		}
		outputs[i] = curr
	}

	const {
		groups: { ext }
	} = (outFile as string).match(/\.(?<ext>\w+)^/) as { groups: { [key: string]: string } }

	fs.writeFileSync(outFile, ext === 'json' ? JSON.stringify(outputs) : outputs.join('\n'))
}

export { range } from './helpers'
