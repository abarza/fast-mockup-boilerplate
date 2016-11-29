'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    notifier = require('node-notifier'),
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    path = require('path'),
    $ = require('gulp-load-plugins')();

var less_dir = 'app/less/';

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

// gulp "task" --view
var viewer = (gutil.env.view == true) ? 'index' : gutil.env.view;
var lessviewer = (gutil.env.lessview == true) ? 'main' : gutil.env.lessview;

gulp.task('default', function() {
  return gutil
  .log('Gulp is running!');
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

// SASS COMPILER

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

// LESS COMPILER

gulp.task('less', function () {
    return gulp.src(less_dir + '*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', function (error) {
            console.error(gutil.colors.white.bgGreen(error.message));
            notifier.notify({
                title: 'Less compilation error',
                message: error.message
            });
            this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: ['last 3 version']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({stream:true}))
        //.pipe(browserSync.stream({match: '**/*.css'}))
        ;
});

gulp.task('lessview', function () {
    return gulp.src(less_dir + lessviewer + '.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', function (error) {
            console.error(gutil.colors.white.bgGreen(error.message));
            notifier.notify({
                title: 'Less compilation error',
                message: error.message
            });
            this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: ['last 3 version']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({stream:true}))
        //.pipe(browserSync.stream({match: '**/*.css'}));
        ;
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
    gulp.watch(less_dir + '**/*', [gutil.env.lessview ? 'lessview' : 'less']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/sass/**/*.scss',
        'app/sass/**/*.sass',
        'app/less/**/*.less',
        'app/scripts/**/*.js'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

});

