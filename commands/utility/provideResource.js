// commands/utility/provideresource.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const issuesFilePath = path.join(__dirname, '../../db_json/issues.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('provideresource')
        .setDescription('Adds a resource to an existing issue')
        .addStringOption(option =>
            option.setName('issue_id')
                .setDescription('The ID of the issue to add the resource to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('resource')
                .setDescription('The resource link or text to add')
                .setRequired(true)),
    async execute(interaction) {
        const issueID = interaction.options.getString('issue_id');
        const resource = interaction.options.getString('resource');

        // Load issues data from JSON file
        const issuesData = JSON.parse(fs.readFileSync(issuesFilePath, 'utf8'));
        const issue = issuesData.find(issue => issue.id === issueID);

        if (!issue) {
            await interaction.reply(`Issue ID ${issueID} does not exist.`);
            return;
        }

        // Add the resource to the issue
        issue.resources.push(resource);

        // Save the updated issues data back to the file
        fs.writeFileSync(issuesFilePath, JSON.stringify(issuesData, null, 2));

        await interaction.reply(`Resource added to issue ${issueID}.`);
    },
};
