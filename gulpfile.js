// jshint node:true, strict:false
//
const nodemon = require("gulp-nodemon");
const gulp = require("gulp");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const pump = require("pump");
const ngHtml2Js = require("gulp-ng-html2js");
const minifyHtml = require("gulp-minify-html");
const rename = require("gulp-rename");


gulp.task('default', function(){
	gulp.start('html2js','concat');
});

gulp.task('watch', function() {
  gulp.watch("./js/**/*.*", ['default']);
});

gulp.task('start', function() {
	gulp.start('server', 'watch');
});

gulp.task('server', function () {
  nodemon({ script: 'index.js',ext: 'js html css'} );
});

gulp.task('html2js', function () {
	pump([
		gulp.src('js/**/*.html'),
		minifyHtml({empty: true,spare: true,quotes: true}),
		ngHtml2Js({
			moduleName: "virtualgaia.plugin.search",
			prefix: "js/"
		}),
		gulp.dest('./js')
	]);
});

gulp.task('concat', ()=>{
	pump([
		gulp.src('js/**/*.js'),
		concat('virtualgaia.plugin.search.js'),
		gulp.dest('dist')
	]);
});

gulp.task('compress', () => {

	return gulp.src(['./dist/*.js','!./dist/*.min.js'])
		.pipe(uglify({mangle: false}))
		.pipe(rename((path) => { path.basename += ".min" }))
		.pipe(gulp.dest('dist'))
	;

});


