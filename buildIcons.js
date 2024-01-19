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
const packJSON    = require('./package.json')

program
	.name('buildIcons')
	.description('Build Icon Files from SVG originals')
	.version(packJSON.version)
	.addCommand(makeCleanCommand())
	.addCommand(makeBuildCommand(), { isDefault : true })

program.parse()

function makeCleanCommand() {
	const clean = new program.Command('clean')
	clean
		.description('Clean output folder')
		.action(() => { buildTools.cleanAll() })

	return clean
}

function makeBuildCommand() {
	const build = new program.Command('build')
	build
		.description('Build Icon Files')
		.argument('[folder]',   'Source Files Folder')
		.option('--no-svg',     'Do not write optimized SVG files')
		.option('--no-atlas',   'Do not write PNG atlas files')
		.option('--no-png',     'Do not write PNG files (required for atlas)')
		.option('--no-css',     'Do not write CSS+SVG files')
		.action((folder, options) => {
			if ( options.atlas && !options.png ) {
				program.outputHelp()
				log(['error', 'To build an sprite atlas, PNG build must be on.'], true)
				process.exit(1)
			}
			
			const thisSVGPath = folder ?? path.join(__dirname, 'svg_original')
			const fileList    = buildTools.getSVGInput(thisSVGPath)
			const svgCSS      = []
			const svgHTML     = []

			if ( fileList.len === 0 ) {
				program.outputHelp()
				log(['error', 'No files found'], true)
				process.exit(1)
			}
			
			if ( options.svg )   { log(buildTools.prepDist('SVG')) }
			// if ( options.png )   { log(buildTools.prepDist('PNG')) }
			// if ( options.atlas ) { log(buildTools.prepDist('ATLAS')) }
			if ( options.css )    { log(buildTools.prepDist('CSS')) }
			
			for ( const thisFile of fileList.list ) { //.slice(0, 2) ) {
				const thisSVGLoader = buildTools.writeSVG(thisFile, options.svg, fileList.len)
				const thisSVG       = thisSVGLoader.data
			
				log(thisSVGLoader.log)
			
				if ( thisSVG === null ) { continue }
			
				if ( options.png ) {
					// log(buildTools.writePNG(thisFile, thisSVG, fileList.len))
				}
				
				if ( options.css ) {
					const svgWEB = buildTools.webSVG(thisFile, thisSVG)
					svgCSS.push(svgWEB.css)
					svgHTML.push(svgWEB.html)
				}
			}
			if ( options.atlas ) {
				log(buildTools.writeATLAS())
			}
			if ( options.css ) {
				log(buildTools.writeWebSVG(svgCSS, svgHTML))
			}
		})
	return build
}

// program
// 	.command('clean', 'Clean Output Folder')
// 	.action(() => { buildTools.cleanAll() })


// 	.action((folder, options) => {
// 		if ( options.atlas && !options.png ) {
// 			program.outputHelp()
// 			log(['error', 'To build an sprite atlas, PNG build must be on.'], true)
// 			process.exit(1)
// 		}
		
// 		const thisSVGPath = folder ?? path.join(__dirname, 'svg_original')
// 		const fileList    = buildTools.getSVGInput(thisSVGPath)

// 		if ( fileList.len === 0 ) {
// 			program.outputHelp()
// 			log(['error', 'No files found'], true)
// 			process.exit(1)
// 		}
		
// 		if ( options.svg )                    { log(buildTools.prepDist('SVG')) }
// 		if ( options.png || options.atlas )   { log(buildTools.prepDist('PNG')) }
// 		if ( options.atlas )                  { log(buildTools.prepDist('ATLAS')) }
// 		if ( options.js )                     { log(buildTools.prepDist('JS')) }
		
// 		for ( const thisFile of fileList.list.slice(0, 2) ) {
// 			const thisSVGLoader = buildTools.writeSVG(thisFile, options.svg, fileList.len)
// 			const thisSVG       = thisSVGLoader.data
		
// 			log(thisSVGLoader.log)
		
// 			if ( thisSVG === null ) { continue }
		
// 			if ( options.png || options.atlas ) {
// 				log(buildTools.writePNG(thisFile, thisSVG, fileList.len))
// 			}
// 		}
// 	})

// program.parse()


// console.log(options)

// buildTools.prepDist('PNG')