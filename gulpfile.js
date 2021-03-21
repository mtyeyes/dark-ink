const gulp = require('gulp');
const mode = require('gulp-mode')();
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const webp = require('gulp-webp');

const isDevelopment = mode.development();
if (isDevelopment) {
  const message =
    'In development mode minification is disabled, to minify files run task with "--production" argument';
  const boxWidth =
    process.stdout.columns + 2 < message.length
      ? process.stdout.columns - 2
      : message.length - 2;
  console.warn(
    `\u2554${'\u2550'.repeat(
      boxWidth
    )}\u2557\n${message}\n\u255a${'\u2550'.repeat(boxWidth)}\u255d`
  );
}

const html = () => {
  return gulp
    .src('source/*.html')
    .pipe(mode.production(htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('build'));
};

exports.html = html;

const css = () => {
  return gulp
    .src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(mode.production(csso()))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
};

exports.css = css;

const img = () => {
  return gulp
    .src(['source/img/**/*.{png,jpg,svg}', '!source/img/gallery*uc.jpg}'])
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 4 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest('source/img'));
};

exports.img = img;

const convert = () => {
  return gulp
    .src([
      'source/img/*.{png,jpg}',
      '!source/img/gallery*uc.jpg}',
      '!source/img/*-bg*.{png,jpg}',
    ])
    .pipe(webp())
    .pipe(gulp.dest('source/img'));
};

exports.convert = convert;

const server = () => {
  browserSync.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
};

exports.server = server;

const watch = () => {
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch(
    'source/js/*',
    gulp.series('script', 'es5script', 'nonstrict', 'refresh')
  );
};

exports.watch = watch;

const refresh = (done) => {
  browserSync.reload();
  done();
};

exports.refresh = refresh;

const clean = () => {
  return del('build');
};

exports.clean = clean;

const script = () => {
  return gulp
    .src(['source/js/*.js'])
    .pipe(concat('script.js'))
    .pipe(mode.production(terser()))
    .pipe(gulp.dest('build/js/'));
};

exports.script = script;

const nonstrict = () => {
  return gulp
    .src(['source/js/non-strict/*.js'])
    .pipe(mode.production(terser()))
    .pipe(gulp.dest('build/js/'));
};

exports.nonstrict = nonstrict;

const es5script = () => {
  return gulp
    .src(['node_modules/@babel/polyfill/dist/polyfill.js', 'source/js/*.js'])
    .pipe(concat('script.es5.js'))
    .pipe(mode.production(babel()))
    .pipe(mode.production(terser()))
    .pipe(gulp.dest('build/js/'));
};

exports.es5script = es5script;

const copy = () => {
  return gulp
    .src(
      [
        'source/fonts/**/*.{woff,woff2}',
        'source/img/*.*',
        'source/*.*',
        '!source/*.html',
      ],
      {
        base: 'source',
      }
    )
    .pipe(gulp.dest('build'));
};

exports.copy = copy;

const images = gulp.series(img, convert);

exports.images = images;

const build = gulp.series(
  clean,
  gulp.parallel(html, copy, css, script, es5script, nonstrict)
);

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(html, copy, css, script, es5script, nonstrict),
  gulp.parallel(server, watch)
);
