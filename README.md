# string templating
template strings and output them to a file (use-case: sql queries)

## usage
### setup
in `setup.json`:
- `template`: the string to be templated
	- generators will be inserted with ${generator.`name`}
	- returners will be inserted with ${returner.`name`}

- `fileName`: output file name,
- `defaultExtension`: output file extension

in `generators.js`:
- create your generators and export them using `module.exports` (generator name will replace the template string with its value)

in `returners.js`:
- create your returners and export them using `module.exports` (returner name will replace the template string with its value)

in `app.js`:
```js
	// on line 25
	const retVals = {
		// here set your returners values:
		[returnerName]: returnerName(input)
	}
```

### start
`npm app <how many strings> <--json|--txt>?`
