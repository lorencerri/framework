exports.run = (client, message, args) => {

    /*
    
    Your new commands code will go inside the two '{}'
    Or just here, replace this text.
    
    */
    
};
exports.conf = {
	guildOnly: false, // Set this option to either 'true/false', if you want this command enabled or disabled in DM's
	aliases: ['alias'], // Aliases, allows you to execute your command with other name, ie: ban, banish executes the same command
	cooldown: 10, // Command cooldown, set to 0 if you want to disable
	neededPerms: '' // required Permissions to run this Command. for example / BAN_MEMBERS
};
exports.help = {
	name: 'test',   // Your command name, important to have it be the same as the file name, just without the '.js'
	description: 'cmd_description', // Command description, can be useful for a 'help' command
	usage: 'test' // How to use command, ie: 'test @mention <text>', also useful for a 'help' command
};
