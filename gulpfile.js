// gulpfile.js
import gulp from "gulp";
const { src, dest, series, parallel, watch } = gulp;

import { create as bsCreate } from "browser-sync";
const browserSync = bsCreate();

import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";

import * as dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

import terser from "gulp-terser";
import concat from "gulp-concat";
import babel from "gulp-babel";

import imagemin from "gulp-imagemin";
import jsonMinify from "gulp-jsonminify";
import htmlmin from "gulp-htmlmin";

import { deleteAsync } from "del";
import { preload } from "./gulp-preload.js";
import { generate } from "./gulp-generate.js";

import fs from "fs";
const globModule = await import("glob");
const globSync =
  globModule.globSync ||
  globModule.default?.globSync ||
  globModule.default?.sync;

import * as dotenv from "dotenv";
dotenv.config();

// --------------------------
// UTILS
// --------------------------
export function clean() {
  return deleteAsync(["dist"]);
}

export const preloadTask = series(preload, function (done) {
  browserSync.reload();
  done();
});

export function make(done) {
  generate(done);
}

// --------------------------
// COPY TASKS
// --------------------------
function copyByPatterns(patterns) {
  const files = patterns
    .flatMap((p) => globSync(p))
    .filter((f) => fs.existsSync(f));

  if (!files.length) {
    console.warn("⚠️ No files found for copy task");
    return Promise.resolve();
  }
  return src(files, { base: "./" }).pipe(dest("dist"));
}

export function moveFile() {
  return copyByPatterns([
    "js/scripts.js",
    "js/library.js",
    "js/templates.js",
    "js/controller/popup.js",
    "data/**/*.vtt",
  ]);
}

export function moveFolder() {
  return copyByPatterns([
    "css/**/*",
    "sound/**/*",
    "sounds/**/*",
    "video/**/*",
    "videos/**/*",
    "pdf/**/*",
    "gif/**/*",
    "gifs/**/*",
    "templates/popups/**/*",
  ]);
}

// --------------------------
// SCSS
// --------------------------
export function scssDev() {
  return src("scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(sourcemaps.write("."))
    .pipe(dest("css"))
    .pipe(browserSync.stream());
}

export function scssProd() {
  return src("scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(dest("dist/css"));
}

// --------------------------
// JS
// --------------------------
function jsPipeline(files, outFile, outDir = "js", reload = false) {
  let stream = src(files)
    .pipe(babel({ presets: [["@babel/preset-env", { modules: false }]] }))
    .pipe(terser());

  if (outFile) stream = stream.pipe(concat(outFile));

  stream = stream.pipe(dest(outDir));
  if (reload) stream = stream.on("end", browserSync.reload);

  return stream;
}

export function jsController() {
  return jsPipeline("js/controller/*.js", "scripts.js", "js", true);
}

export function jsLibrary() {
  const files = [
    "js/libs/jquery.min.js",
    "js/libs/jquery-ui.min.js",
    "js/libs/jquery.ui.touch-punch.min.js",
    "js/libs/jquery.mousewheel.min.js",
    "js/libs/gsap.min.js",
    "js/libs/tweenmax.min.js",
    "js/libs/scroll-magic.min.js",
    "js/libs/animation.gsap.min.js",
    "js/libs/debug.addIndicators.min.js",
  ].filter((f) => fs.existsSync(f));

  if (!files.length) {
    console.warn("⚠️ No library files found");
    return Promise.resolve();
  }
  return jsPipeline(files, "library.js", "js", true);
}

export function jsTemplates() {
  const files = globSync("js/templates/*.js");
  if (!files.length) {
    console.warn("⚠️ No template files found");
    return Promise.resolve();
  }
  return jsPipeline(files, "templates.js", "js", true);
}

export function jsPages() {
  const files = globSync("js/pages/*.js");
  if (!files.length) {
    console.warn("⚠️ No page files found");
    return Promise.resolve();
  }
  return jsPipeline(files, null, "dist/js/pages", true);
}

// --------------------------
// HTML / JSON / IMAGE
// --------------------------
export function minifyHtml() {
  const files = [...globSync("templates/*.html"), "index.html"].filter((f) =>
    fs.existsSync(f),
  );
  if (!files.length) {
    console.warn("⚠️ No HTML files found");
    return Promise.resolve();
  }

  return src(files, { base: "./" })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

export function minifyJson() {
  const files = globSync("data/**/*.json");
  if (!files.length) {
    console.warn("⚠️ No JSON files found");
    return Promise.resolve();
  }

  return src(files, { base: "./" }).pipe(jsonMinify()).pipe(dest("dist"));
}

export function minifyImage() {
  const files = globSync("images/**/*");
  if (!files.length) {
    console.warn("⚠️ No image files found");
    return Promise.resolve();
  }

  return src(files, { base: "./" }).pipe(imagemin()).pipe(dest("dist"));
}

// --------------------------
// SERVER / WATCH
// --------------------------
export function serve() {
  browserSync.init({
    server: { baseDir: "./" },
    notify: false,
  });

  watch("scss/**/*.scss", scssDev);
  watch("js/controller/*.js", jsController);
  watch("js/libs/*.js", jsLibrary);
  watch("js/templates/*.js", jsTemplates);
  watch("images/**/*", preloadTask);
  watch(
    ["*.html", "templates/**/*.html", "js/pages/*.js", "data/**/*.json"],
    browserSync.reload,
  );

  watch(["*.html", "templates/**/*.html"]).on("change", browserSync.reload);
  watch("js/pages/*.js").on("change", browserSync.reload);
  watch("data/**/*.json").on("change", browserSync.reload);
}

// --------------------------
// CORE
// --------------------------
export const dev = series(
  clean,
  parallel(scssDev, jsLibrary, jsTemplates, jsController),
  serve,
);

export function cleanUnwantedFiles() {
  return deleteAsync(["dist/css/global.css", "dist/css/**/*.map"]);
}

export const build = series(
  clean,
  parallel(
    scssProd,
    jsController,
    jsLibrary,
    jsTemplates,
    jsPages,
    minifyHtml,
    minifyJson,
    minifyImage,
  ),
  parallel(moveFile, moveFolder),
  cleanUnwantedFiles,
);

export default dev;
