var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');

/** Tarea para compilar archivos sass **/
gulp.task('sass', function() {
    gulp.src('scss/app.scss')
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(sass({
            includedPaths: ['scss']
        }).on('error', sass.logError))
        .pipe(gulp.dest('app/css'));
});

/** Tarea para minificar css **/
gulp.task('minify-css', function() {
    return gulp.src('app/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/css/min'));
});

/** Tarea para minificar JS **/
gulp.task('compressJS', function() {
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('app/js/min'))
});

gulp.task('templates', function() {
    gulp.src('app/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('app'))
});

/** Tarea para crear un servidor local con gulp y de igual forma ve cambios que se realizan en css,js y html **/
gulp.task('serve', ['sass'], function() {
    browserSync.init(['app/css/*.css', 'app/js/*.js', 'app/css/min/*.css', 'app/js/min/*.js', 'app/*.jade', 'app/*.html'], {
        server: {
            baseDir: 'app'
        }
    });
});

/** Esta tarea nos permite estar vigilando cambios en los archivos sass, antes ejecuta las tareas de sass y serve **/
gulp.task('watch', ['compressJS', 'sass', 'minify-css', 'templates', 'serve'], function() {
    gulp.watch(['scss/*.scss'], ['sass']);
    gulp.watch(['app/*.jade'], ['templates']);
    gulp.watch(['app/js/*.js'], ['compressJS']);
    gulp.watch(['app/css/*.css'], ['minify-css']);
});

/** Este tarea nos permite que ejecutemos la tarea de watch usando en terminal solo el comando gulp **/
gulp.task('default', ['watch']);