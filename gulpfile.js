const gulp = require('gulp');
const ts = require('gulp-typescript');
const pug = require('gulp-pug');
const gulpIf = require('gulp-if');
const fs = require('fs');

const tsProject = ts.createProject('tsconfig.json');

// Task to compile TypeScript files
gulp.task('compile-ts', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
});

// Task to copy Pug files
gulp.task('copy-pug', () => {
  return gulp.src('applications/**/*.pug')
    .pipe(gulp.dest('dist/applications'));
});

gulp.task('create-submissions-folder', (done) => {
  const folderPath = 'dist/applications/data/submissions';
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  done();
});

// Default task: compile TypeScript and copy Pug files
gulp.task('default', gulp.parallel('compile-ts', 'copy-pug', 'create-submissions-folder'));
