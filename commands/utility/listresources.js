// commands/utility/listresources.js

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Define the path to the JSON file containing issue data
const issuesFilePath = path.join(__dirname, '../../db_json/issues.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listresources')
        .setDescription('📋 Lists all resources for a specified issue')
        .addStringOption(option =>
            option.setName('issue_id')
                .setDescription('🔖 The ID of the issue for which resources will be listed')
                .setRequired(true)),

    async execute(interaction) {
        // Retrieve the issue ID provided by the user
        const issueID = interaction.options.getString('issue_id');

        try {
            // Load the issues data from the JSON file
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

            // Retrieve the resources for the specified issue
            const resources = issue.resources;
            
            // Check if there are any resources, and respond accordingly
            if (!resources || resources.length === 0) {
                await interaction.reply({
                    content: `📭 **No Resources**\nThere are currently no resources added for issue **${issueID}**.`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `📚 **Resources for Issue ${issueID}:**\n\n${resources.map((res, index) => `**${index + 1}.** ${res}`).join('\n')}`,
                    ephemeral: false
                });
            }

        } catch (error) {
            // Log any errors and inform the user of the issue
            console.error("Error listing resources:", error);
            await interaction.reply({
                content: `❌ **An Error Occurred**: Unable to retrieve resources for issue \`${issueID}\`.`,
                ephemeral: true
            });
        }
    },
};