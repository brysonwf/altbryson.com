"use strict";

const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const minify = require("gulp-minify");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const javascriptObfuscator = require("gulp-javascript-obfuscator");
const shell = require("gulp-shell");
const fs = require("fs");
const purgecss = require("gulp-purgecss");

const d = new Date();

gulp.task("version", function(cb) {
  fs.writeFile(
    "../altbryson/html_partials/version.hbs",
    "v" +
      d.getFullYear() +
      d.getMonth() +
      d.getDate() +
      d.getHours() +
      d.getMinutes() +
      d.getSeconds(),
    cb
  );
});

gulp.task("lib", function() {
  return (
    gulp
      .src("lib/**/*.js")
      // .pipe(sourcemaps.init())
      .pipe(concat("lib.js"))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(javascriptObfuscator())
      .pipe(gulp.dest("./www"))
  );
});

gulp.task("app", function() {
  return (
    gulp
      .src("js/**/*.js")
      // .pipe(sourcemaps.init())
      .pipe(concat("app.js"))
      // .pipe(uglify())
      // .pipe(sourcemaps.write())
      // .pipe(javascriptObfuscator())
      .pipe(gulp.dest("./www"))
  );
});

gulp.task("html", () => {
  return gulp
    .src("html_pages/*.hbs")
    .pipe(
      handlebars(
        {},
        {
          ignorePartials: true,
          batch: ["html_partials"]
        }
      )
    )
    .pipe(
      rename({
        extname: ".html"
      })
    )
    .pipe(gulp.dest("www"));
});

gulp.task("sass", function() {
  return (
    gulp
      .src("sass/**/*.scss")
      // .pipe(sourcemaps.init())
      .pipe(sass.sync().on("error", sass.logError))
      // .pipe(
      //   purgecss({
      //     content: ["./www/*.html"]
      //   })
      // )
      .pipe(cleanCSS({ compatibility: "ie8" }))
      .pipe(minify())
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest("./www"))
  );
});

gulp.task("firebase", shell.task(["firebase deploy"]));

gulp.task(
  "default",
  gulp.series("version", "lib", "app", "html", "sass", "firebase")
);
