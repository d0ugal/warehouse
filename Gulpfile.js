var del = require("del"),
    gulp = require("gulp"),
    mainBowerFiles = require("main-bower-files"),
    minifyCSS = require("gulp-minify-css"),
    modernizr = require("gulp-modernizr"),
    path = require("path"),
    rename = require("gulp-rename"),
    revAll = require("gulp-rev-all"),
    runSequence = require("run-sequence"),
    sass = require("gulp-sass"),
    sassLint = require("gulp-sass-lint");


var srcPaths = {
  components: "warehouse/static/components",
  images: "warehouse/static/images/",
  js: "warehouse/static/js/",
  sass: "warehouse/static/sass/"
}

var dstPaths = {
  base: "warehouse/static/dist/",
  components: "warehouse/static/dist/components/",
  css: "warehouse/static/dist/css/",
  images: "warehouse/static/dist/images/",
  js: "warehouse/static/dist/js/"
}


gulp.task("lint:sass", function() {
  return gulp.src(path.join(srcPaths.sass, "**", "*.s+(a|c)ss"))
             .pipe(sassLint())
             .pipe(sassLint.format())
             .pipe(sassLint.failOnError())
});

gulp.task("lint", ["lint:sass"]);

gulp.task("dist:components", ["clean:components"], function() {
  return gulp.src(mainBowerFiles(), { base: srcPaths.components })
             .pipe(gulp.dest(dstPaths.components));
});

gulp.task("dist:css", ["clean:css"], function() {
  return gulp.src(path.join(srcPaths.sass, "*.scss"))
             .pipe(sass({ includePaths: [srcPaths.sass] }))
             .pipe(minifyCSS({ keepBreaks: true }))
             .pipe(gulp.dest(dstPaths.css));
});

gulp.task("dist:images", ["clean:images"], function() {
  return gulp.src(path.join(srcPaths.images, "**", "*"))
             .pipe(gulp.dest(dstPaths.images));
});

gulp.task("dist:js", ["clean:js"], function() {
  return gulp.src(path.join(srcPaths.js, "**", "*"))
             .pipe(gulp.dest(dstPaths.js));
});

gulp.task("dist:modernizr", function() {
  return gulp.src(path.join(dstPaths.js, "**", "*.js"))
             .pipe(modernizr())
             .pipe(gulp.dest(dstPaths.components));
});

gulp.task("dist:manifest", ["clean:manifest"], function() {
  var revision = new revAll({ fileNameManifest: "manifest.json" });

  return gulp.src(path.join(dstPaths.base, "**"))
             .pipe(revision.revision())
             .pipe(gulp.dest(dstPaths.base))
             .pipe(revision.manifestFile())
             .pipe(gulp.dest(dstPaths.base));
});

gulp.task("dist", function() {
    return runSequence(
      ["dist:components", "dist:css", "dist:images", "dist:js"],
      "dist:modernizr",
      "dist:manifest"
    );
});

gulp.task("clean:components", function() {
  return del([dstPaths.components])
});

gulp.task("clean:css", function() { return del([dstPaths.css]) });

gulp.task("clean:images", function() { return del([dstPaths.images]) });

gulp.task("clean:js", function() { return del([dstPaths.js]) });

gulp.task("clean:manifest", function() {
  return del([path.join(dstPaths.base, "manifest.json")]);
});

gulp.task("clean", [
  "clean:components",
  "clean:css",
  "clean:images",
  "clean:js",
  "clean:manifest"
]);

gulp.task("watch", function() {
    gulp.watch(path.join(srcPaths.sass, "*.scss"), ["default"]);
});

gulp.task("default", ["dist"]);
