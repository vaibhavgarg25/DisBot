const fs = require('fs');
const path = require('path');

// 🌟 Function: claimCommand 🌟
// Purpose: Allows a user to claim an unassigned issue from the JSON database
async function claimCommand(interaction, issueId) {
    try {
        // 🎯 Step 1: Retrieve the User's ID
        const userId = interaction.user.id;

        // 📂 Step 2: Load the JSON File Containing Issues
        const issuesPath = path.join(__dirname, '../../../db_json/issues.json');
        const data = fs.readFileSync(issuesPath, 'utf-8');
        const issues = JSON.parse(data);

        // 🔍 Step 3: Locate the Issue by ID
        const issue = issues.find(issue => issue.id === issueId);

        if (!issue) {
            // 🚫 No Issue Found! Reply with an Error Message
            await interaction.reply(`❌ Issue with ID **${issueId}** not found.`);
            return;
        }

        if (issue.assignedTo) {
            // 🔒 Issue Already Assigned! Inform the User
            await interaction.reply(`⚠️ Issue **${issueId}** is already assigned to <@${issue.assignedTo}>.`);
            return;
        }

        // 📝 Step 4: Assign the Issue to the Current User
        issue.assignedTo = userId;

        // 💾 Step 5: Save the Updated Issues Back to the JSON File
        fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf-8');

        // 🎉 Success! Confirm the Claim to the User
        await interaction.reply(`✅ You have successfully claimed **Issue ${issueId}**: "${issue.title}". 🎉`);
    } catch (error) {
        // 🛑 Error Handling: Log and Inform the User
        console.error('❗ Error claiming issue:', error);
        await interaction.reply('⚠️ There was an error claiming the issue. Please try again later.');
    }
}

// 🗃️ Export the claimCommand function for use in other modules
module.exports = claimCommand;