const path = require('path');
const {WaldoSearch} = require('../dist');

new WaldoSearch({
  path: path.resolve(__dirname + '/../'),
  matchesAnyOf: ['\\.js$', '\\.html$', '\\.css$'],
  matchesNoneOf: ['/\.git/', '/node_modules/', '/\.idea/']
})
  .search(function (err, results) {
    
    if (err) {
      throw err;
    }
    
    console.log('results:', results);
    
  });
