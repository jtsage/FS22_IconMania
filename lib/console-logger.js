/* ______ _____  _____  _____ _____                    
*  |  ___/  ___|/ __  \/ __  \_   _|                   
*  | |_  \ `--. `' / /'`' / /' | |  ___ ___  _ __  ___ 
*  |  _|  `--. \  / /    / /   | | / __/ _ \| '_ \/ __|
*  | |   /\__/ /./ /___./ /____| || (_| (_) | | | \__ \
*  \_|   \____/ \_____/\_____/\___/\___\___/|_| |_|___/
*    Farming Simulator HUD Fill Icons - SVG Edition
*/
// console-logger.
//
//   A simple ANSI based console logger for this package

/* eslint-disable no-console */

const c               = require('ansi-colors')

module.exports.cLog = ( logLines ) => {
	if ( typeof logLines === 'undefined' || logLines === null ) { return }
	if ( typeof logLines !== 'object' || ! Array.isArray(logLines) ) {
		console.log(logLines)
		return
	}
	const allLines = Array.isArray(logLines[0]) ? logLines : [logLines]

	for ( const thisLine of allLines ) {
		switch (thisLine[0]) {
			case 'error' :
				console.log(c.redBright(`🗙 FAILED: ${c.red(thisLine[1])}`))
				break
			case 'ok' :
				console.log(c.greenBright(`✓ PASSED: ${c.green(thisLine[1])}`))
				break
			default :
				console.log(c.yellowBright(`⟁ WARNINGS: ${c.yellow(thisLine[1])}`))
				break
		}
	}
}