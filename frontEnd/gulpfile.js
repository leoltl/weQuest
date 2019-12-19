const { src, dest, watch, series, parallel } = require('gulp');
const projectSrc = 'build/';
const projectDest = '../server/build/public/';

const copyBuildtoBackend = function(cb) {
  return src(`${projectSrc}**/*.*`)
    .pipe(dest(projectDest));

};

exports.default = copyBuildtoBackend;
exports.build = copyBuildtoBackend;