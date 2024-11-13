const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('🏝️ Explore the Builder\'s Command Toolkit'),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setTitle('🛠️ Virtual Island Builder\'s Command Guide 🌴')
      .setColor('#3498db')
      .setDescription('Discover the power of collaboration and creation!')
      .addFields(
        {
          name: '🔧 Builder Commands',
          value: `
          • \`/builder view_issues\` 🔍 View all open issues
          • \`/builder claim\` ✋ Claim an issue by ID
          • \`/builder view_issue\` 📄 View specific issue details
          • \`/builder resolve\` ✅ Mark issue as resolved
          `,
          inline: false
        },
        {
          name: '📝 Issue Management',
          value: `
          • \`/issues\` 📋 Create and track new issues
          • \`/provideresource\` 📦 Add resources to issues
          • \`/listresource\` 🗂️ List resources for an issue
          `,
          inline: false
        }
      )
      .setFooter({ 
        text: 'Collaborate, Create, Conquer!', 
        iconURL: interaction.client.user.displayAvatarURL() 
      })
      .setTimestamp();
    await interaction.reply({ embeds: [helpEmbed] });
  }
};
// New Issues Command
const issuesCommand = {
  data: new SlashCommandBuilder()
    .setName('issues')
    .setDescription('🚧 Create and manage project issues')
    .addStringOption(option => 
      option.setName('title')
        .setDescription('Title of the issue')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('description')
        .setDescription('Detailed description of the issue')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('priority')
        .setDescription('Priority of the issue')
        .setRequired(false)
        .addChoices(
          { name: 'Low', value: 'low' },
          { name: 'Medium', value: 'medium' },
          { name: 'High', value: 'high' },
          { name: 'Critical', value: 'critical' }
        )
    ),
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const priority = interaction.options.getString('priority') || 'medium';
    // Priority color mapping
    const priorityColors = {
      low: '#2ecc71',
      medium: '#f39c12',
      high: '#e74c3c',
      critical: '#8e44ad'
    };
    const issueEmbed = new EmbedBuilder()
      .setTitle(`🚨 New Issue: ${title}`)
      .setColor(priorityColors[priority])
      .addFields(
        { 
          name: '📋 Description', 
          value: description 
        },
        { 
          name: '🎯 Priority', 
          value: priority.toUpperCase(), 
          inline: true 
        },
        { 
          name: '👤 Reported By', 
          value: interaction.user.toString(), 
          inline: true 
        }
      )
      .setFooter({ 
        text: 'Issue Tracking System', 
        iconURL: interaction.client.user.displayAvatarURL() 
      })
      .setTimestamp();
    // Here you would typically save the issue to a database
    // For now, we'll just reply with the embed
    await interaction.reply({ 
      content: '🌟 Issue successfully created!', 
      embeds: [issueEmbed] 
    });
  }
};
module.exports.issuesCommand = issuesCommand;