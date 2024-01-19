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
const svg2png         = require('svg2png')
const Spritesmith     = require('spritesmith')

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
const makeWEB     = (coordinates, name, big = false) => {
	const returnCSS    = []
	const iconHTML     = []
	const templateHTML = fs.readFileSync(path.join(__dirname, '..', 'build', 'sample-atlas.html'), { encoding : 'utf8'} )

	returnCSS.push(`.fsico {\n\tdisplay : inline-block;\n\twidth   : ${big ? 256 : 32}px;\n\theight  : ${big ? 256 : 32}px;\n\tzoom    : ${big ? 0.5 : 1};\n\tbackground-repeat : no-repeat;\n\tbackground-image  : url("./${name}.png");\n}\n\n`)

	if ( big ) {
		returnCSS.push(
			'.fsico_vsm  { zoom : 0.175; }\n',
			'.fsico_sm   { zoom : 0.25; }\n',
			'.fsico_big  { zoom : 0.75; }\n',
			'.fsico_huge { zoom : 1; }\n\n'
		)
	} else {
		returnCSS.push('.fsico_sm  { zoom : 0.5; }\n\n')
	}

	for ( const [filename, location] of Object.entries(coordinates) ) {
		const shortName = path.basename(filename).replace('.png', '').replaceAll('_', '-')
		returnCSS.push(`.fsico-${shortName} { background-position : ${location.x * -1}px ${location.y * -1}px; }\n`)
		iconHTML.push(makeHTML(`fsico ${big ? 'fsico_sm' : ''} fsico-${shortName}`, shortName))
	}

	return {
		css  : returnCSS.join(''),
		html : useTemplate(templateHTML, {
			icons     : iconHTML.join(''),
			showBig   : big ? ''          : 'd-none',
			showSmall : big ? 'd-none'    : '',
			size      : big ? '256'       : '32',
			title     : 'FSIcons Sample',
		}),
	}
}

module.exports.cleanAll = () => {
	fs.rmSync(distPath(), { recursive : true, force : true })
}

module.exports.prepDist = ( type ) => {
	switch ( type ) {
		case 'SVG' :
			fs.rmSync(distPath('SVG'), { recursive : true, force : true })
			fs.mkdirSync(distPath('SVG'), { recursive : true })
			return ['ok', 'SVG Distribution Path Cleared & Created']
		case 'CSS' :
			fs.rmSync(distPath('CSS'), { recursive : true, force : true })
			fs.mkdirSync(distPath('CSS'), { recursive : true })
			return ['ok', 'SVG+CSS Distribution Path Cleared & Created']
		case 'ATLAS' :
			fs.rmSync(distPath('PNG', 'atlas'), { recursive : true, force : true })
			fs.mkdirSync(distPath('PNG', 'atlas'), { recursive : true })
			return ['ok', 'PNG atlas Distribution Path Cleared & Created']
		case 'PNG' :
			fs.rmSync(distPath('PNG', '32'), { recursive : true, force : true })
			fs.rmSync(distPath('PNG', '256'), { recursive : true, force : true })
			fs.mkdirSync(distPath('PNG', '32'), { recursive : true })
			fs.mkdirSync(distPath('PNG', '256'), { recursive : true })
			return ['ok', 'PNG Distribution Path Cleared & Created']
		default :
			return ['error', 'Unknown Distribution type!']
	}
}

module.exports.getSVGInput = ( inputFolder ) => getFileList(inputFolder, '.svg')

module.exports.writeATLAS = ( ) => {
	const fileList32  = getFileList(distPath('PNG', '32'), '.png')
	const fileList256 = getFileList(distPath('PNG', '256'), '.png')
	
	Spritesmith.run({src : fileList32.list}, (err, result) => {
		if ( err ) { return ['error', `ATLAS Error :: ${err}`] }

		fs.writeFileSync(distPath('PNG', 'atlas', 'fsico32.png'), result.image)
		const webContents = makeWEB(result.coordinates, 'fsico32')
		fs.writeFileSync(distPath('PNG', 'atlas', 'fsico32.css'), webContents.css)
		fs.writeFileSync(distPath('PNG', 'atlas', 'sample-fsico32.html'), webContents.html)
	})

	Spritesmith.run({src : fileList256.list}, (err, result) => {
		if ( err ) { return ['error', `ATLAS Error :: ${err}`] }

		fs.writeFileSync(distPath('PNG', 'atlas', 'fsico256.png'), result.image)
		const webContents = makeWEB(result.coordinates, 'fsico256', true)
		fs.writeFileSync(distPath('PNG', 'atlas', 'fsico256.css'), webContents.css)
		fs.writeFileSync(distPath('PNG', 'atlas', 'sample-fsico256.html'), webContents.html)
	})
	return ['ok', 'PNG ATLAS Building']
}

module.exports.writePNG = ( inputFile, inputSVG, logPad = 0 ) => {
	const fileName        = path.basename(inputFile)
	const output32        = distPath('PNG', '32', fileName.replace('.svg', '.png'))
	const output256       = distPath('PNG', '256', fileName.replace('.svg', '.png'))

	try {
		const outputBuffer32  = svg2png.sync(inputSVG, { width : 32 })
		const outputBuffer256 = svg2png.sync(inputSVG, { width : 256 })

		fs.writeFileSync(output32, outputBuffer32)
		fs.writeFileSync(output256, outputBuffer256)

		return [
			'ok',
			`${fileName.padEnd(logPad)} :: PNG : [32x32] ${makeKB(outputBuffer32.length)} | [256x256] ${makeKB(outputBuffer256.length)}`
		]
	} catch (err) {
		return ['error', `${fileName.padEnd(logPad)} :: PNG : ${err}`]
	}
}

module.exports.webSVG = ( inputFile, inputSVG ) => {
	const shortName = path.basename(inputFile).replace('.svg', '').replaceAll('_', '-')

	return {
		css  : `.fsico-${shortName}::before {\n\tdisplay: inline-block;\n\tcontent: "";\n\tvertical-align: -.125em;\n\tbackground-image: url("data:image/svg+xml,${inputSVG.replaceAll('"', '\'').replaceAll('#', '%23')}");\n\tbackground-repeat: no-repeat;\n\theight: 1em;\n\twidth: 1em;\n}\n`,
		html : makeHTML(`h0 fsico-${shortName}`, shortName),
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