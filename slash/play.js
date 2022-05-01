const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Loads songs from YouTube.")
    .addStringOption((option) => {
      return option
        .setName("to-play")
        .setDescription("What to play")
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

    const queue = await client.player.createQueue(interaction.guild);

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.editReply(
        "Could not join your voice channel! ＞︿＜"
      );
    }

    let embed = new MessageEmbed();
    const isPlaylistRegExp = new RegExp(
      /^(?:https?:[/]{2})?(?:www[.])?(?:youtu[.]be[/]|youtube[.]com[/])(?:embed[/]|v[/]|watch[?]v=|watch[?].+&v=)((?:\w|-){11})(?:&(play)?list=(\S+))/
    );
    const isSongRegExp = new RegExp(
      /^(?:https?:[/]{2})?(?:www[.])?(?:youtu[.]be[/]|youtube[.]com[/])(?:embed[/]|v[/]|watch[?]v=|watch[?].+&v=)((?:\w|-){11})/
    );
    const isSpotifyRegExp = new RegExp(
      /^(spotify:|https:[/]{2}[a-z]+[.]spotify[.]com[/])/
    );
    const toPlay = interaction.options.getString("to-play");

    if (isSpotifyRegExp.test(toPlay)) {
      return await interaction.editReply(
        "I currently do not support spotify links. (´。＿。｀) \n Wanna help me support them? Contact your nearest blxck person. ✪ ω ✪"
      );
    }

    const queryType = isPlaylistRegExp.test(toPlay)
      ? "playlist"
      : isSongRegExp.test(toPlay)
      ? "song"
      : "search";

    if (queryType === "song") {
      const result = await client.player.search(toPlay, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("No results.");
      }

      const song = result.tracks[0];
      await queue.addTrack(song);

      embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the queue.`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (queryType === "playlist") {
      const result = await client.player.search(toPlay, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("No results.");
      }

      const playlist = result.playlist;
      await queue.addTracks(result.tracks);

      embed
        .setDescription(
          `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue.`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (queryType === "search") {
      const result = await client.player.search(toPlay, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("No results.");
      }

      const song = result.tracks[0];
      await queue.addTrack(song);

      embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the queue.`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    if (!queue.playing) {
      await queue.play();
    }

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
