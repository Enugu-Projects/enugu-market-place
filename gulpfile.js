const gulp = require("gulp");
const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const runSequence = require("run-sequence");
const browserSync = require('browser-sync').create();

// process html files in the root folder
gulp.task("processingHTML", () => {
  gulp.src("*.html").pipe(gulp.dest("dist"));
});

// process html files in the admin root folder
gulp.task("processingAdmin", () => {
  gulp.src("admin/*.html").pipe(gulp.dest("dist/admin"));
});

// process html files in the users folder
gulp.task("processingUsersHTML", () => {
  gulp.src("users/*.html").pipe(gulp.dest("dist/users"));
});

// process html files in the adminHTML folder
gulp.task("processingAdminHTML", () => {
  gulp.src("admin/adminHTML/*.html").pipe(gulp.dest("dist/admin/adminHTML"));
});

// process SASS files 
gulp.task("processingSASS", () => {
  gulp.src("SASS/*.scss")
  .pipe(sass({
    errorLogToConsole: true,
    outputStyle: "compressed"
  }))
  .on("error", console.error.bind(console))
  .pipe(rename( {suffix: ".min"}))
  .pipe(gulp.dest("dist/css"))
});

// process Admin SASS files
gulp.task("processingAdminSASS", () => {
  gulp.src("admin/adminSASS/*.scss")
  .pipe(sass({
    errorLogToConsole: true,
    outputStyle: 'compressed'
  }))
  .on("error", console.error.bind(console))
  .pipe(rename( {suffix: ".min"}))
  .pipe(gulp.dest("dist/admin/adminCSS"))
});

// process script files in the scripts folder
gulp.task("processingJS", () => {
  gulp
    .src("scripts/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(rename( {suffix: ".min"}))
    .pipe(gulp.dest("dist/scripts"));
});

// process admin script files in the adminscripts folder
gulp.task("processingAdminJS", () => {
  gulp
    .src("admin/adminScripts/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(rename( {suffix: ".min"}))
    .pipe(gulp.dest("dist/admin/adminScripts"))
});

// setup babel-polyfill to enable async request in browser
gulp.task("babelPolyfill", () => {
  gulp
    .src("node_modules/babel-polyfill/browser.js")
    .pipe(gulp.dest("dist/node_modules/babel-polyfill"));
});

// load in browser
gulp.task('browserSync', () => {
  browserSync.init({
    server: './dist',
    port: 8080,
    ui: {
      port: 8081
    }
  });
});

// watch files for changes 
gulp.task('watch', ['browserSync'], () => {
  gulp.watch('scripts/*.js', ['processingJS']);
  gulp.watch('admin/adminScripts/*.js', ['processingAdminJS']);

  gulp.watch('SASS/*.scss', ['processingSASS']);
  gulp.watch('admin/adminSASS/*.scss', ['processingAdminSASS']);

  gulp.watch('*.html', ['processingHTML']);
  gulp.watch('admin/*.html', ['processingAdmin']);
  gulp.watch('users/*.html', ['processingUsersHTML']);
  gulp.watch('admin/adminHTML/*.html', ['processingAdminHTML']);

  gulp.watch("dist/scripts/*.js", browserSync.reload);
  gulp.watch("dist/css/*.css", browserSync.reload);
  gulp.watch("dist/users/*.html", browserSync.reload);
  gulp.watch("dist/*.html", browserSync.reload);

  gulp.watch("dist/admin/*.html", browserSync.reload);
  gulp.watch("dist/admin/adminCSS/*.css", browserSync.reload);
  gulp.watch("dist/admin/adminScripts/*.js", browserSync.reload);
});

// run all task here
gulp.task("default", callback => {
  runSequence(
    ["processingHTML", "processingAdmin", "processingUsersHTML", "processingAdminHTML", "processingSASS", "processingAdminSASS","processingJS", "processingAdminJS", "babelPolyfill"], 'watch',
    callback
  );
});
