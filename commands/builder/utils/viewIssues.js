const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
async function viewIssuesCommand(interaction) {
    try {
        // Read and parse the JSON file
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);
        // Filter open issues
        const openIssues = issues.filter(issue => issue.status === 'open');
        if (openIssues.length === 0) {
            const noIssuesEmbed = new EmbedBuilder()
                .setTitle('🏝️ Issue Tracker')
                .setDescription('No open issues at the moment! 🎉')
                .setColor('#2ecc71')
                .setFooter({ text: 'All clear on the island!' });
            await interaction.reply({ embeds: [noIssuesEmbed] });
            return;
        }
        // Create an embed with issues
        const issuesEmbed = new EmbedBuilder()
            .setTitle('🚧 Open Issues')
            .setDescription(`${openIssues.length} active issues need your attention!`)
            .setColor('#e74c3c')
            .setTimestamp();
        // Add each issue as a field
        openIssues.forEach(issue => {
            issuesEmbed.addFields({
                name: `🔍 Issue #${issue.id}: ${issue.title}`,
                value: `
**Priority:** ${getPriorityEmoji(issue.priority)}
**Created:** <t:${Math.floor(new Date(issue.createdAt).getTime() / 1000)}:R>
**Assigned To:** ${issue.assignedTo || 'Unassigned'}
                `.trim(),
                inline: false
            });
        });
        // Add summary field
        issuesEmbed.addFields({
            name: '📊 Issue Summary',
            value: `
**Total Open Issues:** ${openIssues.length}
**Highest Priority Issue:** ${getHighestPriorityIssue(openIssues)}
            `.trim(),
            inline: false
        });
        issuesEmbed.setFooter({ 
            text: 'Stay on top of your project!', 
            iconURL: interaction.client.user.displayAvatarURL() 
        });
        await interaction.reply({ embeds: [issuesEmbed] });
    } catch (error) {
        console.error('Error fetching issues:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('🚨 Error')
            .setDescription('There was an error retrieving the issues. Please try again later.')
            .setColor('#ff0000')
            .setTimestamp();
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}
// Helper function to get priority emoji
function getPriorityEmoji(priority) {
    switch(priority) {
        case 'low': return '🟢 Low';
        case 'medium': return '🟡 Medium';
        case 'high': return '🔴 High';
        case 'critical': return '🟣 Critical';
        default: return '⚪ Unknown';
    }
}
// Helper function to find highest priority issue
function getHighestPriorityIssue(issues) {
    const priorityOrder = ['critical', 'high', 'medium', 'low'];
    const highestPriorityIssue = issues.reduce((highest, current) => {
        return priorityOrder.indexOf(current.priority) < priorityOrder.indexOf(highest.priority) 
            ? current 
            : highest;
    });
    return `#${highestPriorityIssue.id} - ${highestPriorityIssue.title}`;
}
module.exports = viewIssuesCommand;