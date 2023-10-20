// Include necessary modules.
const {
	src,
	dest,
	series,
	parallel,
	watch
} = require( 'gulp' )
const browserSync	= require( 'browser-sync' ).create()
const concat		= require( 'gulp-concat' )
const uglify		= require( 'gulp-uglify-es' ).default
const sass			= require( 'gulp-sass' )
const autoprefixer	= require( 'gulp-autoprefixer' )
const cleancss		= require( 'gulp-clean-css' )
const sourcemaps	= require( 'gulp-sourcemaps' )
const imagemin		= require( 'gulp-imagemin' )
const newer			= require( 'gulp-newer' )
const del			= require( 'del' )

const rollup		= require( 'gulp-better-rollup' )
const babel			= require( 'rollup-plugin-babel' )
const resolve		= require( 'rollup-plugin-node-resolve' )
const commonjs		= require( 'rollup-plugin-commonjs' )

/**
 * ! IMPORTANT - Change value to your local domain name.
 */
const baseDir = 'some-project.test/'

// BrowserSync initialization.
function browsersync(){
	browserSync.init( {
		proxy	: baseDir,	// Use local domain directory as base.
		notify	: false,	// Remove browser pop-up notification.
		online	: true		// Enable external address.
	} )
}

// Process scripts.
function scripts(){
	return src( ['src/js/main.js'], {base: 'src'} )		// Get main js file to process it.
		.pipe( sourcemaps.init( {
			loadMaps: true
		} ) )								// Initialize source maps and load existing.
		.pipe( rollup(
			{
				plugins: [
					babel(),
					resolve(),
					commonjs()
				]
			}, 'umd'
		) )
		.pipe( concat( 'main.min.js' ) )	// Conact in one file main.min.js.
		.pipe( sourcemaps.write( '.' ) )	// Write source maps.
		.pipe( dest( 'static/js/' ) )		// Output.
		.pipe( browserSync.stream() )		// Trigger browserSync.
}

// Scripts bundle build version.
function buildScripts(){
	return src( ['src/js/main.js'] )		// Get main js file to process it.
		.pipe( rollup(
			{
				plugins: [
					babel(),
					resolve(),
					commonjs()
				]
			}, 'umd'
		) )
		.pipe( concat( 'main.min.js' ) )	// Conact in one file main.min.js.
		.pipe( uglify() )					// Minify.
		.pipe( dest( 'static/js/' ) )		// Output.
}

// Process styles (SCSS).
function styles(){
	return src( ['src/scss/main.scss'] )				// Get only main.scss file (you must add all includes inside it).
		.pipe( sourcemaps.init( {
			loadMaps: true
		} ) )											// Initialize source maps and load existing.
		.pipe( sass() )									// Process.
		.pipe( concat( 'main.min.css' ) )				// Concat in one file main.min.css.
		.pipe( autoprefixer( {
			overrideBrowserslist: ['last 10 versions']
		} ) )											// Add prefixes.
		.pipe( sourcemaps.write( '.' ) )				// Write source maps.
		.pipe( dest( 'static/css/' ) )					// Output.
		.pipe( browserSync.stream() )					// Trigger browserSync.
}

// Styles bundle build version.
function buildStyles(){
	return src( ['src/scss/main.scss'] )				// Get only main.scss file (you must add all includes inside it).
		.pipe( sass() )									// Process.
		.pipe( concat( 'main.min.css' ) )				// Concat in one file main.min.css.
		.pipe( autoprefixer( {
			overrideBrowserslist: ['last 10 versions']
		} ) )											// Add prefixes.
		.pipe( cleancss( ( {
			level: {
				1: {
					specialComments: 0
				}
			}
		} ) ) )											// One-line minify.
		.pipe( dest( 'static/css/' ) )					// Output.
}

// Minify images.
function images(){
	return src( 'src/img/**/*' )		// Get all files from src directory.
		.pipe( newer( 'static/img' ) )	// Only new images (not in destination directory).
		.pipe( imagemin([
            imagemin.svgo({
                plugins: [
                    {
                        removeViewBox: false
                    }
                ]
            })
        ]) )			// Minimize images.
		.pipe( dest( 'static/img/' ) )	// Output.
}

// Clean static directory.
function clean(){
	return del( ['static/css/**', 'static/js/**'], { force: true } )
}

// Watch all necessary files.
function startwatch(){
	watch( 'src/scss/**/*', styles )
	watch( ['src/js/**/*.js'], scripts )
	watch( '**/*.php' ).on( 'change', browserSync.reload )
	watch( 'src/**/*', images )
}

// Export all functions to run by default or single.
exports.browsersync		= browsersync
exports.scripts			= scripts
exports.buildScripts	= buildScripts
exports.styles			= styles
exports.buildStyles		= buildStyles
exports.images			= images
exports.clean			= clean

// Use 'gulp' command to run them all parallel.
exports.default = parallel( scripts, styles, images, browsersync, startwatch )

// Use 'gulp build' command to run build for production (destination files are the same).
exports.build = series( clean, buildScripts, buildStyles, images )