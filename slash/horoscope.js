const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
  capitalizeFirstLetter,
  getRandomHexColor,
} = require("./../utils/functions");
const axios = require("axios");

const emojiDict = {
  aries: "🐏",
  taurus: "🐂",
  gemini: "🎭",
  cancer: "🦀",
  leo: "🦁",
  virgo: "👧",
  libra: "⚖",
  scorpio: "🦂",
  sagittarius: "🏹",
  capricorn: "🐐",
  aquarius: "🏺",
  pisces: "🐟",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horoscope")
    .setDescription("Daily horoscope.")
    .addStringOption((option) => {
      return option
        .setName("sign")
        .setDescription("The horoscope sign you want today's info on.")
        .setRequired(true);
    }),
  run: async ({ interaction }) => {
    const sign = interaction.options.getString("sign");

    if (!emojiDict.hasOwnProperty(sign.toLowerCase())) {
      return await interaction.editReply(
        "It looks like that zodiac sign does not exist. (＠_＠;)"
      );
    }

    const options = {
      method: "POST",
      url: "https://aztro.sameerkumar.website/",
      params: { sign: sign, day: "today" },
    };

    let embed = new MessageEmbed();

    try {
      const { data } = await axios.request(options);

      embed
        .setColor(getRandomHexColor())
        .setTitle(
          `${capitalizeFirstLetter(sign)} ${emojiDict[sign.toLowerCase()]}`
        )
        .setDescription(`${data.description}`)
        .addFields(
          { name: "\u200B", value: "\u200B" },
          { name: "Lucky Color", value: `${data.color}`, inline: true },
          {
            name: "Lucky Number",
            value: `${data.lucky_number}`,
            inline: true,
          },
          { name: "Lucky Time", value: `${data.lucky_time}`, inline: true }
        );

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);
    }
  },
};
