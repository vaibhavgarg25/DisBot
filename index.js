require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { token } = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
  
	const command = interaction.client.commands.get(interaction.commandName);
  
	if (!command) {
	  console.error(`No command matching ${interaction.commandName} was found.`);
	  return;
	}
  
	try {
	  // Attempt to execute the command
	  await command.execute(interaction);
	} catch (error) {
	  console.error(error);
  
	  // Check if the interaction has already been replied to or deferred
	  if (interaction.replied || interaction.deferred) {
		// If already replied or deferred, use followUp to send the error message
		await interaction.followUp({
		  content: "There was an error while executing this command!",
		  ephemeral: true,
		});
	  } else {
		// If not replied or deferred, reply with the error message
		await interaction.reply({
		  content: "There was an error while executing this command!",
		  ephemeral: true,
		});
	  }
	}
  });
  

// Log in to Discord with your client's token
client.login(token);
