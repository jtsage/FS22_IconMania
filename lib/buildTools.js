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
//   Building tools


const fs              = require('node:fs')
const path            = require('node:path')
const { optimize }    = require('svgo')

const distPath = (...args) => path.join(__dirname, '..', 'dist', ...args)

module.exports.prepDist = ( type ) => {
	switch ( type ) {
		case 'SVG' :
			fs.rmSync(distPath('SVG'), { recursive : true })
			fs.mkdirSync(distPath('SVG'))
			break
		case 'JS' :
			fs.rmSync(distPath('JS'), { recursive : true })
			fs.mkdirSync(distPath('JS'))
			break
		case 'PNG' :
			fs.rmSync(distPath('PNG'), { recursive : true })
			fs.mkdirSync(distPath('PNG'))
			fs.mkdirSync(distPath('PNG', '32'))
			fs.mkdirSync(distPath('PNG', '256'))
			fs.mkdirSync(distPath('PNG', 'atlas'))
			break
		default :
			/* crap! */
	}
}

module.exports.getSVGInput = ( inputFolder ) => {
	const fileList = []
	for ( const newFile of fs.readdirSync(inputFolder, { withFileTypes : true }) ) {
		if ( path.extname(newFile.name).toLowerCase() === '.svg' ) {
			fileList.push(path.join(inputFolder, newFile.name))
		}
	}
	return fileList
}


// const makeSVG = (inputFolder, outputFolder) => {
// 	const logLines  = []
// 	let   total_old = 0
// 	let   total_new = 0
	
// 	fs.rmSync(outputFolder)
// 	fs.mkdirSync(outputFolder)

// 	for ( const newFile of fs.readdirSync(inputFolder, { withFileTypes : true }) ) {
// 		if ( path.extname(newFile.name).toLowerCase() === '.svg' ) {
// 			try {
// 				const oldContents = fs.readFileSync(path.join(inputFolder, newFile.name), { encoding : 'utf8' })
// 				const result      = optimize(oldContents, {
// 					path      : path.join(inputFolder, newFile.name),
// 					multipass : true,
// 					plugins   : [
// 						{
// 							name   : 'preset-default',
// 							params : {
// 								overrides : {
// 									removeViewBox : false,
// 								},
// 							},
// 						},
// 					],
// 				})
// 				fs.writeFileSync(path.join(outputFolder, newFile.name), result.data)
// 				logLines.push(['ok', `Optimized: ${newFile.name} :: ${oldContents.length} -> ${result.data.length}`])
// 				total_old += oldContents.length
// 				total_new += result.data.length
// 			} catch (err) {
// 				logLines.push(['error', `${newFile.name} :: ${err}`])
// 			}
// 		}
// 	}
// 	logLines.push(['ok', `Compression: ${total_old} -> ${total_new} (${Math.floor( (total_new / total_old) * 100 )}%)`])
// 	return logLines
// }
