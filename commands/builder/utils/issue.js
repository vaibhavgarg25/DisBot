const fs = require('fs');
const path = require('path');

async function viewIssueCommand(interaction, issueId) {
    try {
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

        // Format the issue details for the reply
        const issueDetails = `**Issue ID:** ${issue.id}\n**Title:** ${issue.title}\n**Description:** ${issue.description}\n**Status:** ${issue.status}`;
        
        // Send the detailed issue information
        await interaction.reply(issueDetails);
    } catch (error) {
        console.error('Error fetching issue:', error);
        await interaction.reply('There was an error retrieving the issue. Please try again later.');
    }
}

module.exports = viewIssueCommand;
