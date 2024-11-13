const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get the party details about this amazing server! 🎉'),
        
    async execute(interaction) {
        const server = interaction.guild;
        
        // Get various server statistics
        const totalChannels = server.channels.cache.size;
        const textChannels = server.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = server.channels.cache.filter(c => c.type === 2).size;
        const roleCount = server.roles.cache.size;
        const boostCount = server.premiumSubscriptionCount;
        const verificationLevel = server.verificationLevel.toLowerCase();
        
        const partyEmbed = new EmbedBuilder()
            .setTitle(`🌴 Welcome to ${server.name}'s Paradise! 🏖️`)
            .setDescription(`🎈 **Party started on:** <t:${Math.floor(server.createdTimestamp / 1000)}:F>`)
            .setColor('#FF1493') // Hot pink for party vibes!
            .setThumbnail(server.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                {
                    name: '🎭 Party People',
                    value: `\`\`\`🦩 ${server.memberCount} Total Guests\n👑 ${server.members.cache.filter(m => !m.user.bot).size} Humans\n🤖 ${server.members.cache.filter(m => m.user.bot).size} Bots\`\`\``,
                    inline: false
                },
                {
                    name: '🎪 Party Venues',
                    value: `\`\`\`🎯 ${totalChannels} Total Channels\n💭 ${textChannels} Text Lounges\n🎤 ${voiceChannels} Voice Beaches\`\`\``,
                    inline: true
                },
                {
                    name: '🎨 Party Accessories',
                    value: `\`\`\`👔 ${roleCount} Roles\n🎉 ${boostCount} Boosts\`\`\``,
                    inline: true
                },
                {
                    name: '🎫 Entry Requirements',
                    value: `\`\`\`🎱 Verification Level: ${verificationLevel}\`\`\``,
                    inline: false
                }
            )
            .setImage('https://media.giphy.com/media/TGcD6Cd0TKJb0QtFID/giphy.gif') // Party beach gif
            .setFooter({ 
                text: `🍹 Grab a drink and enjoy the vibes! | Server ID: ${server.id}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        // Add special features section if server has any
        let specialFeatures = [];
        if (server.partnered) specialFeatures.push('💎 Discord Partner');
        if (server.verified) specialFeatures.push('✅ Verified');
        if (server.premiumTier > 0) specialFeatures.push(`⭐ Boost Level ${server.premiumTier}`);
        
        if (specialFeatures.length > 0) {
            partyEmbed.addFields({
                name: '🌟 VIP Features',
                value: specialFeatures.join('\n'),
                inline: false
            });
        }

        // Add server banner if exists
        if (server.banner) {
            partyEmbed.setImage(server.bannerURL({ size: 1024 }));
        }

        await interaction.reply({ 
            content: '🎊 **WELCOME TO THE PARTY!** 🎊',
            embeds: [partyEmbed] 
        });
    },
};