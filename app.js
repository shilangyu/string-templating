const fs = require('fs')
const generators = require('./generators')
const returners = require('./returners')
const setup = require('./setup.json')

// get amount of strings to create
const amountToGenerate = Number(process.argv.find(e => !isNaN(e)))
const result = []

// init the generators
Object.entries(generators).forEach(([key, val]) => generators[key] = val())

// create strings
console.log('Creating...')

for(let i = 0; i < amountToGenerate; i++) {
	// get new generator value
	const genVals = Object.keys(generators).map(key => ({
		[key]: generators[key].next().value
	})).reduce((prev, curr) => ({
		...prev, 
		[Object.keys(curr)[0]]: curr[Object.keys(curr)[0]]
	}), {})

	// get new returner value
	const retVals = {
	}

	// embed data to template string
	let templCopy = setup.template
	Object.entries(genVals).forEach(([key, val]) => {
		templCopy = templCopy.split('${generator.' + key + '}').join(val)
	})
	Object.entries(retVals).forEach(([key, val]) => {
		templCopy = templCopy.split('${returner.' + key + '}').join(val)
	})
	
	result.push(templCopy)
	
	process.stdout.write(`${Math.floor(result.length / amountToGenerate * 100)}% done\r`);
}

// save strings
console.log('Saving...')

const fileType = process.argv.includes('--json') ? 'json' : process.argv.includes('--txt') ? 'txt' : setup.defaultExtension
const fileName = `${setup.fileName}.${fileType}`

fs.writeFile(
	`./${fileName}`, 
	fileType == 'txt' ? result.join('\n') : JSON.stringify(result), 
	(err) => console.log(err ? err : `All strings saved to ${fileName} :)`)
)
