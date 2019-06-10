const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, './build'),
  devServer: {
    host: '0.0.0.0',
    allowedHosts: [
      'www.intelrug.ru',
    ],
  },
};
