const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("cat").setDescription("Cat."),
  run: async ({ interaction }) => {
    await interaction.editReply("ᓚᘏᗢ");
  },
};
