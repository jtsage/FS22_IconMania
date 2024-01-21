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
const { optimize }    = require('svgo')

const distPath    = (...args) => path.join(__dirname, '..', 'dist', ...args)
const makeKB      = ( size ) => `${Intl.NumberFormat('en-US', { maximumFractionDigits : 2, minimumFractionDigits : 2 }).format(size / 1024)} kB`
const makeKBstr   = ( str ) => makeKB(str.length)
const makeHTML    = ( classList, name ) => `<div class="col-2 text-center"><div class="p-2 border rounded-3 h-100"><i class="${classList}"></i><br><span class="text-nowrap">${name}</span></div></div>`
const getFileList = ( inputFolder, extension ) => {
	let   maxLength = 0
	const fileList  = []
	for ( const newFile of fs.readdirSync(inputFolder, { withFileTypes : true }) ) {
		if ( path.extname(newFile.name).toLowerCase() === extension ) {
			maxLength = Math.max(maxLength, newFile.name.length)
			fileList.push(path.join(inputFolder, newFile.name))
		}
	}
	return { len : maxLength, list : fileList }
}
const useTemplate = ( templateHTML, replacements ) => {
	let returnHTML = templateHTML
	try {
		for ( const key in replacements ) {
			returnHTML = returnHTML.replaceAll(new RegExp(`{{${key}}}`, 'g'), replacements[key])
		}

		return returnHTML
	} catch (err) {
		return ''
	}
}

module.exports.webSVGHead = () =>
	'[class^="fsico-"]::before, [class*=" fsico-"]::before {\n\tdisplay: inline-block;\n\tcontent: "";\n\tvertical-align: -.125em;\n\tbackground-repeat: no-repeat;\n\theight: 1em;\n\twidth: 1em;\n}\n\n'

module.exports.cleanAll = () => {
	fs.rmSync(distPath(), { recursive : true, force : true })
}

module.exports.copyAssets = (svgList) => {
	fs.copyFileSync(path.join(__dirname, '..', 'build', 'index.html'), distPath('index.html'))
	fs.copyFileSync(path.join(__dirname, '..', 'build', 'test.html'), distPath('test.html'))

	const jsFileContent = fs.readFileSync(path.join(__dirname, '..', 'build', 'template_fillType.js'), { encoding : 'utf8'} )

	fs.writeFileSync(distPath('fillType.js'), jsFileContent.replace('/***SVGSET***/', JSON.stringify(svgList)))
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

module.exports.getSVGInput = ( inputFolder ) => getFileList(inputFolder, '.svg')

module.exports.webSVG = ( inputFile, inputSVG ) => {
	const shortName = path.basename(inputFile).replace('.svg', '').replaceAll('_', '-')

	return {
		css  : `.fsico-${shortName}::before { background-image: url("data:image/svg+xml,${inputSVG.replaceAll('"', '\'').replaceAll('#', '%23')}"); }\n`,
		html : makeHTML(`h0 fsico-${shortName}`, shortName),
		name : shortName,
	}
}

module.exports.writeWebSVG = ( css, html ) => {
	const templateHTML = fs.readFileSync(path.join(__dirname, '..', 'build', 'sample-svg.html'), { encoding : 'utf8'} )

	fs.writeFileSync(distPath('CSS', 'fsico.css'), css.join(''))
	fs.writeFileSync(distPath('CSS', 'sample-fsico.html'), useTemplate(templateHTML, {
		icons     : html.join(''),
		title     : 'FSIcons Sample',
	}))
	return ['ok', 'Wrote SVG+CSS Version']
}

module.exports.writeSVG = ( inputFile, writeOutput = true, logPad ) => {
	const fileName = path.basename(inputFile)
	try {
		const oldContents = fs.readFileSync(inputFile, { encoding : 'utf8' })
		const result      = optimize(oldContents, {
			path      : path.join(inputFile),
			multipass : true,
			plugins   : [
				{
					name   : 'preset-default',
					params : { overrides : { removeViewBox : false } },
				}
			],
		})
		if ( writeOutput ) { fs.writeFileSync(distPath('SVG', fileName), result.data) }
		return {
			data : result.data,
			log  : [
				'ok',
				`${fileName.padEnd(logPad)} :: SVG : ${makeKBstr(oldContents)} -> ${makeKBstr(result.data)} (${Math.floor( (result.data.length / oldContents.length) * 100 )}%)`
			],
		}
	} catch (err) {
		return {
			data : null,
			log  : ['error', `${fileName.padEnd(logPad)} :: SVG : ${err}`],
		}
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