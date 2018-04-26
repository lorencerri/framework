const Discord = require('discord.js');
const fs = require('fs');
const Path = require('path');
const localPath = Path.join(__dirname, '../');
const clientPath = Path.join(process.mainModule.filename, '../');
require('../extentions/Message.js')(Discord.Structures);
require('../extentions/GuildMember.js')(Discord.Structures);
require('../extentions/User.js')(Discord.Structures);
class PlexiFramework extends Discord.Client {
	constructor(options) {
		super(options);
		this.db = require('quick.db');
		this.log = require('../functions/Log');
		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();
		this.loadCommands();
		this.loadEvents();
		this.loadConfiguration();
		this.config = require(`${clientPath}/config.json`);
		require('../functions/function.js')(this);
	}

	loadCommands() {
		var commands = `${clientPath}/commands/`;
		if (!fs.existsSync(commands)) {
			fs.mkdirSync(commands);
			this.log.default('Created Commands Folder.');
		}
		fs.readdir(commands, (err, files) => {
			if (err) this.log.error(err);
			let jsfiles = files.filter(file => file.split('.').pop() === 'js');
			if (jsfiles.length <= 0) {
				this.log.default(`No commands to load!`);
				return;
			}
			jsfiles.forEach(cmds => {
				let props = require(`${commands}/${cmds}`);
				props.conf.cooldownQueue = new Map();
				this.commands.set(props.help.name, props);
				props.conf.aliases.forEach(alias => {
					this.aliases.set(alias, props.help.name);
				});
			});
			this.log.default(`Loaded a total amount of ${files.length} Commands.`);
		});
	}

	loadEvents() {
		var events = `${clientPath}/events/`;
		if (!fs.existsSync(events)) {
			fs.mkdirSync(events);
			this.log.default('Created Events Folder.');
		}
		fs.readdir(events, (err, files) => {
			if (err) return this.log.error(err);
			const jsfiles = files.filter(file => file.split('.').pop() === 'js');
			if (jsfiles.length <= 0) {
				return this.log.default(`No events could be loaded`);
			} else {
				this.log.default(`Loaded a total amount of ${files.length} Events.`);
			}
			files.forEach(file => {
				let eventFunction = require(`${events}/${file}`);
				let eventName = file.split('.')[0];
				this.on(eventName, (...args) => eventFunction.run(this, ...args));
			});
			return undefined;
		});
	}

	loadExamples() {
		if (!fs.existsSync(`${clientPath}/events/message.js`)) {
			fs.writeFileSync(`${clientPath}/events/message.js`, fs.readFileSync(`${localPath}/template/message.js`));
			this.log.default('Created message.js Event File.');
		}

		if (!fs.existsSync(`${clientPath}/commands/eval.js`)) {
			fs.writeFileSync(`${clientPath}/commands/eval.js`, fs.readFileSync(`${localPath}/template/eval.js`));
			this.log.default('Created eval.js Command File.');
		}

		if (!fs.existsSync(`${clientPath}/commands/example.js`)) {
			fs.writeFileSync(`${clientPath}/commands/example.js`, fs.readFileSync(`${localPath}/template/example.js`));
			this.log.default('Created example.js Command File.');
		}
	}

	loadConfiguration() {
		let defaultConfig = {
			token: 'Token Here',
			prefix: 'Your prefix',
			ownerID: 'Your Client ID',
			responses: {
			    invalidUserPerms: 'Sorry %username%, you don\'t have the permission(s) to run this command: %perms%',
			    invalidBotPerms: 'Sorry, the bot doesn\'t have the permission(s) to run this command: %perms%'
			}
		};
		if (!fs.existsSync(`${clientPath}/config.json`)) {
			fs.writeFileSync(`${clientPath}/config.json`, JSON.stringify(defaultConfig, null, 4));
			this.log.ready('====================================================');
			this.log.ready('Automaticly generated a New Config File,');
			this.log.ready('Please insert your Client ID, Token and Prefix.');
			this.log.ready('Once completed restart the Bot.');
			this.log.ready('Thank you for using the Plexi Development Framework.');
			this.log.ready('Offical Server : https://discord.io/plexidev');
			this.log.ready('====================================================');
			this.loadExamples();
			process.exit(1);
		}
	}
}
module.exports = PlexiFramework;
