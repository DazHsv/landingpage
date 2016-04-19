var gulp = require("gulp"),
	jade = require("gulp-jade"),
	sass = require("gulp-sass"),
	jshint = require("gulp-jshint"),
	sourcemaps = require("gulp-sourcemaps"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	browserSync = require("browser-sync").create(),
	image = require('gulp-image'),
	prefix = require("gulp-autoprefixer");

gulp.task('jade', function(){
	return gulp.src('src/*.jade')
		.pipe(jade({
			pretty:false
		}))
		.pipe(gulp.dest("./"))
		.pipe(browserSync.stream());
});

gulp.task('sass',function(){
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(prefix({
			browsers:['last 2 versions', '> 5%', 'ie 8']
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
});

gulp.task('jshint',function(){
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minifyjs',['jshint'],function(){
	return gulp.src('./src/js/**.js')
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
});

gulp.task('optimizeimg',function(){
	return gulp.src('./src/img/*')
		.pipe(image())
		.pipe(gulp.dest('./build/img'));
});

gulp.task('serve',['sass','jshint','minifyjs','jade','optimizeimg'],function(){
	browserSync.init({
		server:"./"
	});
	
	gulp.watch("src/**/*.jade",['jade']);
	gulp.watch("src/sass/**/*.scss",['sass']);
	gulp.watch("src/js/**/*.js",['minifyjs']);
	gulp.watch("src/img/*"['optimizeimg']);
});


gulp.task('default',['serve']);
gulp.task('compile',['jade','sass','minifyjs','optimizeimg']);