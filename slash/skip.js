const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song."),
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
      return await interaction.editReply("There are no songs in the queue. ╯︿╰");
    }

    const currentSong = queue.current;

    const embed = new MessageEmbed()
      .setDescription(`${currentSong.title} has been skipped.`)
      .setThumbnail(currentSong.thumbnail);

    queue.skip();

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
