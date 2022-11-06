const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const stylesDirPath = path.resolve(__dirname, './styles');
const distDirPath = path.resolve(__dirname, './project-dist');
const bundlePath = path.join(distDirPath, './bundle.css');
let arr = [];

fs.readdir(stylesDirPath,
    { withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    arr.push(file.name);
                }
            });
        }

        fsPromises.writeFile(bundlePath, "");

        for (let style of arr) {
            const input = fs.createReadStream(path.resolve(stylesDirPath, style), "utf-8");
            fsPromises.appendFile(bundlePath, input);
        }
    })
