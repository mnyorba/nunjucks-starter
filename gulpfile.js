var gulp = require("gulp"),
    autoPrefixer = require("gulp-autoprefixer"),
    argv = require('minimist')(process.argv.slice(2)),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    sass = require("gulp-sass"),
    cleanCSS = require("gulp-clean-css"),
    csso = require('gulp-csso'),
    del = require("del");
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    beautify = require('gulp-beautify-code'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    purgecss = require('gulp-purgecss'),
    nunjucks = require( 'gulp-nunjucks' ) ,
    rendeNun = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    lineec = require('gulp-line-ending-corrector');


const destination = (argv.clean) ? 'demo/' : (argv.pub) ? 'dist/' : 'dev/';
const port = (argv.demo) ? 4002 : (argv.pub) ? 4003 : 4001;

var sourcemap = (argv.demo) ? false : (argv.pub) ? true : true;
var minImg = (argv.demo) ? false : (argv.pub) ? true : false;
// All Path
const path = {
    root:'./',
    html: './app/*.+(html|njk)',
    _partialFiles: './app/templates/**/*.+(htm|njk)',
    _partial: './app/templates/',
    php: './app/php/**/*.php',
    fonts: './app/fonts/**/*.*',
    js: './app/js/*.*',
    scss: './app/scss/**/*.scss',
    img: './app/image/**/*.+(png|jpg|gif|ico|svg)',
    data:'./app/data/data.json',
    assets: './app/assets/**/*.*',
    plugin :{
        js: './app/plugin/js/*.js',
        css: './app/plugin/css/*.css'
    }
};
const dest = {
    css : destination + 'css/',
    scss : destination + 'scss/',
    js : destination + 'js/',
    fonts : destination + 'fonts/',
    php : destination + 'php/',
    img : destination + 'image/',
    assets : destination + 'assets/',
}
const watchSrc = [path.html, path.js, path.php, path.img, path.fonts, path.plugin.css,path.plugin.css,path.plugin,path.data];
/* =====================================================
    Hints:
===================================================== */
// Plugin function and variable used for concatning 
// Plugins function and variable used for copying Plugins folder
// scss function is for compiling scss to css
// sass function is for copying scss folder to destination


/* =====================================================
   BrowserSync
===================================================== */
function browserReload(done) {
    browserSync.init({
      server: {
        baseDir: destination
      },
      port: port
    });
    done();
  }
  



/* =====================================================
    CLEAN
===================================================== */
function clean() {
    return del([destination]);
}


/*--------------------------------------
    Gulp Custom Notifier
----------------------------------------*/
function customPlumber([errTitle]) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
            sound: "Glass"
        })
    });
}


/* =====================================================
    HTML
===================================================== */
    function html () {
        delete require.cache[require.resolve(path.data)]
        return gulp.src([path.html])
        .pipe(data(function() {
                    return require(path.data)
                }))
        .pipe(rendeNun({
                    path: [path._partial] // String or Array
                }))
        .pipe(customPlumber('Error Running Nunjucks'))
        .pipe(beautify({
                    indent_size: 2,
                    indent_char: ' ',
                    max_preserve_newlines: 0,
                    unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
                }))
        .pipe(gulp.dest(destination))
        .pipe(browserSync.reload({
            stream: true
        }));
    };

/* =====================================================
    css
===================================================== */
    function scss() {
        return gulp.src([path.scss])
            // .pipe(customPlumber('Error Running Sass'))
            // sourcemaps for Development
            .pipe(gulpif(sourcemap, sourcemaps.init()))
            .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
            .pipe(autoPrefixer())
            .pipe(gulpif(argv.demo, csso({
                restructure: false,
                sourceMap: true,
                debug: true
            })))
            .pipe(gulpif(sourcemap, sourcemaps.write('./maps/')))
            .pipe(lineec())
            .pipe(gulp.dest(dest.css))
            .pipe(browserSync.reload({
                stream: true
            }));
    };


/* =====================================================
    Concat Plugins Css
===================================================== */
var separator = '\n/*====================================*/\n\n';
function pluginCss() {
    return gulp.src(path.plugin.css)
        .pipe(changed(dest.css))
        .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
        .pipe(concat('assets.css', {newLine: separator}))
        .pipe(beautify())
        .pipe(gulp.dest(dest.css))
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulpif(sourcemap, sourcemaps.write('./maps/')))
        .pipe(lineec())
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.reload({
            stream: true
        }));
}


/* =====================================================
    Concat Plugins js
===================================================== */
var separator = '\n/*====================================*/\n\n';
function pluginJs() {
    return gulp.src(path.plugin.js)
        .pipe(changed(dest.js))
        .pipe(concat('assets.js', {newLine: separator}))
        .pipe(beautify())
        .pipe(gulp.dest(dest.js))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(lineec())
        .pipe(gulp.dest(dest.js))
        .pipe(browserSync.reload({
            stream: true
        }));
}
/* =====================================================
    Copy SCSS Folder
===================================================== */
function sassCopy() {
    return gulp.src([path.scss])
        .pipe(gulpif(argv.pub, gulp.dest(dest.scss)))
};

/* =====================================================
    Image
===================================================== */
function imgmin(){
    return gulp.src([path.img])
        .pipe(changed(dest.img))
        .pipe(gulpif(minImg, imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ])))
        .pipe(gulp.dest(dest.img))
        .pipe(browserSync.reload({
            stream: true
        }));
}
/* =====================================================
    Javascript
===================================================== */
function javascript() {
    return gulp.src([path.js])
        .pipe(changed(dest.js))
        .pipe(beautify())
        .pipe(lineec())
        .pipe(gulp.dest(dest.js));
}

/* =====================================================
    fonts
===================================================== */
function fonts() {
    return gulp.src([path.fonts])
    .pipe(changed(dest.fonts))
        .pipe(gulp.dest(dest.fonts));
}


/* =====================================================
    Plugin Folder Copy
===================================================== */
function assets() {
    return gulp.src([path.assets])
    .pipe(changed(dest.assets))
        .pipe(gulp.dest(dest.assets));
}


/* =====================================================
    php
===================================================== */
function php() {
    return gulp.src(path.php)
    .pipe(gulp.dest(destination + 'php/'));
}



function watchFiles() {
    gulp.watch(path.html, html);
    gulp.watch(path._partial, html);
    gulp.watch(path.data, html);
    gulp.watch(path.img, imgmin);
    gulp.watch(path.fonts, fonts);
    gulp.watch(path.js, javascript);
    gulp.watch(path.assets, assets);
    gulp.watch(path.plugin.js, pluginJs);
    gulp.watch(path.plugin.css, pluginCss);
    gulp.watch(path.scss, scss);
    gulp.watch(path.scss, sassCopy);
    gulp.watch(path.php, php);
    gulp.watch(path.root, gulp.series(clean, build));
    // gulp.watch(watchSrc).on('change', reload);
  }
// Builds
    // const compile = gulp.series(html,scss);
    // const concatFiles = gulp.series(pluginCss,pluginJs);
    // const copy = gulp.series(fonts,php,assets,javascript,sass,imgmin);

    // const build = gulp.series(clean,compile,concatFiles, gulp.parallel(copy));
    // const watch = gulp.parallel(watchFiles, browserSync);
    // const buildWatch = gulp.series(build, gulp.parallel(watch));


    const build = gulp.series(clean, html, gulp.parallel(scss, fonts, php, javascript, sassCopy, assets, pluginCss, pluginJs, imgmin));
    const buildWatch = gulp.series(build,browserReload, gulp.parallel(watchFiles));


exports.html = html;
exports.imgmin = imgmin;
exports.browserReload =  browserReload;
exports.javascript = javascript;
exports.assets = assets;
exports.pluginJs = pluginJs;
exports.pluginCss = pluginCss;
exports.scss = scss;
exports.sassCopy = sassCopy;
exports.php = php;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.buildWatch = buildWatch;
exports.watchFiles =  watchFiles;
exports.watchSrc = watchSrc;
exports.default = buildWatch;
