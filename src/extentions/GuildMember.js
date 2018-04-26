module.exports = Structures => {
	Structures.extend('GuildMember', DiscordGuildMember =>
		class GuildMember extends DiscordGuildMember { // eslint-disable-line no-unused-vars
			constructor(...args) {
				super(...args);
				this.uniquie = `${this.guild.id}-${this.id}`;
				this.data = {};
				this.data.fetch = this.fetch.bind(this); // Binds to member.data.fetch();
				this.data.set = this.set.bind(this); // Binds to member.data.set();
				this.data.add = this.add.bind(this); // Binds to member.data.add();
				this.data.subtract = this.subtract.bind(this); // Binds to member.data.subtract();
				this.data.delete = this.delete.bind(this); // Binds to member.data.delete();
			}

			fetch(name) {
				if (!name) throw new Error('No DB name Provided');
				return this.client.db.fetch(`${name}_${this.uniquie}`);
			}

			set(name, data) {
				if (!name) throw new Error('No DB name Provided');
				if (!data) throw new Error('No data Provided');
				return this.client.db.set(`${name}_${this.uniquie}`, data);
			}

			add(name, number) {
				if (!name) throw new Error('No DB name Provided');
				if (!number) throw new Error('No number Provided');
				return this.client.db.add(`${name}_${this.uniquie}`, parseInt(number));
			}

			subtract(name, number) {
				if (!name) throw new Error('No DB name Provided');
				if (!number) throw new Error('No number Provided');
				return this.client.subtract(`${name}_${this.uniquie}`, parseInt(number));
			}

			delete(name) {
				if (!name) throw new Error('No DB name Provided');
				return this.client.db.delete(`${name}_${this.uniquie}`);
			}

			allRoles() {
				return this.roles.map(role => role.name);
			}
		});
};
