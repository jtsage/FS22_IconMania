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

const distPath  = (...args) => path.join(__dirname, '..', 'dist', ...args)
const makeKB    = ( size ) => `${Intl.NumberFormat('en-US', { maximumFractionDigits : 2, minimumFractionDigits : 2 }).format(size / 1024)} kB`
const makeKBstr = ( str ) => makeKB(str.length)

module.exports.prepDist = ( type ) => {
	switch ( type ) {
		case 'SVG' :
			fs.rmSync(distPath('SVG'), { recursive : true, force : true })
			fs.mkdirSync(distPath('SVG'))
			return ['ok', 'SVG Distribution Path Cleared & Created']
		case 'JS' :
			fs.rmSync(distPath('JS'), { recursive : true, force : true })
			fs.mkdirSync(distPath('JS'))
			return ['ok', 'JavaScript Distribution Path Cleared & Created']
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

module.exports.getSVGInput = ( inputFolder ) => {
	let   maxLength = 0
	const fileList  = []
	for ( const newFile of fs.readdirSync(inputFolder, { withFileTypes : true }) ) {
		if ( path.extname(newFile.name).toLowerCase() === '.svg' ) {
			maxLength = Math.max(maxLength, newFile.name.length)
			fileList.push(path.join(inputFolder, newFile.name))
		}
	}
	return { len : maxLength, list : fileList }
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

module.exports.cLog = ( logLines ) => {
	/* eslint-disable no-console */
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