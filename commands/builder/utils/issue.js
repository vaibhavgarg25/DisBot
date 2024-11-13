const fs = require('fs');
const path = require('path');

async function viewIssueCommand(interaction, issueId) {
    try {
        // Load the JSON file containing issues
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // Find the issue with the provided ID
        const issue = issues.find(issue => issue.id === issueId);

        // Check if the issue exists
        if (!issue) {
            // If the issue is not found, reply with an error message
            await interaction.reply(`❌ **Issue ID ${issueId}** not found.`);
            return;
        }

        // Get extra details
        const assignedTo = issue.assignedTo ? `<@${issue.assignedTo}>` : "Unassigned";
        const progress = issue.progress || "Not started";
        const timestamp = new Date(issue.timestamp).toLocaleString();

        // Format the issue details for the response with extra details
        const issueDetails = `
        **🆔 Issue ID:** ${issue.id}
        **📝 Title:** ${issue.title}
        **📄 Description:** ${issue.description}
        **📅 Created On:** ${timestamp}
        **👤 Assigned To:** ${assignedTo}
        **⚙️ Status:** ${issue.status}
        **🔄 Progress:** ${progress}`;

        // Send the detailed issue information in a formatted way
        await interaction.reply(issueDetails);
    } catch (error) {
        console.error('Error fetching issue:', error);
        await interaction.reply('⚠️ There was an error retrieving the issue. Please try again later.');
    }
}

module.exports = viewIssueCommand;
