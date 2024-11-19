/* ______ _____  _____  _____ _____                    
*  |  ___/  ___|/ __  \/ __  \_   _|                   
*  | |_  \ `--. `' / /'`' / /' | |  ___ ___  _ __  ___ 
*  |  _|  `--. \  / /    / /   | | / __/ _ \| '_ \/ __|
*  | |   /\__/ /./ /___./ /____| || (_| (_) | | | \__ \
*  \_|   \____/ \_____/\_____/\___/\___\___/|_| |_|___/
*    Farming Simulator HUD Fill Icons - SVG Edition
*/
// buildTools.js
//
//   Library of build tools

const fs              = require('node:fs')
const path            = require('node:path')
const c               = require('ansi-colors')

const distPath    = (...args) => path.join(__dirname, '..', 'dist', ...args)

module.exports.distPath = distPath

module.exports.customHTML = {
	foot  : () => '</div></div></body></html>',
	head  : (cssFileContents) => [
		'<!doctype html>',
		'<html lang="en"><head>',
		'<meta charset="utf-8">',
		'<meta name="viewport" content="width=device-width, initial-scale=1">',
		'<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">',
		'<link href="fsico25.css" rel="stylesheet">',
		`<style>.h0 { font-size: 4rem; }\n${cssFileContents}</style>`,
		'<title>Icon Samples</title></head><body>',
		'<h1 class="text-center">Sample Icons</h1><h2 class="text-center">Scalable!</h2>'
	].join('\n'),
	line  : (_, iconClass) =>
		`<div class="col-2 text-center"><div class="p-2 border rounded-3 h-100"><i class="h0 ${iconClass}"></i><br><span class="text-nowrap">${iconClass}</span></div></div>`,
	scale : () => [
		'<div class="text-center">',
		...[1, 2, 3, 4, 5, 6].map((x) => `<span class="display-${x}"><i class="fsico-fill-propane"></i></span>`),
		...[2, 3, 4, 5, 6].map((x) => `<span class="h${x}"><i class="fsico-fill-propane"></i></span>`),
		...[6, 5, 4, 3, 2].map((x) => `<span class="h${x}"><i class="fsico-fill-methane"></i></span>`),
		...[6, 5, 4, 3, 2, 1].map((x) => `<span class="display-${x}"><i class="fsico-fill-methane"></i></span>`),
		'</div>',
		'<h3>Icons</h3><div class="px-3"><div class="row g-2 px-2 justify-content-center">'
	].join('\n'),
}

module.exports.cleanAll = () => {
	fs.rmSync(distPath(), { recursive : true, force : true })
}

module.exports.copyAssets = (svgList) => {
	fs.copyFileSync(path.join(__dirname, '..', 'build', 'index.html'), distPath('index.html'))
	fs.copyFileSync(path.join(__dirname, '..', 'build', 'test.html'), distPath('test.html'))

	const jsFileContent = fs.readFileSync(path.join(__dirname, '..', 'build', 'template_fillType.js'), { encoding : 'utf8'} )

	fs.writeFileSync(distPath('fillType25.js'), jsFileContent.replace('/***SVGSET***/', JSON.stringify(svgList)))
}

module.exports.prepDist = ( type ) => {
	switch ( type ) {
		case 'SVG' :
			fs.mkdirSync(distPath('SVG'), { recursive : true })
			return ['ok', 'SVG Distribution Path Cleared & Created']
		case 'CSS' :
			fs.mkdirSync(distPath('CSS'), { recursive : true })
			return ['ok', 'SVG+CSS Distribution Path Cleared & Created']
		default :
			return ['error', 'Unknown Distribution type!']
	}
}

module.exports.cLog = ( logLines, lineBefore = false ) => {
	/* eslint-disable no-console */
	if ( lineBefore ) { console.log('') }
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
	/* eslint-enable no-console */
}