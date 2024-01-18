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
const { program } = require('commander')

program
	.name('buildIcons')
	.description('Build Icon Files from SVG originals')
	.option('-f, --folder <location>', 'Location of input SVG files')

program.parse()

const options = program.opts()

const thisSVGPath = options.folder ?? path.join(__dirname, 'svg_original')


console.log(buildTools.getSVGInput(thisSVGPath))

// buildTools.prepDist('PNG')