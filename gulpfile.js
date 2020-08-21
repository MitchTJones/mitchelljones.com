const fs = require('fs');
const ms = require('merge-stream');
const del = require('del');
// Gulp
const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
// CSS
const sass = require('gulp-sass');
const mincss = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const autoprefixer = require('gulp-autoprefixer');
// JS
const babel = require('gulp-babel');
const minjs = require('gulp-terser');
const jshint = require('gulp-jshint');
// Pug
const data = require('gulp-data');
const pug = require('gulp-pug');
// Images
const jpegtran = require('imagemin-jpegtran');
const imagemin = require('gulp-imagemin');
// Markdown
const showdown = require('showdown');
const converter = new showdown.Converter();

const paths = {
    src: 'src',
    dest: 'public'
};

const globs = {
    pug: {
        src: [
            paths.src + '/views/**/*.pug',
            '!' + paths.src + '/views/includes',
            '!' + paths.src + '/views/project.pug'
        ],
        dest: paths.dest,
        base: 'views',
        watch: paths.src + 'views/**/*.pug',
        local: paths.src + '/assets/project-data.json'
    },
    sass: {
        src: [
            paths.src + '/assets/styles/*.scss',
            paths.src + '/vendor/bootstrap/scss/bootstrap.scss'
        ],
        dest: paths.dest + '/css',
        watch: paths.src + '/assets/styles/**/*.scss',
        content: paths.dest + '/**/*.html'
    },
    js: {
        src: paths.src + '/assets/js/**/*.js',
        dest: paths.dest + '/js',
        watch: paths.src + '/assets/js/**/*.js'
    },
    static: {
        src: paths.src + '/static/**/*',
        dest: paths.dest,
        base: 'static',
        watch: paths.src + '/static/**/*'
    },
    images: {
        src: paths.src + '/assets/images/**/*',
        dest: paths.dest + '/img',
        base: 'images',
        watch: paths.src + '/assets/images/**/*'
    },
    projects: {
        src: paths.src + '/views/project.pug',
        dest: paths.dest + '/projects',
        assets: paths.src + '/assets/projects'
    }
};

// Data
const prData = require('./' + globs.pug.local);

// Lint ES6 JavaScript with JSHint
gulp.task('lint', () => {
    return gulp.src(globs.js.src)
        .pipe(jshint({
            esversion: 6
        }))
        .pipe(jshint.reporter('default'));
});

// Compile, autoprefix, and minify Sass
gulp.task('sass', () => {
    return gulp.src(globs.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(mincss({compatibility:'ie8'}))
        .pipe(purgecss({
            content: [globs.sass.content]
        }))
        .pipe(rename((path) => {
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest(globs.sass.dest))
        .pipe(browserSync.stream());
});

// Copy static to public
gulp.task('static', () => {
    return gulp.src(globs.static.src)
        .pipe(gulp.dest(globs.static.dest))
});

// Minify JavaScript
gulp.task('minjs', () => {
    return gulp.src(globs.js.src)
        .pipe(babel())
        .pipe(minjs())
        .pipe(rename((path) => {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest(globs.js.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Compile Pug
gulp.task('pug', () => {
    return gulp.src(globs.pug.src)
        .pipe(data((file) => {
            return prData;
        })).pipe(pug())
        .pipe(gulp.dest(globs.pug.dest))
});

// Compile project pages
gulp.task('projects', () => {
    let tasks = [];
    let data = prData.prData;
    for (let key in data) {
        let proj = data[key];
        if (proj.template === 'project') {
            for (let k in proj.pages) {
                let page = proj.pages[k];
                let link = page.link;
                if (link !== '' && !link.startsWith('http')) {
                    let md = String(fs.readFileSync(globs.projects.assets + '/' + key + '/' + link + '.md'));
                    let html = converter.makeHtml(md);
                    tasks.push(
                        gulp.src(globs.projects.src)
                            .pipe(pug({
                                data: {prData: proj, content: html}
                            }))
                            .pipe(rename('index.html'))
                            .pipe(gulp.dest(globs.projects.dest + '/' + key + '/' + link))
                    );
                }
            }
        }
    }
    return ms(tasks);
});

// Minify images
gulp.task('minimg', () => {
    return gulp.src(globs.images.src)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})]))
        .pipe(gulp.dest(globs.images.dest));
});

gulp.task('clear', () => {
    return del([
        paths.dest + '/**',
        '!' + paths.dest
    ]);
});

// Watch Task
// gulp.task('watch', function() {
//     gulp.watch(pugFiles.watch, ['pug', reloadBrowserSyncPug]);
//     gulp.watch(scssFiles.watch, ['sass']);
//     gulp.watch(jsFiles.watch, ['js']);
//     gulp.watch(assetsFiles.watch, ['moveAssets', reloadBrowserSyncPug]);
// });

function browserSyncServe(done) {
    browserSync.init({
        ghostMode: true,
        notify: false,
        server: {
            baseDir: paths.dest
        },
        open: true
    });
    done();
}

gulp.task('watch', () => {
    gulp.watch(globs.pug.watch, ['pug']);
    gulp.watch(globs.sass.watch, ['sass']);
    gulp.watch(globs.js.watch, ['minjs']);
    gulp.watch(globs.static.watch, ['static']);
});

gulp.task('default', gulp.series('clear', 'pug', 'projects', 'sass', 'static', 'minjs', 'minimg'));
gulp.task('build', gulp.series('default'));
gulp.task('serve', gulp.series('default', 'watch'));