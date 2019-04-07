import * as fs from 'fs'
import { range } from './helpers'

type Props = {
	amount: number
	template: string
	outFile?: fs.PathLike
	generators: { [key: string]: Iterator<string> }
}

export default ({ amount, template, outFile = 'out.txt', generators }: Props): string => {
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

	const result = ext === 'json' ? JSON.stringify(outputs) : outputs.join('\n')
	fs.writeFileSync(outFile, result)

	return result
}

export { range } from './helpers'
