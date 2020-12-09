const chalk = require('chalk');
const path = require('path');

function successConsole(message) {
    consoleFn('green', '✨ ' + message);
}

function errorConsole(message) {
    consoleFn('red', '✨ ' + message);
}

function warnConsole(message) {
    consoleFn('yellow', '✨ ' + message);
}

function getCwdPath(...dir) {
    return path.resolve(process.cwd(), ...dir);
}

function consoleFn(color, message) {
    console.log(
        chalk.blue.bold('****************  ') +
        chalk[color].bold(message) +
        chalk.blue.bold('  ****************')
    );
}

module.exports = {
    successConsole,
    errorConsole
}