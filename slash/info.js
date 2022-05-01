const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays information about the currently playing song."),
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

    if (!queue) {
      return await interaction.editReply("There are no songs in the queue.");
    }

    const song = queue.current;
    let bar = queue.createProgressbar({
      queue: false,
      length: 19,
    });

    const embed = new MessageEmbed()
      .setThumbnail(song.thumbnail)
      .setDescription(
        `Currently playing [${song.title}](${song.url})\n\n` + bar
      );

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
