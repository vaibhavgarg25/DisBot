// commands/utility/provideresource.js

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Define the path to the JSON file where issues data is stored
const issuesFilePath = path.join(__dirname, '../../db_json/issues.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('provideresource')
        .setDescription('📘 Adds a resource to an existing issue')
        .addStringOption(option =>
            option.setName('issue_id')
                .setDescription('🔖 The ID of the issue to which the resource will be added')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('resource')
                .setDescription('🔗 The link or text resource to add to the issue')
                .setRequired(true)),

    async execute(interaction) {
        // Retrieve options provided by the user
        const issueID = interaction.options.getString('issue_id');
        const resource = interaction.options.getString('resource');

        try {
            // Load issues data from the JSON file
            const issuesData = JSON.parse(fs.readFileSync(issuesFilePath, 'utf8'));
            const issue = issuesData.find(issue => issue.id === issueID);

            // If the specified issue ID doesn't exist, inform the user
            if (!issue) {
                await interaction.reply({
                    content: `⚠️ **Issue Not Found**: No issue found with ID \`${issueID}\`.`,
                    ephemeral: true // Only visible to the user who invoked the command
                });
                return;
            }

            // Append the new resource to the issue's resources
            issue.resources.push(resource);

            // Write the updated issues data back to the JSON file
            fs.writeFileSync(issuesFilePath, JSON.stringify(issuesData, null, 2));

            // Notify the user of the successful addition with a formatted response
            await interaction.reply({
                content: `✅ **Resource Added Successfully**\nThe resource has been added to issue **${issueID}**.`,
                embeds: [
                    {
                        color: 0x3498db, // Set an embed color
                        title: `Issue: ${issueID}`,
                        description: `**New Resource Added**:\n${resource}`,
                        footer: { text: 'Resource addition confirmed' },
                        timestamp: new Date(),
                    }
                ]
            });

        } catch (error) {
            // Log the error and notify the user of the failure
            console.error("Error while adding resource:", error);
            await interaction.reply({
                content: `❌ **An Error Occurred**: Unable to add the resource to issue \`${issueID}\`.`,
                ephemeral: true // Only visible to the user
            });
        }
    },
};