var unrarp = require('unrar-promise');
var unzip = require('unzip');
var fs = require('fs');


function extractall(fileName, next) {
    if (fileName.endsWith('.rar')) {
        unrarp.extractAll(fileName, './'+fileName.split('.rar')[0]).then(next());
    } else if (fileName.endsWith('.zip')) {
        fs.createReadStream(fileName).pipe(unzip.Extract({ path: './'+fileName.split('.zip')[0] })).on('finish', next);
    }
}

extractall("Starbucks_Cup_OBJ.rar", function () {
    console.log('haha');
});
