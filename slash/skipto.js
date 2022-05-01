const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to a certain track number.")
    .addNumberOption((option) => {
      return option
        .setName("track-number")
        .setDescription("The track to skip to.")
        .setMinValue(1)
        .setRequired(true);
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

    if (!queue) {
      return await interaction.editReply("There are no songs in the queue.");
    }

    const trackNumber = interaction.options.getNumber("trackNumber");

    if (trackNumber > queue.tracks.length) {
      return await interaction.editReply("Invalid track number.");
    }

    queue.skipTo(trackNumber - 1);

    await interaction.editReply(`Skipped ahead to track number ${trackNumber}`);
  },
};
