const gulp = require('gulp'); // 引入gulp
const gulpUglify = require('gulp-uglify'); // 引入gulp-uglify插件
const mockServer = require('gulp-mock-server');//引入mock数据
const babel = require('gulp-babel');
const rename= require('gulp-rename');
const sass = require('gulp-sass');
const cleancss= require('gulp-cleancss');
//1. 合并多张图生成雪碧图
gulp.task('testSprite', function () {
    return gulp.src('images/*.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'sprite.png',//保存合并后图片的地址
            cssName: 'css/sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            algorithm: 'top-down',//Algorithm 有四个可选值分别为top-down、left-right、diagonal、alt-diagonal、binary-tree
            cssTemplate: function (data) {//生成css样式模板
                var arr=[];
                data.sprites.forEach(function (sprite) {
                    arr.push(".icon-"+sprite.name+
                        "{" +
                        "background-image: url('"+sprite.escaped_image+"');"+
                        "background-position: "+sprite.px.offset_x+"px "+sprite.px.offset_y+"px;"+
                        "width:"+sprite.px.width+";"+
                        "height:"+sprite.px.height+";"+
                        "}\n");
                });
                return arr.join("");
            }
        }))
        .pipe(gulp.dest('dist/sprite'));// 最终文件夹目录
});

//2. sass编译css
gulp.task('testSass',function() {
    gulp.src('sass/*.scss')//需要编译的文件
        .pipe(sass())//编译
        .pipe(cleancss())//压缩
        .pipe(gulp.dest('dist/css'));// 最终文件夹目录
});

//3.uglify 压缩js
gulp.task('testUglify',function() {
    gulp.src(['js/*.js','!js/*.min.js'])//需要压缩的文件，不包含.min压缩过的文件
    //.pipe(concat('main.js'))     //合并所有js到main.js
        .pipe(babel())//转译es6语法
        .pipe(rename({suffix: '.min'}))//压缩后的文件名 让main.js变成main.min.js
        .pipe(gulpUglify()) //执行 【注意：先上门的压缩设置最后再执行，顺序不能反】
        .pipe(gulp.dest('dist/js'));// 最终文件夹目录
});

//4.压缩sass编译后的css
gulp.task('testCleanCss',function() {
    gulp.src('dist/css/*.css')//需要压缩的文件
        .pipe(concat('main.css'))     //合并所有css到main.css
        .pipe(rename({suffix: '.min'}))//压缩后的文件名 让main.css变成main.min.css
        .pipe(cleancss()) //执行 【注意：先上门的压缩设置最后再执行，顺序不能反】
        .pipe(gulp.dest('dist/css'));// 最终文件夹目录
});

//执行删除的时候不要把目录定在build的子目录中，windows删除目录的同时会报错
gulp.task('clean', function(cb) {
    del(['build/css', 'dist/js'], cb)
});

//配置监听更改
gulp.task('testWatch', function () {
    gulp.watch('sass/*.scss', ['testSass']);// 监听的文件
    //gulp.watch('js/*.js', ['testUglify']);// 监听的文件
});
//使用mock数据
gulp.task('mock', function() {
    gulp.src('*')
        .pipe(mockServer({
            port: 8090,
            host:'172.19.110.19'
        }));
});

//定义默认的任务
//gulp.task('default',['testSprite']);
gulp.task('dist',['testSprite','testSass','testWatch']);
gulp.task('build',['clean','testUglify','testCleanCss']);


