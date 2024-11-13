const { MessageEmbed } = require('discord.js');

/**
 * Generates a random leaderboard of server members.
 *
 * @param {Object} interaction - The interaction object for replying.
 */
async function leaderboardCommand(interaction) {
    try {
        // Fetch the members of the server
        const members = await interaction.guild.members.fetch();
        const memberList = members
            .filter(member => !member.user.bot) // Exclude bots
            .map(member => ({
                name: member.user.username,
                score: Math.floor(Math.random() * 100) + 1 // Random score between 1 and 100
            }))
            .sort((a, b) => b.score - a.score) // Sort by score in descending order
            .slice(0, 10); // Get the top 10 members

        // Format the leaderboard content
        const leaderboard = memberList
            .map((member, index) => `**${index + 1}.** 🏅 **${member.name}** — ${member.score} pts`)
            .join('\n');

        // Create an embed message for visual appeal
        const embed = new MessageEmbed()
            .setColor('#FFD700')
            .setTitle('🏆 Server Leaderboard')
            .setDescription(leaderboard)
            .setFooter('Scores are randomly generated for demonstration purposes.')
            .setTimestamp();

        // Send the leaderboard embed as a reply
        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Error creating leaderboard:', error);
        await interaction.reply('🚨 **Error**\nUnable to generate the leaderboard. Please try again later.');
    }
}

module.exports = leaderboardCommand;