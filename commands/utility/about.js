const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Learn more about the Community Builder Bot'),

    async execute(interaction) {
        const aboutEmbed = new EmbedBuilder()
            .setColor(0x5cdb95) // A calming color for the embed
            .setTitle('🌴 Community Builder for Remote Workers on a Virtual Island')
            .setDescription(
                'This bot is designed to help remote workers connect, collaborate, and develop skills within a virtual island community. With roles like Testers, Builders, and Gatherers, users can contribute and support one another in a friendly and engaging environment!'
            )
            .addFields(
                { name: '🏆 Key Features', value: '• Issue Management: Report and resolve issues with collaborative support.\n• Resource Sharing: Contribute valuable resources to help the community.\n• Socialize and Network: Find and connect with other remote workers.\n• Skill Development: Gain experience by taking on different roles and tasks.' },
                { name: '🌐 Roles', value: '• Tester: Finds and reports issues within the community.\n• Builder: Resolves issues and builds solutions.\n• Gatherer: Provides resources to help the community grow.' },
                { name: '📌 Get Started', value: 'Use /provideresource to add resources, /listresources to see available resources, or try /about to learn more anytime!' }
            )
            .setFooter({ text: 'Join us on this virtual island and help build a thriving community for remote workers!' });

        await interaction.reply({ embeds: [aboutEmbed] });
    },
};