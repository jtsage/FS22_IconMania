/* ______ _____  _____  _____ _____                    
*  |  ___/  ___|/ __  \/ __  \_   _|                   
*  | |_  \ `--. `' / /'`' / /' | |  ___ ___  _ __  ___ 
*  |  _|  `--. \  / /    / /   | | / __/ _ \| '_ \/ __|
*  | |   /\__/ /./ /___./ /____| || (_| (_) | | | \__ \
*  \_|   \____/ \_____/\_____/\___/\___\___/|_| |_|___/
*    Farming Simulator HUD Fill Icons - SVG Edition
*/
// Main Entry Point for Build


const path        = require('node:path')
const buildTools  = require('./lib/buildTools.js')
const log         = buildTools.cLog
const { program } = require('commander')

program
	.name('buildIcons')
	.description('Build Icon Files from SVG originals')
	.option('-f, --folder <location>', 'Location of input SVG files')
	.option('--no-svg', 'Do not write optimized SVG files')
	.option('--no-atlas', 'Do not write PNG atlas files')
	.option('--no-png', 'Do not write PNG files (required for atlas)')
	.option('--no-js', 'Do not write javaScript files')

program.parse()

const options = program.opts()

const thisSVGPath = options.folder ?? path.join(__dirname, 'svg_original')
const fileList    = buildTools.getSVGInput(thisSVGPath)

if ( options.svg )                    { log(buildTools.prepDist('SVG')) }
if ( options.png || options.atlas )   { log(buildTools.prepDist('PNG')) }
if ( options.atlas )                  { log(buildTools.prepDist('ATLAS')) }
if ( options.js )                     { log(buildTools.prepDist('JS')) }

for ( const thisFile of fileList.list.slice(0, 2) ) {
	const thisSVGLoader = buildTools.writeSVG(thisFile, options.svg, fileList.len)
	const thisSVG       = thisSVGLoader.data

	log(thisSVGLoader.log)

	if ( thisSVG === null ) { continue }

	if ( options.png || options.atlas ) {
		log(buildTools.writePNG(thisFile, thisSVG, fileList.len))
	}
}

// console.log(options)

// buildTools.prepDist('PNG')