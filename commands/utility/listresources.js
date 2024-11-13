// commands/utility/listresources.js
const { SlashCommandBuilder } = require('discord.js');
const Issue = require('../../models/issue'); // Import the Issue model

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

        // Find the issue by issueID
        const issue = await Issue.findOne({ issueID });

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
