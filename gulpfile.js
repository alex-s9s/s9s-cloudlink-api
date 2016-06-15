const gulp = require('gulp');
// const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const esdoc = require('gulp-esdoc');

gulp
    .task('eslint', () => {
        return gulp
            .src('src/**/*.js')
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    })
    // .task('mocha', () => {
    //     return gulp
    //         .src('test/**/*.js', {read: false})
    //         .pipe(mocha())
    // })
    .task('esdoc', () => {
        return gulp
            .src('./src')
            .pipe(
                esdoc({
                    destination: './docs'
                })
            );
    })
    .task('babel', () => {
        return gulp
            .src('src/**/*.js')
            .pipe(babel({
                presets: [
                    'es2015'
                ]
            }))
            .pipe(gulp.dest('dist'));
    })
    .task('default', [
        'eslint',
        'babel',
        'esdoc'
    ]);