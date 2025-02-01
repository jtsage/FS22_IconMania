/* ______ _____  _____  _____ _____                    
*  |  ___/  ___|/ __  \/ __  \_   _|                   
*  | |_  \ `--. `' / /'`' / /' | |  ___ ___  _ __  ___ 
*  |  _|  `--. \  / /    / /   | | / __/ _ \| '_ \/ __|
*  | |   /\__/ /./ /___./ /____| || (_| (_) | | | \__ \
*  \_|   \____/ \_____/\_____/\___/\___\___/|_| |_|___/
*    Farming Simulator HUD Fill Icons - SVG Edition
*/
// fillType element replacer

/* cSpell:disable */
/* eslint-disable comma-spacing, quotes */
const ft_known = new Set(/***SVGSET***/)
/* eslint-enable comma-spacing, quotes */

const ft_map = {
	'barleyflour'                   : 'flour',
	'beanstraw'                     : 'soybeancut',
	'beetroot'                      : 'redbeet',
	'canolaoil'                     : 'oilcanola',
	'cardboard'                     : 'cartonroll',
	'carton-roll'                   : 'cartonroll',
	'cereal'                        : 'cereals',
	'chaffsilage'                   : 'silage',
	'concentrate'                   : 'mineralfeed',
	'corn'                          : 'maize',
	'corndryer'                     : 'drymaize2',
	'cornstalks'                    : 'corncut',
	'cottonroundbale'               : 'roundbalecotton',
	'cottonsquarebale'              : 'squarebalecotton',
	'digestaterawmethane'           : 'methane',
	'dryalfalfa'                    : 'dryalfalfawindrow',
	'dryclover'                     : 'drycloverwindrow',
	'drymaize2'                     : 'drymaize2',
	'eggs'                          : 'egg',
	'emptypallets'                  : 'emptypallet',
	'europallet'                    : 'emptypallet',
	'fabriccotton'                  : 'fabric',
	'fabricwool'                    : 'fabric',
	'factorypower'                  : 'electriccharge',
	'fermenterslurry'               : 'liquidmanure',
	'firtree'                       : 'wood',
	'foragemixing'                  : 'foragemix',
	'grape-juice'                   : 'grapejuice',
	'grapes'                        : 'grape',
	'grasscut'                      : 'grasswindrow',
	'grassdryer'                    : 'drygrasswindrow',
	'grasssilage'                   : 'silage',
	'gsicorndryer'                  : 'drymaize2',
	'hay'                           : 'drygrasswindrow',
	'haysilage'                     : 'silage',
	'herbizidproduktion'            : 'herbicide',
	'hudeuropallet'                 : 'emptypallet',
	'liquidfermenterslurry'         : 'liquidmanure',
	'manurein'                      : 'manure',
	'milk'                          : 'milkcow',
	'oatflour'                      : 'flour',
	'oilseedradish'                 : 'oilradish',
	'oliveoil'                      : 'oilolive',
	'olives'                        : 'olive',
	'palletfurniture'               : 'furniture',
	'palletherbicide'               : 'herbicide',
	'palletprowash'                 : 'pressurewasheradditive',
	'palletseeds'                   : 'seeds',
	'palletseedtreatingliquid'      : 'seedtreatingliquid',
	'palletsilageadditive'          : 'silageadditive',
	'palletsolidfertilizerl'        : 'fertilizer',
	'pallettreesaplings'            : 'wood',
	'pigfoodmixer'                  : 'pigfood',
	'planks'                        : 'boards',
	'poplartree'                    : 'poplar',
	'poppy'                         : 'mohn',
	'potatochips'                   : 'chips',
	'potatoe'                       : 'potato',
	'potatoes'                      : 'potato',
	'potatos'                       : 'potato',
	'rawmethane'                    : 'methane',
	'roundbale'                     : 'roundbalestraw',
	'silagein'                      : 'silage',
	'slurry'                        : 'liquidmanure',
	'sodiumchlorid'                 : 'sodiumchloride',
	'soldableelectricity'           : 'electriccharge',
	'soldablemethane'               : 'methane',
	'solidfertilizer'               : 'fertilizer',
	'sorghumflour'                  : 'flour',
	'soybeans'                      : 'soybean',
	'soybeanstraw'                  : 'soybeancut',
	'soymilk'                       : 'milksoy',
	'squarebale'                    : 'squarebalestraw',
	'stones'                        : 'stone',
	'storablefermentationresidue'   : 'digestate',
	'storablemethane'               : 'methane',
	'strawberries'                  : 'strawberry',
	'strawpellets'                  : 'strawpellets',
	'strawroundbale'                : 'roundbalestraw',
	'strawsquarebale'               : 'squarebalestraw',
	'sugarbeetcutin'                : 'sugarbeetcut',
	'sugarbeetcutsugar'             : 'sugar',
	'sugarbeetsugar'                : 'sugar',
	'sugarcanesugar'                : 'sugar',
	'sunfloweroil'                  : 'oilsunflower',
	'sunflowers'                    : 'sunflower',
	'tmrmixer'                      : 'foragemix',
	'tomatoes'                      : 'tomato',
	'treesapling'                   : 'wood',
	'treesaplings'                  : 'wood',
	'wheatflour'                    : 'flour',
	'wind'                          : 'air',
	'woodchipsroundbale'            : 'roundbalewood',
	'woodchipssquarebale'           : 'squarebalewood',
	'woodwoodbeams'                 : 'woodbeam',
}
/* cSpell:enable */

const ft_getAttrib = (element, attrib) => {
	const attribValue = element.getAttribute(attrib)

	return ( typeof attribValue !== 'string' || attribValue === null ) ? null :	attribValue.toLowerCase()
}

const ft_normalizeName = (name) => {
	if ( name === null ) { return null }
	let sanitizedName = name

	sanitizedName = sanitizedName.replaceAll(/[()[\]]/g, '')
	sanitizedName = sanitizedName.replace(/\.png$/, '')
	sanitizedName = sanitizedName.replace(/\.jpg$/, '')
	sanitizedName = sanitizedName.replace(/\.dds$/, '')
	sanitizedName = sanitizedName.replaceAll('_', '-')
	sanitizedName = sanitizedName.replace(/^fs22/, '')
	sanitizedName = sanitizedName.replace(/^hud-fill-/, '')
	sanitizedName = sanitizedName.replace(/^fill-/, '')
	sanitizedName = sanitizedName.replace(/^silo-/, '')
	sanitizedName = sanitizedName.replace(/^big-bag-/, '')
	sanitizedName = sanitizedName.replaceAll('-', '')

	if ( typeof ft_map[sanitizedName] !== 'undefined' ) {
		sanitizedName = ft_map[sanitizedName]
	}

	const addFill = `fill-${sanitizedName}`

	if ( ft_known.has(addFill) ) { return [addFill, sanitizedName] }

	/* eslint-disable no-console */
	console.error(`${name} not found (maybe ${sanitizedName} or ${addFill})`)
	return ['fill-unknown', name]
	/* eslint-enable no-console */
}

const ft_doReplace = () => {
	for ( const element of document.querySelectorAll('fillType') ) {
		const thisName = ft_getAttrib(element, 'name')
		const thisIcon = ft_normalizeName(thisName)
		if ( thisIcon === null ) { continue }
		element.innerHTML = `<i title="${thisIcon[1]}" class="fsico-${thisIcon[0]}"></i>`
	}
}

window.addEventListener('DOMContentLoaded', () => { ft_doReplace() })