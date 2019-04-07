import * as fs from 'fs'

type Generator = Iterable<string>

type Props = {
	template: string
	outFile: fs.PathLike
	generators: Generator[]
}
export default ({ template, outFile, generators }: Props) => {}
