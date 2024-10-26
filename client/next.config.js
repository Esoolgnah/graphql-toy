const path = require('path');

module.exports = {
  sassOptions: {
    includedPaths: [path.resolve(__dirname, './pages')],
  },
};
