// commands/utility/provideresource.js
const { SlashCommandBuilder } = require('discord.js');
const Issue = require('../../models/issue'); // Import the Issue model

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

        // Find the issue by issueID
        const issue = await Issue.findOne({ issueID });

        if (!issue) {
            await interaction.reply(`Issue ID ${issueID} does not exist.`);
            return;
        }

        // Add the resource to the issue
        issue.resources.push(resource);
        await issue.save();

        await interaction.reply(`Resource added to issue ${issueID}.`);
    },
};
