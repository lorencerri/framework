module.exports = client => {
	process.on('unhandledRejection', err => {
		client.log.error(`Uncaught Promise Error: \n${err.stack}`);
	});
	process.on('uncaughtException', err => {
		let errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
		client.log.error(`Uncaught Exception: \n${errorMsg.stack}`);
	});
};
