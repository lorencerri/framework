module.exports = Structures => {
	Structures.extend('GuildMember', DiscordGuildMember =>
		class GuildMember extends DiscordGuildMember { // eslint-disable-line no-unused-vars
			constructor(...args) {
				super(...args);
				this.uniquie = `${this.guild.id}-${this.id}`;
			}

			fetch(name) {
				if (!name) throw new Error('No DB name Provided');
				return this.client.db.fetch(`${name}_${this.uniquie}`);
			}

			set(name, value) {
				if (!name) throw new Error('No DB name Provided');
				if (!value) throw new Error('No value Provided');
				return this.client.db.set(`${name}_${this.uniquie}`, value);
			}

			delete(name) {
				if (!name) throw new Error('No DB name Provided');
				return this.client.db.delete(`${name}_${this.uniquie}`);
			}
		});
};
