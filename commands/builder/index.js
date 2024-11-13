const { SlashCommandBuilder } = require('discord.js');
const viewIssuesCommand = require('./utils/viewIssues');
const claimCommand = require('./utils/claim');
const viewIssueCommand = require('./utils/issue');
const logProgressCommand = require('./utils/logProgress');
const resolveCommand = require('./utils/resolve');
const leaderboardCommand = require('./utils/leaderboard');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('builder')
        .setDescription('Commands for builders on the virtual island')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view_issues')
                .setDescription('View all open issues'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription('Claim an issue')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue to claim')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view_issue')
                .setDescription('View details of a specific issue')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue to view')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resolve')
                .setDescription('Mark an issue as resolved')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue to resolve')
                        .setRequired(true))),
        
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const issueId = interaction.options.getString('issue_id');
        const status = interaction.options.getString('status');
        const notes = interaction.options.getString('notes');
        
        switch (subcommand) {
            case 'view_issues':
                // Call viewIssuesCommand function
                await viewIssuesCommand(interaction);
                break;
            case 'claim':
                // Call claimCommand function
                await claimCommand(interaction, issueId);
                break;
            case 'view_issue':
                // Call viewIssueCommand function
                await viewIssueCommand(interaction, issueId);
                break;
            case 'log_progress':
                // Call logProgressCommand function
                await logProgressCommand(interaction, issueId, status, notes);
                break;
            case 'resolve':
                // Call resolveCommand function
                await resolveCommand(interaction, issueId);
                break;
            case 'leaderboard':
                // Call leaderboardCommand function
                await leaderboardCommand(interaction);
                break;
            default:
                await interaction.reply('Unknown command.');
                break;
        }
    },
};
