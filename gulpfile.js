'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')();

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

gulp.task('styles', function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe($.sass({errLogToConsole: true}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({stream:true}))
        //.pipe($.notify("Compilation complete."))
        ;
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe($.sass({errLogToConsole: true}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({stream:true}))
        .pipe($.notify("Compilation complete."));
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();
    gulp.watch('app/sass/**/*.scss', ['styles']);
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/sass/**/*.scss',
        'app/sass/**/*.sass',
        'app/scripts/**/*.js'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

});

