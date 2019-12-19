const { src, dest, watch, series, parallel } = require('gulp');
const projectSrc = 'build/';
const projectDest = '../server/public/';

const copyTStoBackend = function(cb) {
  return src(`${projectSrc}**/*.*`)
    .pipe(dest(projectDest));

};

// const watchFiles = function(cb) {
//   console.log('Watching files. Hit ^C to stop.');
//   watch(`${projectSrc}*`, {delay: 200}, copyTStoBackend);
// };

exports.default = copyTStoBackend;
exports.build = copyTStoBackend;