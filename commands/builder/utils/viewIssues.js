const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js'); // Make sure to import MessageEmbed

async function viewIssuesCommand(interaction) {
    try {
        // Read and parse the JSON file
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // Filter open issues
        const openIssues = issues.filter(issue => issue.status === 'open');

        if (openIssues.length === 0) {
            await interaction.reply('❌ No open issues found.');
            return;
        }

        // Create an embed for each issue
        const embeds = openIssues.map(issue => {
            // Select an emoji based on priority
            const priorityEmoji = {
                High: '🔴',
                Medium: '🟠',
                Low: '🟢'
            }[issue.priority] || '🟡'; // Default to yellow if priority is missing

            // Construct the embed
            const issueEmbed = new MessageEmbed()
                .setColor('#FF5733') // Customize the color
                .setTitle(`📋 Issue #${issue.id}: ${issue.title}`)
                .setDescription(issue.description || 'No description available')
                .addFields(
                    { name: '🛠️ Status', value: issue.status, inline: true },
                    { name: `${priorityEmoji} Priority`, value: issue.priority || 'Normal', inline: true },
                    { name: '👤 Created By', value: issue.createdBy || 'Unknown', inline: true }
                )
                .setFooter('📝 Issue Tracker')
                .setTimestamp(issue.createdAt ? new Date(issue.createdAt) : new Date());

            return issueEmbed;
        });

        // Send each embed as a separate message
        for (const embed of embeds) {
            await interaction.reply({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Error fetching issues:', error);
        await interaction.reply('⚠️ There was an error retrieving the issues. Please try again later.');
    }
}

module.exports = viewIssuesCommand;
