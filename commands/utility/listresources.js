// commands/utility/listresources.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const issuesFilePath = path.join(__dirname, '../../db_json/issues.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listresources')
        .setDescription('Lists all resources for a given issue')
        .addStringOption(option =>
            option.setName('issue_id')
                .setDescription('The ID of the issue to list resources for')
                .setRequired(true)),
    async execute(interaction) {
        const issueID = interaction.options.getString('issue_id');

        // Load issues data from JSON file
        const issuesData = JSON.parse(fs.readFileSync(issuesFilePath, 'utf8'));
        const issue = issuesData.find(issue => issue.id === issueID);

        if (!issue) {
            await interaction.reply(`Issue ID ${issueID} does not exist.`);
            return;
        }

        // Retrieve and display resources
        const resources = issue.resources;
        if (resources.length === 0) {
            await interaction.reply(`No resources have been added for issue ${issueID}.`);
        } else {
            await interaction.reply(`Resources for issue ${issueID}:\n- ${resources.join('\n- ')}`);
        }
    },
};
