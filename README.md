# string templating

[![](https://github.com/shilangyu/string-templating/workflows/string-templating/badge.svg)](https://github.com/shilangyu/string-templating/actions)

template strings and output them to a file (use-case: sql queries, ML datasets)

`npm i --save string-templating`

- [string templating](#string-templating)
	- [usage](#usage)
	- [config](#config)
	- [helper functions](#helper-functions)
			- [range](#range)
			- [random](#random)
	- [examples](#examples)
			- [operations](#operations)
	- [typescipt](#typescipt)
			- [strongly typed returners](#strongly-typed-returners)

## usage

```js
import strTempl from "string-templating";

const output = strTempl({
  amount: 5,
  template: "${iterator.num}+${iterator.num}=${returners.sum}",
  iterators: {
    num: function*() {
      yield* [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
  },
  returners: {
    sum: iterVals => iterVals.num[0] + iterVals.num[1]
  },
  recycle: true
});

console.log(output); // [`1+2=3`, `3+4=7`, `5+6=11`, `7+8=15`, `9+10=19`]
```

## config

```ts
interface IStringifiable {
  toString: () => string;
}

type IteratorMap = {
  [key: string]: () => Iterator<IStringifiable>;
};

type ReturnerMap = {
  [key: string]: (iteratorValues: unknown) => IStringifiable;
};

interface ITemplatingOptions {
  amount: number;
  template: string;
  outFile?: fs.PathLike;
  iterators: IteratorMap;
  returners?: ReturnerMap;
  recycle?: boolean;
}
```

- `amount`: amount of strings to be generated
- `template`: the string to be templated. `${iterators.yourname}` in the string will be replaced with values from your iterators; `${returners.yourname}` in the string will be replaced with values from your returners
- `outFile`: if you wish for the output to be saved to a file, specify a file path. If your file will have a json extention it will be saved as a json array
- `iterators`: object with your iterators
- `returners`: object with your returners. A returner will get all generated values from iterators as an object. Values will be stored as an array (if recycling is ON) or plain value (if recycling is OFF)
- `recycle`: if true, new values will be generated for each replacement in the template (otherwise each template generation gets one value)

## helper functions

General purpose helper functions typical for string templating

#### range

```js
import { range } from "string-templating";
```

```ts
export function range(to: number): Iterable<number>;
export function range(
  from: number,
  to: number,
  step?: number
): Iterable<number>;
```

```js
for (let i of range(10)) console.log(i);
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
for (let i of range(7, 11)) console.log(i);
/*
7
8
9
10
*/
for (let i of range(5, 13, 3)) console.log(i);
/*
5
8
11
*/
```

#### random

```js
import { random } from "string-templating";
```

```ts
export function random(to: number, decimal?: boolean): number;
export function random(from: number, to: number, decimal?: boolean): number;
export function random<T>(array: T[]): T;
```

```js
random(5); // integer in the range of [0, 5)
random(5, true); // decimal in the range of [0, 5)

random(-3, 4); // integer in the range of [-3, 4)
random(-3, 4, true); // decimal in the range of [-3, 4)

random([1, true, "whoop"]); // returns random element from the array
```

## examples

`cd examples` -> `npm i` -> `node <example_name>`

#### operations

Generates `train.txt` and `test.txt`. The files contain calculations: `{num1}{operand}{num2}={result}`. A very simple example of a dataset generated for a basic machine learning problem.

## typescipt

#### strongly typed returners

Returners get iterator values as an `unknown`. There is a helper type `ExtractIteratorValues` to help you strongly type the values:

```ts
import StrTempl, {
  ExtractIteratorValues,
  ITemplatingOptions
} from "string-templating";

const iterators = {
  num: function*() {
    yield* [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }
};

const config: ITemplatingOptions = {
  amount: 5,
  template: "${iterators.num}+${iterators.num}=${returners.sum}",
  iterators,
  returners: {
    sum: (iterVals: ExtractIteratorValues<typeof iterators, true>) =>
      iterVals.num[0] + iterVals.num[1]
  },
  recycle: true
};

const result = StrTempl(config);
```

Pass in your iterators and whether you're recycling them.
