const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current song queue.")
    .addNumberOption((option) => {
      return option
        .setName("page")
        .setDescription("Page number of the queue.")
        .setMinValue(1);
    }),
  run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel) {
      return interaction.editReply(
        "You need to be in a Voice Channel to use this command! ￣へ￣"
      );
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.editReply(
        "You are not in my voice channel! ￣へ￣"
      );

    const queue = client.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return await interaction.editReply("There are no songs in the queue.");
    }

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages) {
      return await interaction.editReply(
        `Invalid page. There are only a total of ${totalPages} pages of songs.`
      );
    }

    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${
          song.title
        } -- <@${song.requestedBy.id}>`;
      })
      .join(`\n`);

    const currentSong = queue.current;
    const embed = new MessageEmbed()
      .setDescription(
        `**Currenty playing**\n` +
          (currentSong
            ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`
            : "None") +
          `\n\n**Queue:**\n${queueString}`
      )
      .setFooter({
        text: `Page ${page + 1} of ${totalPages}`,
      })
      .setThumbnail(currentSong.thumbnail);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
