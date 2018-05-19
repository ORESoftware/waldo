const {WaldoSearch} = require('../dist');

const s = new WaldoSearch({path: __dirname}).getReadableStream();

s.on('error', function(e){
  console.error(e);
});

s.pipe(process.stdout);
