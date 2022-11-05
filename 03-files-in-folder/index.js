const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const secretPath = path.resolve(__dirname, './secret-folder');

fs.readdir(secretPath,
    { withFileTypes: true },
    (err, files) => {
        console.log("\nSecret-folder files:");
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile()) {
                    const filePath = path.join(secretPath, file.name);
                    fsPromises.stat(filePath).then(el => {
                        console.log(path.parse(file.name).name, '–', path.extname(file.name).slice(1), '–', `${el.size} bytes`);
                    });
                }
            });
        }
    })