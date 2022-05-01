const dotenv = require("dotenv");
const DiscordJS = require("discord.js");
const { Player } = require("discord-player");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

dotenv.config();
const TOKEN = process.env.TOKEN || "";
const LOAD_SLASH = process.argv[2] === "load";
const CLIENT_ID = process.env.CLIENT_ID || "";
const GUILD_ID = process.env.GUILD_ID || "";

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.Intents.FLAGS.GUILDS,
    DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.slashcommands = new DiscordJS.Collection();

const commands = [];
const slashFiles = fs
  .readdirSync("./slash")
  .filter((file) => file.endsWith(".js"));

for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);

  if (LOAD_SLASH) {
    commands.push(slashcmd.data.toJSON());
  }
}

if (LOAD_SLASH) {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  console.log("Deploying slash commands.");

  rest
    .put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })
    .then((response) => {
      console.log(commands);
      console.log("Successfully loaded slash commands.");
      process.exit(0);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
} else {
  client.on("ready", () => {
    console.log("The bot is ready.");
  });

  client.on("interactionCreate", (interaction) => {
    const handleCommand = async () => {
      if (!interaction.isCommand()) return;

      const slashcmd = client.slashcommands.get(interaction.commandName);

      if (!slashcmd) {
        interaction.reply("Not a valid slash command.");
      }

      await interaction.deferReply();
      await slashcmd.run({ client, interaction });
    };

    handleCommand();
  });

  client.login(TOKEN);
}
