const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const filesDirPath = path.resolve(__dirname, './files');
const filesCopyDirPath = path.resolve(__dirname, './files-copy');

fsPromises.mkdir(filesCopyDirPath, { recursive: true });

fs.readdir(filesDirPath, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            fsPromises.copyFile(path.resolve(filesDirPath, file), path.resolve(filesCopyDirPath, file));
        });
    }
});