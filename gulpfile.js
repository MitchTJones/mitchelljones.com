const browsersync = require("browser-sync").create();
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const terser = require('gulp-terser');

gulp.task('stylus', function() {
    return gulp.src('public/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('public/css'))
});

gulp.task('minify', function() {
    return gulp.src('public/**/*.js', {base: './'})
        .pipe(terser())
        .pipe(gulp.dest('.'));
});

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