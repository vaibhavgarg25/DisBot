const { SlashCommandBuilder, EmbedBuilder, ActivityType } = require('discord.js');
const moment = require('moment'); // Optional, but helps with date formatting
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Dive into your digital profile! 🚀')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get info about')
                .setRequired(false)),
    
    async execute(interaction) {
        // Get the target user (or the command runner if no user specified)
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const targetMember = interaction.guild.members.cache.get(targetUser.id);
        // Determine user status and activity
        const status = targetUser.presence?.status || 'offline';
        const activity = targetUser.presence?.activities[0];
        // Create status emojis
        const statusEmojis = {
            online: '🟢',
            idle: '🟡',
            dnd: '🔴',
            offline: '⚫'
        };
        // Roles
        const roles = targetMember ? targetMember.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join(', ') || 'No roles' : 'No roles';
        // Create embed
        const userEmbed = new EmbedBuilder()
            .setColor(targetMember?.displayHexColor || '#2F3136')
            .setTitle(`🌟 ${targetUser.username}'s Digital Passport 🌟`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                {
                    name: '👤 Basic Info',
                    value: `
                    • **Username:** ${targetUser.username}
                    • **Display Name:** ${targetMember?.displayName || 'N/A'}
                    • **Discriminator:** #${targetUser.discriminator}
                    • **User ID:** \`${targetUser.id}\`
                    `,
                    inline: false
                },
                {
                    name: `${statusEmojis[status]} Current Status`,
                    value: `
                    • **Status:** ${status.charAt(0).toUpperCase() + status.slice(1)}
                    ${activity ? `• **Activity:** ${getActivityText(activity)}` : '• No current activity'}
                    `,
                    inline: false
                },
                {
                    name: '📅 Account Timestamps',
                    value: `
                    • **Created:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>
                    • **Joined Server:** <t:${Math.floor(targetMember?.joinedTimestamp / 1000)}:F>
                    `,
                    inline: false
                },
                {
                    name: `🎭 Roles [${targetMember?.roles.cache.size || 0}]`,
                    value: roles.length > 1024 ? roles.substring(0, 1024) + '...' : roles,
                    inline: false
                }
            )
            .setImage(targetUser.bannerURL({ size: 1024 }) || null)
            .setFooter({ 
                text: `Requested by ${interaction.user.username}`, 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTimestamp();
        await interaction.reply({ embeds: [userEmbed] });
    }
};
// Helper function to get readable activity text
function getActivityText(activity) {
    switch(activity.type) {
        case ActivityType.Playing:
            return `🎮 Playing ${activity.name}`;
        case ActivityType.Streaming:
            return `📺 Streaming ${activity.name}`;
        case ActivityType.Listening:
            return `🎵 Listening to ${activity.name}`;
        case ActivityType.Watching:
            return `🍿 Watching ${activity.name}`;
        case ActivityType.Custom:
            return `💬 ${activity.state || 'Custom Status'}`;
        default:
            return `${activity.name}`;
    }
}