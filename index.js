require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js"); // Updated for v14
const token = process.env.DISCORD_TOKEN;
const keepAlive = require("./server");

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
      const replyContent = "There was an error while executing this command!";
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: replyContent, ephemeral: true });
      } else {
        await interaction.reply({ content: replyContent, ephemeral: true });
      }
    }
  } 
  // Check if interaction is a button
  else if (interaction.isButton()) {
    try {
      // Parse button customId in format 'status_<status>_<issueId>'
      const [_, status, issueId] = interaction.customId.split('_');

      if (['working', 'testing', 'resolved'].includes(status)) {
        await updateIssueStatus(issueId, status.charAt(0).toUpperCase() + status.slice(1));
        await interaction.reply({ content: `✅ Issue ${issueId} status updated to "${status.charAt(0).toUpperCase() + status.slice(1)}"`, ephemeral: true });
      } else {
        await interaction.reply({ content: `⚠️ Invalid status action attempted.`, ephemeral: true });
      }
    } catch (error) {
      console.error("Error handling button interaction:", error);
      await interaction.reply({ content: "⚠️ There was an error updating the issue status. Please try again.", ephemeral: true });
    }
  }
});

// Function to update issue status in JSON
async function updateIssueStatus(issueId, status) {
  const issuesPath = path.join(__dirname, 'data/issues.json');
  
  try {
    // Read and parse the JSON file
    const data = fs.readFileSync(issuesPath, 'utf-8');
    const issues = JSON.parse(data);

    // Find the issue and update its status
    const issue = issues.find(issue => issue.id === issueId);
    if (issue) {
      issue.status = status;
    } else {
      console.error(`No issue found with ID ${issueId}`);
      return;
    }

    // Write back to the JSON file
    fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');
    console.log(`Issue ${issueId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating issue status:", error);
  }
}

keepAlive();
// Log in to Discord with your client's token
client.login(token);