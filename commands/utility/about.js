const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('🤖 Explore the Community Builder Bot ecosystem'),
    async execute(interaction) {
        const aboutEmbed = new EmbedBuilder()
            .setColor('#00F5FF')  // Cyber cyan
            .setTitle('🌐 **Community Builder: Digital Collaboration Nexus**')
            .setDescription(`
**Welcome to the Community Builder Bot ecosystem!**  
A virtual space designed for remote teams to connect, collaborate, and solve problems together.  
\`\`\`ansi
▓ VIRTUAL ISLAND COLLABORATIVE PLATFORM v2.1.0
------------------------------------------
Connecting remote workers through innovative digital ecosystems
\`\`\`
            `)
            .addFields(
                {
                    name: '🔬 **System Architecture**',
                    value: `
\`\`\`json
{
    "core_modules": [
        "Issue Management",
        "Resource Allocation",
        "Skill Networking"
    ],
    "primary_objectives": [
        "Collaborative Problem Solving",
        "Community Empowerment",
        "Continuous Learning"
    ]
}
\`\`\`
                    `,
                    inline: false
                },
                {
                    name: '🤖 **Role Matrix**',
                    value: `
\`\`\`diff
+ TESTER   : Issue Detection & Reporting
- BUILDER  : Solution Development
# GATHERER : Resource Procurement
\`\`\`
                    `,
                    inline: false
                },
                {
                    name: '💡 **Interaction Protocols**',
                    value: `
• \`/provideresource\` → Contribute Resources to Issues  
• \`/listresources\` → View Available Resources  
• \`/issues\` → Track & Manage Issues
                    `,
                    inline: false
                }
            )
            .setFooter({ 
                text: 'Digital Collaboration Ecosystem | Last Updated: 2024.Q1', 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [aboutEmbed] });
    },
};