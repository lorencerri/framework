module.exports.run = (client, message, args) => {
    
    // Return if author is not defined in the config file
	if (message.author.id !== client.config.ownerID) return;
	
	// Attempt to evaluate code
	try {
	    
		let evaled = eval(args.join(' '));

		if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
		resp(client, message, args, evaled, false);
		
	} catch (err) {
		resp(client, message, args, err, true);
	}
	
};

// Response
const resp = (client, message, args, res, err) => {
    
    args = `\`\`\`js\n${args.join(' ')}\`\`\``;
    if (res.length > 1024) res = '** - Input Too Long - **'
    
    res = `\`\`\`js\n${res}\`\`\``;
    if (res.length > 1024) res = '** - Response Too Long - **'
    
    const embed = new client.MessageEmbed()
        .setColor(0x58D68D)
        .setTitle('Evalulation')
        .addField('Input', args)
        .addField('Output', res);
    
    if (err) embed.setTitle('\`ERROR\`').setColor(0xEC7063);
    message.channel.send(embed);
    
}

exports.help = {
	name: 'eval',
	description: 'Evaluates arbitrary Javascript',
	usage: 'eval [ Code ]'
};
