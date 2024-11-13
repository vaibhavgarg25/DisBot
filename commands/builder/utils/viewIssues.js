const fs = require('fs');
const path = require('path');

async function viewIssuesCommand(interaction) {
    try {
        // Read and parse the JSON file
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // Filter open issues
        const openIssues = issues.filter(issue => issue.status === 'open');

        if (openIssues.length === 0) {
            await interaction.reply('No open issues found.');
            return;
        }

        // Format the issues into a string for the reply
        const issueList = openIssues.map(issue => `**ID:** ${issue.id}\n**Title:** ${issue.title}\n\n`).join('\n');

        await interaction.reply(`Listing open issues:\n\n${issueList}`);
    } catch (error) {
        console.error('Error fetching issues:', error);
        await interaction.reply('There was an error retrieving the issues. Please try again later.');
    }
}

module.exports = viewIssuesCommand;