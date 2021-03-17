'use strict'

// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const renamev = require('gulp-rename');
const rename = require('gulp-rename');

// File path variables
const file = {
    scssPath: 'src/assets/sass/style.scss',
    jsPath: 'src/assets/js/index.js'
}

// Sass task
function sassTask() {
    return src(file.scssPath)        
        .pipe(sass())
        .pipe(postcss([ cssnano() ]))
        .pipe(rename({suffix: '.min'}))
        .pipe(dest('dist'));
}

// JS task
function jsTask() {
    return src(['src/assets/js/lib/require.js', file.jsPath])
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(dest('dist'));
}

// Cachebusting task
const cbString = new Date().getTime();

function cacheBustTask() {
    return src('dist/index.html')
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('dist'));
}

// Watch task
function watchTask() {
    watch(['src/assets/sass/**/*.scss', 'src/assets/js/**/*.js'], 
        parallel(sassTask, jsTask)
    );
}

// Default task
exports.default = series(
    parallel(sassTask, jsTask),
    cacheBustTask,
    watchTask
);
