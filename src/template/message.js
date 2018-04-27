exports.run = (client, message) => {
	if (message.author.bot) return undefined;

	if (!message.content.startsWith(client.config.prefix)) return undefined;
	let args = message.content.split(/ +/g).slice(1);
	let command = message.content.split(' ')[0].slice(client.config.prefix.length).toLowerCase();
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return undefined;
	if (!message.guild && cmd.conf.guildOnly) return undefined;
	if (checkCoolDown(message, cmd) === false) {
		message.quickEmbed(null, { footer: `**This command is currently on cooldown for you, sorry!**` });
		return undefined;
	}
	if (!client.config.responses) client.config.responses = {};
	let responses = {
	    invalidUserPerms: client.config.responses.invalidUserPerms || 'Sorry %username%, you don\'t have the permission(s) to run this command: %perms%',
	    invalidBotPerms: client.config.responses.invalidBotPerms || 'Sorry, the bot doesn\'t have the permission(s) to run this command: %perms%',
	    invalidRoles: client.config.responses.invalidRoles || 'Sorry, you don\'t have the required role(s) to run this command: %perms%'
	}
	if (checkPerms(message, cmd) === false) return message.quickEmbed(null, { footer: parseResponses(message, responses.invalidUserPerms, cmd.conf.neededPerms) });
	if (checkBotPerms(message, cmd) === false) return message.quickEmbed(null, { footer: parseResponses(message, responses.invalidBotPerms, cmd.conf.botPerms) });
	if (!checkRoles(message, cmd)) return message.quickEmbed(null, { footer: parseResponses(message, responses.invalidRoles, cmd.conf.neededRoles) });
	cmd.run(client, message, args);
	if (message.guild) console.log(`${client.chalk.blue(message.guild.name)} ${client.chalk.blue.bold('»')} ${client.chalk.blue(message.channel.name)} ${client.chalk.blue.bold('»')} Ran the command: ${client.chalk.hex('#419df4')(command)}`); // eslint-disable-line no-console
	return undefined;
};

// message, response, permissions object from conf
function parseResponses(message, resp, permissions) {
    resp = resp.replace(/%username%/g, message.author.username);
    resp = resp.replace(/%user%/g, message.author);
    if (permissions && permissions instanceof Array) resp = resp.replace(/%perms%/g, permissions.join(', '));
    else if (permissions) resp = resp.replace(/%perms%/g, permissions);
    return resp;
}

function checkPerms(message, cmd) {
	if (!cmd.conf.neededPerms) return true;
	if (!message.member.hasPermission(cmd.conf.neededPerms)) return false;
	return true;
}

function checkRoles(message, cmd) {
    if (!cmd.conf.neededRoles) return true;
    if (typeof cmd.conf.neededRoles === 'string') return message.member.roles.find('name', cmd.conf.neededRoles);
    let hasRoles = true;
    cmd.conf.neededRoles.map(function(role) {
        if (hasRoles && !message.member.roles.find('name', role)) hasRoles = false;
    })
    return hasRoles;
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
