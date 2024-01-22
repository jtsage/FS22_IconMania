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
const fs          = require('node:fs')
const buildTools  = require('./lib/buildTools.js')
const log         = buildTools.cLog
const { program } = require('commander')
const packJSON    = require('./package.json')
const { makeCSS } = require('svg2cssbg')

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
		.action((folder) => {
			const thisSVGPath = folder ?? path.join(__dirname, 'svg_original')
			try {
				const results     = makeCSS(thisSVGPath, {
					customHTML : buildTools.customHTML,
					makeSampleSheet : true,
					iconPrefix : 'fsico',
				})

				log(buildTools.prepDist('SVG'))
				log(buildTools.prepDist('CSS'))

				for ( const svgFile of results.svgCleanFiles ) {
					fs.writeFileSync(buildTools.distPath('SVG', svgFile.filename), svgFile.data)
				}

				fs.writeFileSync(buildTools.distPath('CSS', 'fsico.css'), results.cssFile)
				fs.writeFileSync(buildTools.distPath('CSS', 'sample-fsico.html'), results.htmlFile)

				buildTools.copyAssets(results.iconList)
			} catch (err) {
				log(['error', err], true)
			}
		})
	return build
}