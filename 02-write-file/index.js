const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream((path.resolve(__dirname, './text.txt')), 'utf-8');

stdout.write('Enter some text:\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        stdout.write('The end!');
        exit();
    }
    output.write(data);
});
process.on('SIGINT', () => {
    stdout.write('The end!');
    exit();
});