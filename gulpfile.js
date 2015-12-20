var gulp = require("gulp"),
    sass = require("gulp-sass"),
    notify = require("gulp-notify"),
    bower = require("gulp-bower");

var config = {
    sassPath: "./app/sass",
    bowerDir: "./app/bower_components",
    publicDir: "./public"
}

gulp.task("bower", function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task("icons", function() {
    return gulp.src(config.bowerDir + "/font-awesome/fonts/**.*")
        .pipe(gulp.dest(config.publicDir + "/fonts"));
});

gulp.task("css", function() {
    return gulp.src(config.sassPath + "/style.scss")
        .pipe(sass({
            style: "compressed",
            loadPath: [
                config.sassPath,
                config.bowerDir + "/bootstrap-sass/assets/stylesheets",
                config.bowerDir + "/font-awesome/scss"
            ]
        }).on("error", notify.onError(function(error){
            return "Error: "+error.message;
        })))
        .pipe(gulp.dest(config.publicDir + "/css"));
});

gulp.task("watch", function(){
    gulp.watch(config.sassPath + "/**/*.scss",["css"]);
});

gulp.task("default", ["bower", "icons", "css"]);
