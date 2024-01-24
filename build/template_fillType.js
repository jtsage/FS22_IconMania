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
	'barley-flour'                  : 'flour',
	'canola-oil'                    : 'oil-canola',
	'canolaoil'                     : 'oil-canola',
	'carton-roll'                   : 'cartonroll',
	'cereal'                        : 'cereals',
	'chaff-silage'                  : 'silage',
	'concentrate'                   : 'mineralfeed',
	'corn'                          : 'maize',
	'corn-dryer'                    : 'drymaize2',
	'cottonroundbale'               : 'roundbalecotton',
	'cottonsquarebale'              : 'squarebalecotton',
	'digestate-raw-methane'         : 'methane',
	'dry-maize2'                    : 'drymaize2',
	'dryalfalfa'                    : 'dryalfalfa-windrow',
	'dryclover'                     : 'dryclover-windrow',
	'eggs'                          : 'egg',
	'empty-pallets'                 : 'emptypallet',
	'fabric-cotton'                 : 'fabric',
	'fabric-wool'                   : 'fabric',
	'factory-power'                 : 'electriccharge',
	'fermenter-slurry'              : 'liquidmanure',
	'firtree'                       : 'wood',
	'foragemix'                     : 'forage-mixing',
	'grape-juice'                   : 'grapejuice',
	'grapes'                        : 'grape',
	'grass-dryer'                   : 'drygrass-windrow',
	'grass-silage'                  : 'silage',
	'grasscut'                      : 'grass-windrow',
	'gsi-corn-dryer'                : 'drymaize2',
	'hay'                           : 'drygrass-windrow',
	'hay-pellets'                   : 'haypellets',
	'hay-silage'                    : 'silage',
	'herbizidproduktion'            : 'herbicide',
	'hud-europallet'                : 'emptypallet',
	'liquid-fermenter-slurry'       : 'liquidmanure',
	'manure-in'                     : 'manure',
	'mineral-feed'                  : 'mineralfeed',
	'oat-flour'                     : 'flour',
	'oilseedradish'                 : 'oilradish',
	'olive-oil'                     : 'oil-olive',
	'oliveoil'                      : 'oil-olive',
	'olives'                        : 'olive',
	'pallet-furniture'              : 'furniture',
	'pallet-herbicide'              : 'herbicide',
	'pallet-pro-wash'               : 'pressurewasheradditive',
	'pallet-seed-treating-liquid'   : 'seedtreatingliquid',
	'pallet-seeds'                  : 'seeds',
	'pallet-silage-additive'        : 'silageadditive',
	'pallet-solid-fertilizerl'      : 'fertilizer',
	'pallet-tree-saplings'          : 'wood',
	'paper-roll'                    : 'paperroll',
	'pigfood-mixer'                 : 'pigfood',
	'planks'                        : 'boards',
	'poplartree'                    : 'poplar',
	'potatoe'                       : 'potato',
	'potatoes'                      : 'potato',
	'potatos'                       : 'potato',
	'rawmethane'                    : 'methane',
	'round-bale-cotton'             : 'roundbalecotton',
	'roundbale'                     : 'roundbalestraw',
	'silage-additive'               : 'silageadditive',
	'silage-in'                     : 'silage',
	'slurry'                        : 'liquidmanure',
	'soldable-electricity'          : 'electriccharge',
	'soldable-methane'              : 'methane',
	'solid-fertilizer'              : 'fertilizer',
	'solidfertilizer'               : 'fertilizer',
	'sorghum-flour'                 : 'flour',
	'soybeans'                      : 'soybean',
	'soybeanstraw'                  : 'beanstraw',
	'square-bale-grass'             : 'squarebalegrass',
	'square-bale-silage'            : 'squarebalesilage',
	'square-bale-straw'             : 'squarebalestraw',
	'squarebale'                    : 'squarebalestraw',
	'stones'                        : 'stone',
	'storable-fermentation-residue' : 'digestate',
	'storable-methane'              : 'methane',
	'straw-pellets'                 : 'strawpellets',
	'strawberries'                  : 'strawberry',
	'strawroundbale'                : 'roundbalestraw',
	'strawsquarebale'               : 'squarebalestraw',
	'sugar-beet'                    : 'sugarbeet',
	'sugar-beet-cut'                : 'sugarbeetcut',
	'sugar-beet-cut-sugar'          : 'sugar',
	'sugar-beet-sugar'              : 'sugar',
	'sugarbeet-cut'                 : 'sugarbeetcut',
	'sugarbeetcut-in'               : 'sugarbeetcut',
	'sugarcane-sugar'               : 'sugar',
	'sunflower-oil'                 : 'oil-sunflower',
	'sunfloweroil'                  : 'oil-sunflower',
	'sunflowers'                    : 'sunflower',
	'tmr-mixer'                     : 'forage-mixing',
	'tomatoes'                      : 'tomato',
	'tree-saplings'                 : 'wood',
	'treesaplings'                  : 'wood',
	'wheat-flour'                   : 'flour',
	'wood-wood-beams'               : 'woodbeam',
	'woodchipsroundbale'            : 'roundbalewood',
	'woodchipssquarebale'           : 'squarebalewood',
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