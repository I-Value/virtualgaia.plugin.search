// jshint node:true, strict:false
//
const nodemon = require("gulp-nodemon");
const gulp = require("gulp");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const pump = require("pump");


gulp.task('default', function(){
	gulp.start('concat', 'compress');
});

gulp.task('watch', function() {
  gulp.watch("./js/**/*.js", ['default']);
});
gulp.task('start', function() {
	gulp.start('server', 'watch');
});

gulp.task('server', function () {
  nodemon({ script: 'index.js',ext: 'js html css'} );
});

gulp.task('concat', ()=>{
	pump([
		gulp.src('js/**/*.js'),
		concat('virtualgaia.plugin.search.js'),
		gulp.dest('dist')
	]);
});

gulp.task('compress', ()=>{
	pump([
		gulp.src('js/**/*.js'),
		uglify(),
		concat('virtualgaia.plugin.search.min.js'),
		gulp.dest('dist')
	]);
});


