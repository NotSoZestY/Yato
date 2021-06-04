/* eslint-disable no-process-env */
/* eslint-disable camelcase */
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../config/emojis.json');
const { MessageButton } = require('gcommands');
const colors = require('../../config/colors.json');

require('dotenv').config();

module.exports = {
	name: 'yt',
	slash: true,
	description: 'Youtube on Discord?',
	// guildOnly: '810474313245261824',
	expectedArgs: [
		{
			name: 'voicechannel',
			type: '7',
			description: 'Select Voice Channel',
			required: true
		}
	],
	userRequiredPermissions: 'CREATE_INSTANT_INVITE',
	clientRequiredPermissions: 'CREATE_INSTANT_INVITE',
	cooldown: 10,
	run: async ({ client, guild, respond }, arrayArgs, args) => {
		const channelID = args.voicechannel;
		const channel = guild.channels.cache.get(channelID);
		const embed = new MessageEmbed();
		const TickYes = client.emojis.cache.get(emojis.TickYes);
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (channel.type !== 'voice') {
			embed.setColor(colors.red);
			embed.setDescription(`${TickNo}\u3000Invalid Channel! Please choose only **Voice Channels**`);
			return {
				content: embed,
				ephemeral: true
			};
		}

		const res = await axios({
			method: 'post',
			url: `https://discord.com/api/v8/channels/${channel.id}/invites`,
			data: JSON.stringify({
				max_age: 86400,
				max_uses: 0,
				target_application_id: '755600276941176913',
				target_type: 2,
				temporary: false,
				validate: null
			}),
			headers: {
				Authorization: `Bot ${process.env.TOKEN}`,
				'Content-Type': 'application/json'
			}
		});

		const invite = res.data;
		if (!invite.code) return respond(`${TickNo}  Could not start **YouTube Together**!`);
		const button = new MessageButton()
			.setStyle('url')
			.setLabel('Join')
			.setURL(`https://discord.gg/${invite.code}`)
			.toJSON();
		return respond({
			content: `${TickYes}  **YouTube Together** started in \`${channel.name}\``,
			components: button
		});
	}
};
