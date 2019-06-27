const browsersync = require("browser-sync").create();

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const mincss = require('gulp-clean-css');

function compileStylus() {
    return gulp.src('public/**/*.styl', {base: './'})
        .pipe(stylus())
        .pipe(gulp.dest('.'));
}

function minifyJS() {
    return gulp.src(['public/**/*.js', '!public/**/*-min.js', '!public/projects/dsgame/code/nodeservercode.js'], {base: './'})
        .pipe(terser())
        .pipe(rename((path) => {
            path.basename = path.basename + '-min';
        }))
        .pipe(gulp.dest('.'));
}

function minifyCSS() {
    return gulp.src(['public/**/*.css', '!public/**/*-min.css'], {base: './'})
        .pipe(mincss())
        .pipe(rename((path) => {
            path.basename = path.basename + '-min';
        }))
        .pipe(gulp.dest('.'));
}
gulp.task('stylus', compileStylus);
gulp.task('minifyJS', minifyJS);
gulp.task('minifyCSS', minifyCSS);

gulp.task('build', gulp.series('stylus', 'minifyJS', 'minifyCSS'));

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
});