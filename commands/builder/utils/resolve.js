const fs = require('fs');
const path = require('path');

async function resolveCommand(interaction, issueId) {
    try {
        // Load the JSON file with issues
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // Find the issue with the given ID
        const issue = issues.find(issue => issue.id === issueId);

        if (!issue) {
            await interaction.reply(`Issue with ID ${issueId} not found.`);
            return;
        }

        // Mark the issue as resolved
        issue.status = 'closed';

        // Save the updated issues back to the JSON file
        fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');

        await interaction.reply(`Issue ${issueId} has been marked as resolved.`);
    } catch (error) {
        console.error('Error resolving issue:', error);
        await interaction.reply('There was an error marking the issue as resolved. Please try again later.');
    }
}

module.exports = resolveCommand;