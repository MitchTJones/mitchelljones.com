const browsersync = require("browser-sync").create();
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const mincss = require('gulp-clean-css');

function compileStylus() {
    return gulp.src('public/**/*.styl', {base: './'})
        .pipe(stylus())
        .pipe(rename((path) => {path.basename = path.basename + '-min'}))
        .pipe(gulp.dest('.'));
}

function minifyJS() {
    return gulp.src(['public/**/*.js', '!public/projects/dsgame/code/nodeservercode.js'], {base: './'})
        .pipe(terser())
        .pipe(rename((path) => {
            path.basename = path.basename + '-min';
        }))
        .pipe(gulp.dest('.'));
}

function minifyCSS() {
    return gulp.src('public/**/*.css', {base: './'})
        .pipe(mincss())
        .pipe(rename((path) => {
            path.basename = path.basename + '-min';
        }))
        .pipe(gulp.dest('.'));
}

gulp.task('build', () => {compileStylus();minifyJS();minifyCSS();});
gulp.task('stylus', compileStylus);
gulp.task('minifyJS', minifyJS);
gulp.task('minifyCSS', minifyCSS);

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
});

function browserSync(done) {
    browsersync.init({
       server: {
           baseDir: './'
       }
    });
    done();
}

function bsReload(done) {
    browsersync.reload();
    done();
}

function watchFiles() {
    gulp.watch('./styl/**/*', css);
    gulp.watch(['.js/**/*.js', '!.js/*.min.js'], js);
    gulp.watch('./**/*.html', bsReload);
}

gulp.task('dev', gulp.parallel(watchFiles, browserSync));