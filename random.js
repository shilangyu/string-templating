module.exports = ({ from=0, to, length }) => {
	if ([from, to].every(e => e != undefined)) {
		let drawed = Math.floor(Math.random() * (to - from) + from)
		if (length)
			drawed = String(drawed).padStart(length, '0')
		return drawed
	} else if (length) {
		let drawed = Math.floor(Math.random() * 10 ** length)
		drawed = String(drawed).padStart(length, '0')
		return drawed
	} 
}
