const hook = require('quick.hook');
module.exports = Structures => {
	Structures.extend('Message', DiscordMessage =>
		class Message extends DiscordMessage { // eslint-disable-line no-unused-vars
			quickEmbed(text, options = {}) {
				options = { title: options.title || '', color: options.color || 7648468, deleteAfter: options.deleteAfter || 'null' };
				this.channel.send({ embed: { title: options.title, description: text, color: options.color } })
					.then(msg => {
						if (!isNaN(options.deleteAfter)) msg.delete({ timeout: options.deleteAfter });
					});
			}

			quickHook(msg, options = {}) {
				hook(this.channel, msg, options);
			}
		});
};
