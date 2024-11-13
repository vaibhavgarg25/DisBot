require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection, MessageActionRow, MessageButton } = require("discord.js");
const token = process.env.DISCORD_TOKEN;
const keepAlive = require("./server")

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Load command files from the 'commands' directory
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Event when the bot is ready
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Event for handling commands and button interactions
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
      } else {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    }
  } 
  // Check if interaction is a button
  else if (interaction.isButton()) {
    // Logic for button interactions
    const issueId = interaction.customId.split('_')[1]; // Assuming customId is in format 'status_issueId'

    if (interaction.customId.startsWith('working')) {
      await updateIssueStatus(issueId, 'Working');
      await interaction.reply({ content: `Issue ${issueId} status updated to "Working"`, ephemeral: true });
    } else if (interaction.customId.startsWith('testing')) {
      await updateIssueStatus(issueId, 'Testing');
      await interaction.reply({ content: `Issue ${issueId} status updated to "Testing"`, ephemeral: true });
    } else if (interaction.customId.startsWith('resolved')) {
      await updateIssueStatus(issueId, 'Resolved');
      await interaction.reply({ content: `Issue ${issueId} status updated to "Resolved"`, ephemeral: true });
    }
  }
});

// Function to update issue status in JSON
async function updateIssueStatus(issueId, status) {
  const fs = require('fs');
  const issuesPath = path.join(__dirname, 'data/issues.json');

  // Read and parse the JSON file
  const data = fs.readFileSync(issuesPath, 'utf-8');
  const issues = JSON.parse(data);

  // Find the issue and update its status
  const issue = issues.find(issue => issue.id === issueId);
  if (issue) {
    issue.status = status;
  }

  // Write back to the JSON file
  fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');
}


keepAlive();
// Log in to Discord with your client's token
client.login(token);
