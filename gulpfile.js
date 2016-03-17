/**
 * Created by lixiao on 16/1/29.
 */

var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    cleanCss = require("gulp-clean-css"),
    minifyHtml = require("gulp-minify-html"),
    concat = require("gulp-concat"),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    processhtml = require('gulp-processhtml'),
    clean = require('gulp-clean'),
    ignore = require('gulp-ignore'),
    findBowerMin = require('find-bower-min'),
    merge2 = require('merge2'),
    browserSync = require('browser-sync').create();

var findMinJs = findBowerMin('js','min.js',['jquery']);
var findMinCss = findBowerMin('(css|less)','min.css');

gulp.task('default', function(){ //异步回调
    gulp.start('minCss','styles', 'minJs','index');
});

/* ---------- 将所有css文件打包成min.css ---------- */
gulp.task('minCss', function() {
    return merge2(
        gulp.src(findMinCss.min),
        gulp.src(findMinCss.minNotFound)
            .pipe(ignore.include('*.css'))
            .pipe(cleanCss()),
        gulp.src("src/css/*.css").pipe(cleanCss())
    )
        .pipe(concat('highlight.min.css'))
        .pipe(gulp.dest('.'))
});

/* ---------- 拷贝style里面的样式 ---------- */
gulp.task('styles', function() {
    return gulp.src('src/styles/*.css')
        .pipe(cleanCss())
        .pipe(gulp.dest('styles'));
});

/* ---------- 将js文件打包成min.js ---------- */
gulp.task('minJs',function() {
    return merge2(
        gulp.src(findMinJs.min),
        gulp.src(findMinJs.minNotFound).pipe(uglify()),
        gulp.src('src/js/*.js').pipe(ngAnnotate()).pipe(uglify())
    )
        .pipe(concat('highlight.min.js'))
        .pipe(gulp.dest('.'))
});

/* ---------- 替换index.html里面的注释 ---------- */
gulp.task('index', function() {
    return gulp.src('src/index.html')
        .pipe(processhtml())
        //.pipe(minifyHtml())
        .pipe(gulp.dest('.'));
});

/* ---------- 启动sync服务器 ---------- */
gulp.task('sync', function() {
    var files = [
        'src/index.html',
        'src/css/*.css',
        'src/js/**/*.js'
    ];
    browserSync.init(files,{
        proxy: "http://localhost:63342/highlight/"
    });
});
