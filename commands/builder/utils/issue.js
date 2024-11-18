const fs = require('fs');
const path = require('path');
const { EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');

async function viewIssueCommand(interaction, issueId) {
    try {
        // Define the path to the issues JSON file
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');

        // Load and parse the JSON file containing issues
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // Search for the issue matching the provided ID
        const issue = issues.find(issue => issue.id === issueId);

        // Handle case where issue is not found
        if (!issue) {
            await interaction.reply({
                content: `⚠️ **Issue Not Found**\nIssue with ID ${issueId} could not be located. Please check the ID and try again.`,
                ephemeral: true
            });
            return;
        }

        // Define status emoji based on issue status
        const statusEmoji = issue.status.toLowerCase() === 'open' ? '🟢' : '🔴';

        // Create a rich embed with issue details
        const issueEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Issue #${issue.id}: ${issue.title}`)
            .setDescription(`**Description**: ${issue.description}`)
            .addFields(
                { name: 'Status', value: `${statusEmoji} ${issue.status}`, inline: true },
                { name: 'Created At', value: issue.createdAt, inline: true }
            )
            .setFooter({ text: 'Issue Tracker', iconURL: 'https://i.imgur.com/7w1yM3H.png' })
            .setTimestamp();

        // Create a row of buttons for updating the issue status
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`working_${issue.id}`)
                    .setLabel('Mark as Working')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`testing_${issue.id}`)
                    .setLabel('Mark as Testing')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`resolved_${issue.id}`)
                    .setLabel('Mark as Resolved')
                    .setStyle('SUCCESS')
            );

        // Send the embed along with buttons
        await interaction.reply({
            embeds: [issueEmbed],
            components: [row]
        });

    } catch (error) {
        console.error('Error fetching issue:', error);
        await interaction.reply({
            content: '🚨 **Error**: There was an issue retrieving the data. Please try again later.',
            ephemeral: true
        });
    }
}

module.exports = viewIssueCommand;