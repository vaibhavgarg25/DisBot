const fs = require('fs');
const path = require('path');

async function claimCommand(interaction, issueId) {
    try {
        // Get the user's ID
        const userId = interaction.user.id;
        // console.log(userId)
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

        if (issue.assignedTo) {
            // If the issue is already assigned, inform the user
            await interaction.reply(`Issue ${issueId} is already assigned to <@${issue.assignedTo}>.`);
            return;
        }

        // Assign the issue to the user
        issue.assignedTo = userId;

        // Save the updated issues back to the JSON file
        fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');

        // Reply to the user confirming the claim
        await interaction.reply(`You have successfully claimed Issue ${issueId}: "${issue.title}".`);
    } catch (error) {
        console.error('Error claiming issue:', error);
        await interaction.reply('There was an error claiming the issue. Please try again later.');
    }
}

module.exports = claimCommand;
