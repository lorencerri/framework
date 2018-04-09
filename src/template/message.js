exports.run = (client, message) => {
	if (message.author.bot) return undefined;

	if (!message.content.startsWith(client.config.prefix)) return undefined;
	let args = message.content.split(/ +/g).slice(1);
	let command = message.content.split(' ')[0].slice(client.config.prefix.length);
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	if (!message.guild && cmd.conf.guildOnly) return undefined;

	if (checkCoolDown(message, cmd) === false) {
		message.quickEmbed(`**This command is currently on cooldown for you**`);
		return undefined;
	}
	if (checkPerms(message, cmd) === false) return message.quickEmbed(`Sorry dont have the Permission \`${cmd.conf.neededPerms}\` to run this Command.`);
	cmd.run(client, message, args);
	return undefined;
};

function checkPerms(message, cmd) {
	if (!cmd.conf.neededPerms) return true;
	if (!message.member.hasPermission(cmd.conf.neededPerms)) return false;
	return true;
}

function checkCoolDown(message, cmd) {
	if (!cmd.conf.cooldown) return true;
	let limit = cmd.conf.cooldown * 500;
	let getCooldown = cmd.conf.cooldownQueue.get(message.author.id);
	if (cmd.conf.cooldown && cmd.conf.cooldown !== 0) {
		if (getCooldown !== null) {
			if (getCooldown >= Date.now() - limit) return false;
			cmd.conf.cooldownQueue.set(message.author.id, Date.now() + limit);
		} else {
			cmd.conf.cooldownQueue.set(message.author.id, Date.now() + limit);
			return true;
		}
	}
	return undefined;
}
