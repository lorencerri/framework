exports.run = (client, message) => {
	if (message.author.bot) return undefined;

	if (!message.content.startsWith(client.config.prefix)) return undefined;
	let args = message.content.split(/ +/g).slice(1);
	let command = message.content.split(' ')[0].slice(client.config.prefix.length);
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	if (!message.guild && cmd.conf.guildOnly) return undefined;

	if (checkPerms(message, cmd)) {
		// message.quickEmbed(`**This command is currently on cooldown for you, try again in \`${(Math.abs((Date.now() - limit) - getCooldown) / 1000).toFixed(2)}\` seconds.**`);
		cmd.run(client, message, args);
	} else {
		message.quickEmbed(`Sorry dont have the Permission \`${cmd.conf.neededPerms}\` to run this Command.`);
		return undefined;
	}
};

function checkPerms(message, cmd) {
	if (!cmd.conf.neededPerms) return true;
	if (!message.member.hasPermission(cmd.conf.neededPerms)) return false;
	return true;
}
/*
function checkCooldown(client, message, args, cmd) {
	let limit = cmd.conf.cooldown * 500;
	let getCooldown = cmd.conf.cooldownQueue.get(message.author.id);
	if (cmd.conf.cooldown && cmd.conf.cooldown !== 0 && cmd.conf.neededPerms && !cmd.conf.neededPerms !== '') {
		if (getCooldown !== null) {
			if (getCooldown >= Date.now() - limit) {
				return false; // eslint-disable-line
			} else {
				cmd.conf.cooldownQueue.set(message.author.id, Date.now() + limit);
			}
		} else {
			if (!message.member.hasPermission(cmd.conf.needPerms)) return undefined;
			cmd.conf.cooldownQueue.set(message.author.id, Date.now() + limit);
			return true;
		}
	}
	return undefined;

}