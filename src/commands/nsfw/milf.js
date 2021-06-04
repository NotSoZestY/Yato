const { MessageEmbed } = require('discord.js');
const { redditFetcher } = require('../../structures/utils');
const colors = require('../../config/colors.json');
const emojis = require('../../config/emojis.json');

module.exports = {
	name: 'milf',
	aliases: ['milfs'],
	slash: false,
	description: 'Quality content from r/AnimeMILFS',
	nsfw: true,
	// guildOnly: '810474313245261824',
	cooldown: 10,
	run: async ({ client, channel, respond, edit }) => {
		const embed = new MessageEmbed();
		const TickNo = client.emojis.cache.get(emojis.TickNo);

		if (!channel.nsfw) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000This command can only be used in **NSFW** marked channels`);

			return respond({
				content: embed,
				ephemeral: true
			});
		}

		respond({
			content: 'getting content...',
			thinking: true
		});
		const data = await redditFetcher('AnimeMILFS', channel);

		if (!data) {
			embed.setColor(colors.red)
				.setDescription(`${TickNo}\u3000An unknown error occured, if the error still persists after some time then report in Yato's [Support Server](https://discord.gg/mm7Ke8T)`);
			return edit({
				content: embed,
				ephemeral: true
			});
		}

		embed.setColor(colors.default)
			.setImage(data.image)
			.setFooter(`${data.subredditNamePrefixed}`);

		return edit({
			content: embed
		});
	}
};
