"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var htmlmin = require("gulp-htmlmin");
var del = require("del");
var concat = require("gulp-concat");
var babel = require("gulp-babel");
var terser = require("gulp-terser");
var webp = require('gulp-webp');

gulp.task("html", function () {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("img", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 4}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"));
});

gulp.task("convert", function () {
  return gulp.src("source/img/*.{png,jpg}")
  .pipe(webp())
  .pipe(gulp.dest("source/img"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/*", gulp.series("script", "es5script", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("clean", function (){
  return del("build");
});

gulp.task("script", function() {
  return gulp.src(["source/js/*.js"])
    .pipe(concat("script.js"))
    .pipe(terser())
    .pipe(gulp.dest("build/js/"));
});

gulp.task("es5script", function() {
  return gulp.src(["node_modules/@babel/polyfill/dist/polyfill.js", "source/js/*.js"])
  .pipe(concat("script.es5.js"))
  .pipe(babel())
  .pipe(terser())
  .pipe(gulp.dest("build/js/"));
})

gulp.task("copy", function (){
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/*.*"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("images", gulp.series("img", "convert"))

gulp.task("build", gulp.series("clean", "copy", "css", "script", "es5script", "html"));

gulp.task("start", gulp.series("build", "server"));
