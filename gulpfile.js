const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const buildConfig = require('./build.config.js');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const modRewrite = require('connect-modrewrite');
const glob = require('glob');
const notify = require('gulp-notify');
const path = require('path');

/** Clean Tasks **/
gulp.task('clean', function(){
	return del('build');
});

/** App build/compile tasks **/
const tscompile = function() {
	return gulp
		.src(['typings/main.d.ts', 'src/app/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(typescript(tscConfig.compilerOptions))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/app'));
}
gulp.task('tscompile:dev', ['clean'], tscompile);
gulp.task('tscompile:dev:watch', tscompile);

/** Copy tasks **/
const copyLibs = function() {
	return gulp
		.src(buildConfig.vendorFiles.js)
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/lib'));
}
gulp.task('copy:libs', ['clean'], copyLibs);

const copyAssets = function() {
	return gulp
		.src('./src/assets/**/*')
		.pipe(gulp.dest('build/assets'));
}
gulp.task('copy:assets', ['clean'], copyAssets);
gulp.task('copy:assets:watch', copyAssets);


const copyTemplates = function() {
	return gulp
		.src(['./src/app/**/*.html'])
		.pipe(gulp.dest('./build/app/'));
}
gulp.task('copy:templates', ['clean'], copyTemplates);
gulp.task('copy:templates:watch', copyTemplates);


/** Sass tasks **/
gulp.task('sass', ['clean'], function() {
	return gulp
		.src('./src/sass/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/css'));
});
gulp.task('sass:stream', function() {
	return gulp
		.src('./src/sass/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
});


/** Dev/deploy tasks **/
gulp.task('serve', ['dev'], function() {
	browserSync.init({
		server: './',
		middleware: [
            modRewrite([
                //'^/index.html(.*)$ - [L]',
                '^/app/(.*).html$ /build/app/$1.html',
                '^/testing/app/(.*).html$ /build/app/$1.html',
                //'^/.+.html(.*)$ - [L]',
                //'^/src/(.*)$ - [L]',
                //'^/assets/(.*)$ - [L]',
                //'^/i18n/(.*)$ - [L]',
                '^/testing/(.*)$ - [L]',
                '^/node_modules/(.*)$ - [L]',
                '^/build/(.*)$ - [L]',
                //'^/(.*.js)$ - [L]',
                '^/server-webapp/(.*)$ https://qa.verical.com/server-webapp/$1 [PL]',
                '^/generated/(.*)$ https://static.verical.com/qa/generated/$1 [PL]',
                //'^/(.*.json)$ - [L]',
                '^(/.+)$ /index.html [L]'
            ])
        ],
        https: true,
        reloadDebounce: 300,
        logLevel: "silent"
	});

	var tsWatcher = gulp.watch('src/app/**/*.ts', ['tscompile:dev:watch']);
	var templateWatcher = gulp.watch('src/app/**/*.html', {cwd: './'}, ['copy:templates:watch']);
	var testWatcher = gulp.watch('src/app/**/*.spec.ts', {cwd: './'}, ['test:gather']);
	gulp.watch('src/sass/**/*.scss', ['sass:stream']);
	gulp.watch('src/assets/**/*', ['copy:assets:watch']);
	gulp.watch(['index.html', 'testing/*.html'], browserSync.reload);
	gulp.watch('build/app/**/*', browserSync.reload);

	tsWatcher.on('change', deleteFileFromBuild([{pattern: /(.ts)$/, with: '.js'}]));
	testWatcher.on('change', deleteFileFromBuild([{pattern: /(.ts)$/, with: '.js'}]));
	templateWatcher.on('change', deleteFileFromBuild());
});

/**
	@param: replacements is an array of arguments to pass to the string.replace() function 
	for the filepaths, of the type
		{
			pattern: 'regext|substr',
			with: 'newstring'
		}
**/
function deleteFileFromBuild(replacements) {
	var repl = replacements || [];
	return function(event) {
		if (event.type == 'deleted') {
			var filepath = path.relative(path.resolve('src'), event.path);

			for (var i = 0; i < repl.length; i++) {
				filepath = filepath.replace(repl[i].pattern, repl[i].with);
			}

			filepath = path.resolve('build', filepath);
			del(filepath);
		}
	}
}

gulp.task('dev', ['copy:libs', 'copy:assets', 'copy:templates', 'tscompile:dev', 'test:gather', 'sass']);

/** Unit Testing **/
gulp.task('test:gather', function(){
	var testFiles = 
		glob.sync("src/app/**/*.spec.ts")
			.map(function(fileName) {
				return fileName.replace('src/', 'build/').replace('.ts', '.js');
			});
	require('fs').writeFile(
		'./testing/unit-test-files.js',
		JSON.stringify(
			{
				"unitFiles": testFiles
			}
		),
		function(err) {
			if (err) {
				console.error(err);
			}
		}
	);
});


/** Defaults **/
gulp.task('build', ['copy:libs', 'copy:assets', 'tscompile:dev', 'sass:stream']);
gulp.task('default', ['build']);