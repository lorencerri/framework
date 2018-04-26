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
	if (!this.config.responses) this.config.responses = {};
	let responses: {
	    invalidUserPerms: this.config.responses.invalidUserPerms || 'Sorry %username%, you don\'t have the permission(s) to run this command: %perms%',
	    invalidBotPerms: this.config.responses.invalidBotPerms || 'Sorry, the bot doesn\'t have the permission(s) to run this command: %perms%'
	}
	if (checkPerms(message, cmd) === false) return message.quickEmbed(parseResponses(message, responses.invalidUserPerms, cmd.conf.neededPerms));
	if (checkBotPerms(message, cmd) === false) return message.quickEmbed(parseResponses(message, responses.invalidBotPerms, cmd.conf.botPerms));
	cmd.run(client, message, args);
	return undefined;
};

// message, response, permissions object from conf
function parseResponses(message, resp, permissions) {
    resp = resp.replace(/%username%/g, message.author.username);
    resp = resp.replace(/%user%/g, message.author);
    if (permissions) resp = resp.replace(/%perms%/g, cmd.conf[permissions]);
    return resp;
}

function checkPerms(message, cmd) {
	if (!cmd.conf.neededPerms) return true;
	if (!message.member.hasPermission(cmd.conf.neededPerms)) return false;
	return true;
}

function checkBotPerms(message, cmd) {
    if (!cmd.conf.botPerms) return true;
    if (!message.guild.me.hasPermission(cmd.conf.botPerms)) return false;
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
