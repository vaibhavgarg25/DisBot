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
                .setDescription('🔍 View all open issues'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription('✋ Claim an issue')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue to claim')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view_issue')
                .setDescription('📄 View details of a specific issue')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue to view')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('log_progress')
                .setDescription('📝 Log your progress on an issue')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('Current status')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('notes')
                        .setDescription('Notes on progress')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resolve')
                .setDescription('✅ Mark an issue as resolved')
                .addStringOption(option =>
                    option.setName('issue_id')
                        .setDescription('The ID of the issue to resolve')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('🏆 View the leaderboard')),
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('help')
        //         .setDescription('ℹ️ List all available commands for builders')),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const issueId = interaction.options.getString('issue_id');
        const status = interaction.options.getString('status');
        const notes = interaction.options.getString('notes');
        
        switch (subcommand) {
            case 'view_issues':
                await viewIssuesCommand(interaction);
                break;
            case 'claim':
                await claimCommand(interaction, issueId);
                break;
            case 'view_issue':
                await viewIssueCommand(interaction, issueId);
                break;
            case 'log_progress':
                await logProgressCommand(interaction, issueId, status, notes);
                break;
            case 'resolve':
                await resolveCommand(interaction, issueId);
                break;
            case 'leaderboard':
                await leaderboardCommand(interaction);
                break;
            // case 'help':
            //     // Display help information
            //     const helpMessage = `
            //         **Available Commands:**
            //         - \`/builder view_issues\`: 🔍 View all open issues.
            //         - \`/builder claim\`: ✋ Claim an issue by its ID.
            //         - \`/builder view_issue\`: 📄 View details of a specific issue by its ID.
            //         - \`/builder log_progress\`: 📝 Log your progress on an issue (requires issue ID, status, and notes).
            //         - \`/builder resolve\`: ✅ Mark an issue as resolved by its ID.
            //         - \`/builder leaderboard\`: 🏆 View the leaderboard to see top contributors.
            //         - \`/builder help\`: ℹ️ List all available commands and their descriptions.
            //     `;
            //     await interaction.reply(helpMessage);
            //     break;
            default:
                await interaction.reply('Unknown command.');
                break;
        }
    },
};
