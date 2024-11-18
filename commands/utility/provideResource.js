const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const issuesFilePath = path.join(__dirname, '../../db_json/issues.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('provideresource')
        .setDescription('🚀 Contribute a valuable resource to an existing issue')
        .addStringOption(option =>
            option.setName('issue_id')
                .setDescription('🔖 Specify the issue ID for resource contribution')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('resource')
                .setDescription('🌐 Share a link, document, or helpful information')
                .setRequired(true)),
    async execute(interaction) {
        const issueID = interaction.options.getString('issue_id');
        const resource = interaction.options.getString('resource');

        // Validate resource
        if (!isValidResource(resource)) {
            const invalidEmbed = new EmbedBuilder()
                .setColor('#FF4136')
                .setTitle('⚠️ Invalid Resource')
                .setDescription('Please provide a valid URL or meaningful text resource.')
                .addFields(
                    { 
                        name: '✅ Valid Resources Include:', 
                        value: '• Working URLs\n• GitHub Links\n• Useful Text Descriptions\n• Documentation Links' 
                    }
                )
                .setFooter({ text: 'Resource validation failed' });
            return await interaction.reply({ 
                embeds: [invalidEmbed], 
                ephemeral: true 
            });
        }

        try {
            const issuesData = JSON.parse(fs.readFileSync(issuesFilePath, 'utf8'));
            const issueIndex = issuesData.findIndex(issue => issue.id === issueID);

            if (issueIndex === -1) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#FF4136')
                    .setTitle('🔍 Issue Not Found')
                    .setDescription(`No issue exists with ID \`${issueID}\``)
                    .addFields(
                        { 
                            name: '💡 Tip', 
                            value: 'Double-check the issue ID or use `/issues` to view current issues' 
                        }
                    )
                    .setFooter({ text: 'Resource addition unsuccessful' });
                return await interaction.reply({ 
                    embeds: [notFoundEmbed], 
                    ephemeral: true 
                });
            }

            // Add resource with metadata
            const resourceEntry = {
                content: resource,
                addedBy: interaction.user.id,
                addedAt: new Date().toISOString(),
                type: detectResourceType(resource)
            };
            issuesData[issueIndex].resources.push(resourceEntry);
            fs.writeFileSync(issuesFilePath, JSON.stringify(issuesData, null, 2));

            // Success Embed
            const successEmbed = new EmbedBuilder()
                .setColor('#2ECC40')
                .setTitle('🎉 Resource Contribution Successful!')
                .setDescription(`Resource added to Issue #${issueID}`)
                .addFields(
                    { 
                        name: '📌 Resource Details', 
                        value: `\`\`\`${truncateResource(resource)}\`\`\`` 
                    },
                    { 
                        name: '🔍 Resource Type', 
                        value: detectResourceType(resource), 
                        inline: true 
                    },
                    { 
                        name: '👤 Contributed By', 
                        value: interaction.user.toString(), 
                        inline: true 
                    }
                )
                .setThumbnail(getResourceTypeIcon(resource))
                .setFooter({ 
                    text: 'Thank you for contributing!', 
                    iconURL: interaction.client.user.displayAvatarURL() 
                })
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error("Resource Addition Error:", error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF4136')
                .setTitle('🚨 System Error')
                .setDescription('An unexpected error occurred while processing your resource.')
                .addFields(
                    { 
                        name: '🔧 Troubleshooting', 
                        value: 'Please try again or contact support if the issue persists' 
                    }
                )
                .setFooter({ text: 'Error in resource management' });
            await interaction.reply({ 
                embeds: [errorEmbed], 
                ephemeral: true 
            });
        }
    },
};

// Utility Functions (Without external validator)
function isValidResource(resource) {
    return resource.length > 3 && (isValidUrl(resource) || resource.trim().length > 10);
}

function isValidUrl(url) {
    const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    return regex.test(url);
}

function detectResourceType(resource) {
    if (resource.includes('github.com')) return '🐱 GitHub Link';
    if (resource.includes('drive.google.com')) return '📁 Google Drive';
    if (resource.includes('http')) return '🌐 Web Link';
    return '📝 Text Resource';
}

function truncateResource(resource, length = 50) {
    return resource.length > length 
        ? `${resource.substring(0, length)}...` 
        : resource;
}

function getResourceTypeIcon(resource) {
    const typeIcons = {
        'github.com': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        'drive.google.com': 'https://www.gstatic.com/images/branding/product/1x/google_drive_2020q4_48dp.png',
        'http': 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png'
    };
    for (const [key, icon] of Object.entries(typeIcons)) {
        if (resource.includes(key)) return icon;
    }
    return 'https://cdn-icons-png.flaticon.com/512/2965/2965335.png'; // Default document icon
}