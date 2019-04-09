const { default: strTempl, random } = require('string-templating')

function* number() {
	while (true) yield random(1, 10)
}

function* operand() {
	while (true) yield random(['+', '-', '*', '/'])
}

function calc({ number: numbers, operand }) {
	switch (operand[0]) {
		case '+':
			return numbers[0] + numbers[1]
		case '-':
			return numbers[0] - numbers[1]
		case '*':
			return numbers[0] * numbers[1]
		case '/':
			return numbers[0] / numbers[1]
	}
}

const config = {
	template: '${iterator.number}${iterator.operand}${iterator.number}=${returner.calc}',
	iterators: {
		number,
		operand
	},
	returners: {
		calc
	},
	recycle: true
}

// training set
strTempl({ ...config, amount: 10000, outFile: 'train.txt' })
// testing set
strTempl({ ...config, amount: 1000, outFile: 'test.txt' })
