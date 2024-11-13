const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('ℹ️ List all available commands for builders on the virtual island'),

  async execute(interaction) {
    const helpMessage = `
      **Available Commands for Builders:**
      - \`/builder view_issues\` 🔍: View all open issues.
      - \`/builder claim\` ✋: Claim an issue by its ID.
      - \`/builder view_issue\` 📄: View details of a specific issue by its ID.
      - \`/builder resolve\` ✅: Mark an issue as resolved by its ID.
      - \`/issues\` 📝: Add a new issue to the list of open issues.
      - \`/provideresource\` 📦: Provide a resource for a specific issue.
      - \`/listresource\` 📋: Get a list of resources linked to a specific issue.
      **Usage:**
      - Use the \`/builder\` commands followed by subcommands as listed above.
      - Use \`/issues\`, \`/provideresource\`, and \`/listresource\` directly for issue management and resources.

      Each command will prompt for specific options as required.
    `;

    await interaction.reply(helpMessage);
  },
};
