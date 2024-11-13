const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('interactionCreate', async (interaction) => {
    // Check if the interaction is a button click
    if (interaction.isButton()) {
        const [action, issueId] = interaction.customId.split('_'); // Extract action and issueId

        if (action === 'working') {
            await updateProgressInJson(issueId, 'Working');
            await interaction.reply(`Issue ${issueId} progress set to "Working"`);
        } else if (action === 'testing') {
            await updateProgressInJson(issueId, 'Testing');
            await interaction.reply(`Issue ${issueId} progress set to "Testing"`);
        } else if (action === 'resolved') {
            await updateProgressInJson(issueId, 'Resolved');
            await interaction.reply(`Issue ${issueId} progress set to "Resolved"`);
        }
    }
});

async function updateProgressInJson(issueId, status) {
    const fs = require('fs');
    const path = require('path');
    const issuesPath = path.join(__dirname, 'data/issues.json');

    // Read and parse the JSON
    const data = fs.readFileSync(issuesPath, 'utf-8');
    const issues = JSON.parse(data);

    // Find and update the issue's progress status
    const issue = issues.find(issue => issue.id === issueId);
    if (issue) {
        issue.progress = status;
    }

    // Write the updated data back to the JSON file
    fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');
}
