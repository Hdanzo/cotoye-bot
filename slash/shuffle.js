const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the queue."),
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

    queue.shuffle();

    await interaction.editReply(
      `The queue of ${queue.tracks.length}! songs has been shuffled.`
    );
  },
};
