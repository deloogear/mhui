/**
 * 组件安装
 *  npm install gulp-util gulp-imagemin  gulp-clean-css  gulp-uglify gulp-rename gulp-concat gulp-clean  gulp-replace gulp-template gulp-inject gulp-rev gulp-rev-collector gulp-minify-html
 *  gulp-util
 *  gulp-imagemin
 *  gulp-ruby-sass //sass
 *  gulp-clean-css
 *  gulp-jshint   //
 *  gulp-uglify
 *  gulp-rename
 *  gulp-concat
 *  gulp-clean
 *  tiny-lr
 *  gulp-webserver
 *  gulp-template
 *  gulp-inject
 *  gulp-usemin // 替换为min版本  ,  目前不用
 *  gulp-rev
 *  minifyHtml = require('gulp-minify-html'),
 */

// 引入 gulp及组件
var gulp = require('gulp'),                              //基础库
    imagemin = require('gulp-imagemin'),                    //图片压缩
    /* sass = require('gulp-ruby-sass'),                    //sass*/
    minifycss = require('gulp-clean-css'),                  //css压缩
    /* jshint = require('gulp-jshint'),                     //js检查*/
    uglify = require('gulp-uglify'),                       //js压缩
    rename = require('gulp-rename'),                        //重命名
    concat = require('gulp-concat'),                       //合并文件
    clean = require('gulp-clean'),                          //清空文件夹
    inject = require('gulp-inject'),                          //gulp-inject 读取文件合并
    template = require('gulp-template'),                    //template  模板引擎
    htmlmin = require('gulp-htmlmin'),                      //html压缩
    replace = require("gulp-replace");                      //replace 文本替换
/*    rev = require('gulp-rev'),                              //文件版本改名
    revCollector = require('gulp-rev-collector'),           //文件版本修改引用
    minifyHtml = require('gulp-minify-html');               //压缩html*/


require('events').EventEmitter.defaultMaxListeners = Infinity;

var basePath = "../src/",
    cdn = "../",
    injects_html = [
        {
            src: "./view/base/base.html",
            tag: "<!-- inject:base:{{ext}} -->"
        },
        {
            src: "./view/base/footer.html",
            tag: "<!-- inject:footer:{{ext}} -->"
        },
        {
            src: "./view/base/header.html",
            tag: "<!-- inject:header:{{ext}} -->"
        },
        {
            src: "./view/base/common.html",
            tag: "<!-- inject:common:{{ext}} -->"
        }
    ];

//发布
gulp.task('default', ['html', 'css', 'images', 'js', 'font', 'file']);
//转移
gulp.task('dist', function () {
    var files = ['./dist/*'],
        file_dist = './../publish/live.app.web/';
    gulp.src(files)
        .pipe(gulp.dest(file_dist));
});

// HTML处理 -dist
gulp.task('html', function () {
    var htmlSrc = './view/**/*.html',
        htmlDst = './dist/view/',
        datas = new Date(),
        v_num = datas.getTime();
    var stream = gulp.src(htmlSrc);
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    for (var i in injects_html) {
        var file = injects_html[i];
        stream.pipe(
            inject(gulp.src(file.src),
                {
                    starttag: file.tag,
                    removeTags: true,
                    transform: function (filePath, file) {
                        return file.contents.toString('utf8')
                    }
                })
        );
    }
    stream.pipe(replace('href="' + basePath, 'href="' + cdn))/*替换资源CDN地址*/
        .pipe(replace('src="' + basePath, 'src="' + cdn))
        .pipe(replace(/<[^>]+(?:src|href)=\s*["']?([^"]+\.(?:js|css|png|jpg|gif))/g, function (obj) {
            obj += "?v=" + v_num;
            return obj;
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(htmlDst));
});

// HTML处理 -debug
gulp.task('html-local', function () {
    var htmlSrc = ['./view/**/*.html', '!./view/base/*'],
        htmlDst = './view/';

    var stream = gulp.src(htmlSrc);
    for (var i in injects_html) {
        var file = injects_html[i];
        stream.pipe(
            inject(gulp.src(file.src),
                {
                    starttag: file.tag,
                    transform: function (filePath, file) {
                        return file.contents.toString('utf8')
                    }
                })
        );
    }
    stream.pipe(gulp.dest(htmlDst));
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './src/css/**/*',
        cssDst = './dist/css';
    gulp.src(cssSrc)
        /*       .pipe(sass({ style: 'expanded'}))  sass编译
         .pipe(gulp.dest(cssDst))*/
        /*.pipe(rename({ suffix: '.min' }))*/ //发布不使用min 后缀
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function () {
    var imgSrc = './src/img/**/*.{jpg,png,gif,jpeg}',
        imgDst = './dist/img';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// js处理
gulp.task('js', function () {
    var jsSrc = ['./src/js/**/*.js'],
        jsDst = './dist/js';

    gulp.src(jsSrc)
        /*.pipe(jshint('.jshintrc'))
         .pipe(jshint.reporter('default'))*/ //脚本检查
        /*.pipe(concat('main.js'))   //脚本合并
         .pipe(gulp.dest(jsDst))*/
        /*.pipe(rename({ suffix: '.min' }))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsDst));
});

// 字体文件
gulp.task('font', function () {
    var font = ['./src/font/*'],
        fontdst = './dist/font';
    gulp.src(font)
        .pipe(gulp.dest(fontdst));
});

// file
gulp.task('file', function () {
    var files = ['./src/file/**/*'],
        file_dist = './dist/file';
    gulp.src(files)
        .pipe(gulp.dest(file_dist));
});

// 清空图片、样式、js
gulp.task('clean', function () {
    gulp.src(['./dist/css', './dist/js', './dist/img/'], { read: false })
        .pipe(clean());
});
