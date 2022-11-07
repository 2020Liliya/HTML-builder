const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const stylesPath = path.resolve(__dirname, './styles');
const distPath = path.join(__dirname, './project-dist');
fsPromises.mkdir(distPath, { recursive: true });
const cssDistPath = path.join(distPath, './style.css');

const assetsPath = path.resolve(__dirname, './assets');
const assetsDistPath = path.resolve(distPath, './assets');

const componentsPath = path.resolve(__dirname, './components');
const index = path.join(distPath, './index.html');


// создать файл css в dist
let arrStyles = [];
fs.readdir(stylesPath,
    { withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    arrStyles.push(file.name);
                }
            });
        }

        fsPromises.writeFile(cssDistPath, "");

        for (let style of arrStyles) {
            fs.readFile(path.resolve(stylesPath, style), "utf-8", (error, fileContent) => {
                fileContent = fileContent + '\n';
                fsPromises.appendFile(cssDistPath, fileContent);
            })
        }
    })


// скопировать папку assets в dist
async function copyDir(input, output) {
    await fsPromises.mkdir(output, { recursive: true });
    let entries = await fsPromises.readdir(input, { withFileTypes: true });

    for (let entry of entries) {
        let inputPath = path.join(input, entry.name);
        let outputPath = path.join(output, entry.name);

        if (entry.isDirectory()) {
            await copyDir(inputPath, outputPath);
        } else {
            await fsPromises.copyFile(inputPath, outputPath);
        }
    }
}
copyDir(assetsPath, assetsDistPath);


// массив компонентов
let arrComponents = [];
fs.readdir(componentsPath,
    { withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile() && path.extname(file.name) === '.html') {
                    arrComponents.push(file.name);
                }
            });
        }
    });

// заменить шаблонные теги
fs.readFile(path.resolve(__dirname, './template.html'), "utf-8", (error, fileContent) => {
    if (error) {
        console.log('No such file exists');
    }

    let indexContent = fileContent;

    for (let component of arrComponents) {
        fs.readFile(path.resolve(componentsPath, component), 'utf8', (errComponent, fileContentComponent) => {
            if (errComponent) throw errComponent;
            let componentName = `\{\{${component.replace('.html', '')}\}\}`;
            indexContent = indexContent.replace(componentName, fileContentComponent);
            
            fsPromises.writeFile(index, "");

            fs.writeFile(index, indexContent, function (error) {
                if (error) throw error;
                console.log(componentName, 'Success!');
            });
        });
    }
});