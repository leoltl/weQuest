const { src, dest, watch, series, parallel } = require('gulp');
const projectSrc = 'build/';
const projectDest = '../server/build/public/';

const copyBuildtoBackend = function(cb) {
  return src(`${projectSrc}**/*.*`)
    .pipe(dest(projectDest));

};

function watchFiles(cb) {
  console.log('Watching files. Hit ^C to stop.');
  watch(`${projectSrc}**/*.*`, {delay: 200}, copyBuildtoBackend);
}

exports.default = copyBuildtoBackend;
exports.build = copyBuildtoBackend;
exports.watch = watchFiles;