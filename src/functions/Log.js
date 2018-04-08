const chalk = require('chalk');
class log {
	static logger(text, type = 'Logger') {
		switch (type) {
			case 'warn': {
				return console.log(chalk.hex('#d89e2b')('[WARN] ') + chalk.hex('#2bd831')(text)); // eslint-disable-line no-console
			}
			case 'debug': {
				return console.log(chalk.hex('#fffa00')('[DEBUG] ') + chalk.hex('#2bd831')(text)); // eslint-disable-line no-console
			}
			case 'error': {
				return console.log(chalk.red('[ERROR] ') + chalk.hex('#2bd831')(text)); // eslint-disable-line no-console
			}
			case 'default': {
				return console.log(`${chalk.blue('Plexi')} Development ${chalk.blue.bold('»')} ${text}`); // eslint-disable-line no-console
			}
			case 'ready': {
				return console.log(`${chalk.blue('Plexi')} Development ${chalk.blue.bold('»')} ${chalk.hex('#419df4')(text)}`); // eslint-disable-line no-console
			}
			default: return new TypeError('Invalid Log type');
		}
	}

	static warn(text) {
		return this.logger(text, 'warn');
	}

	static debug(text) {
		return this.logger(text, 'debug');
	}

	static error(text) {
		return this.logger(text, 'error');
	}
	static default(text) {
		return this.logger(text, 'default');
	}
	static ready(text) {
		return this.logger(text, 'ready');
	}
}
module.exports = log;
