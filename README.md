# string templating

✨ zero dependencies✨

template strings and output them to a file (use-case: sql queries, ML datasets)

`npm i --save string-templating`

## usage

```js
const strTempl = require('string-templating').default

const output = strTempl({
	amount: 5,
	template: 'i should be incrementing: ${iterator.inc}',
	iterators: {
		inc: function*() {
			for (let i = 1; i <= 5; i++) {
				yield '' + i
			}
		}
	}
})

console.log(output)
/*
i should be incrementing: 1
i should be incrementing: 2
i should be incrementing: 3
i should be incrementing: 4
i should be incrementing: 5
*/
```

## config

```ts
type Props = {
	amount: number
	template: string
	outFile?: fs.PathLike | null
	iterators: { [key: string]: () => Iterator<string> }
	recycle?: boolean
}
```

- `amount`: amount of strings to be generated
- `template`: the string to be templated. `${iterator.yourname}` in the string will be replaced with values from your iterators
- `outFile`: if you wish for the output to be saved to a file, specify a file path. If your file will have a json extention it will be saved as a json array
- `iterators`: object with your iterators
- `recycle`: if true, new values will be generated for each replacement in the template (otherwise each template generation gets one value)

## helper functions

General purpuse helper functions typical for string templating

#### range

```js
const { range } = require('string-templating')
```

```ts
export function range(to: number): Iterable<number>
export function range(from: number, to: number, step?: number): Iterable<number>
```

```js
for (let i of range(10)) console.log(i)
/*
0
1
2
3
4
5
6
7
8
9
*/
for (let i of range(7, 11)) console.log(i)
/*
7
8
9
10
*/
for (let i of range(5, 13, 3)) console.log(i)
/*
5
8
11
*/
```

## TODO

- [ ] change output to be a buffer to support huge contents
- [x] deploy to npm
- [ ] create `random` helper function
- [ ] iterators with input values
- [ ] iterators not returning strings
- [ ] add examples
