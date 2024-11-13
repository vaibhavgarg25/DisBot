const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function logProgressCommand(interaction, issueId) {
    try {
        // Get the user's ID
        const userId = interaction.user.id;

        // Load the JSON file with issues
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // Find the issue with the given ID
        const issue = issues.find(issue => issue.id === issueId);

        if (!issue) {
            // If no issue is found, reply with an error message
            await interaction.reply(`Issue with ID ${issueId} not found.`);
            return;
        }

        // Check if the user is assigned to the issue
        if (issue.assignedTo !== userId) {
            await interaction.reply(`You are not assigned to Issue ${issueId}. Only the assigned user can update the progress.`);
            return;
        }

        // Create buttons for each progress state: "Working", "Testing", "Resolved"
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('working')
                    .setLabel('Working')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('testing')
                    .setLabel('Testing')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('resolved')
                    .setLabel('Resolved')
                    .setStyle('SUCCESS')
            );

        // Send a message with the buttons
        await interaction.reply({
            content: `Select the progress for Issue ${issueId}: "${issue.title}"`,
            components: [row]
        });

    } catch (error) {
        console.error('Error logging progress:', error);
        await interaction.reply('There was an error retrieving the progress. Please try again later.');
    }
}

async function handleButtonInteraction(interaction) {
    if (!interaction.isButton()) return;

    // Extract the issue ID and progress status from the button customId
    const progressStatus = interaction.customId;
    const userId = interaction.user.id;

    // Load the JSON file with issues
    const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
    const data = fs.readFileSync(issuesPath, 'utf-8');
    const issues = JSON.parse(data);

    // Find the issue with the given ID
    const issue = issues.find(issue => issue.id === interaction.message.content.match(/\d+/)[0]);

    if (!issue) {
        await interaction.reply(`Issue not found.`);
        return;
    }

    // Check if the user is assigned to the issue
    if (issue.assignedTo !== userId) {
        await interaction.reply(`You are not assigned to Issue ${issue.id}. Only the assigned user can update the progress.`);
        return;
    }

    // Update the issue's progress based on the button clicked
    issue.progress = progressStatus;

    // Save the updated issues back to the JSON file
    fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');

    // Acknowledge the button press and confirm the progress update
    await interaction.update({
        content: `Issue ${issue.id}: "${issue.title}" has been updated to "${progressStatus}" progress.`,
        components: []
    });
}

module.exports = { logProgressCommand, handleButtonInteraction };
