const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const issuesFilePath = path.join(__dirname, "..", "..", "db_json", "issues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("issues")
        .setDescription("🎯 Creates a new issue channel under the specified category.")
        .addRoleOption((option) =>
            option.setName("role")
                .setDescription("Role related to the issue")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("issue")
                .setDescription("Description of the issue")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option.setName("assignee")
                .setDescription("User assigned to the issue")
                .setRequired(false)
        ),

    async execute(interaction) {
        const role = interaction.options.getRole("role");
        const issueDescription = interaction.options.getString("issue");
        const assignee = interaction.options.getUser("assignee");
        const roleId = "1306127819360829450";

        // Permission check with fancy embed
        if (!interaction.member.roles.cache.has(roleId)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle("⛔ Access Denied")
                .setDescription("You don't have the required permissions to create issues.")
                .setColor("#FF0000")
                .setFooter({ text: "Please contact an administrator for access." })
                .setTimestamp();
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const category = interaction.guild.channels.cache.find(
            (channel) => channel.type === 4 && channel.name.toLowerCase() === role.name.toLowerCase()
        );

        if (!category) {
            const noCategoryEmbed = new EmbedBuilder()
                .setTitle("🔍 Category Not Found")
                .setDescription(`Unable to find a category for role: ${role.name}`)
                .setColor("#FFA500")
                .setFooter({ text: "Please ensure the category exists and matches the role name." })
                .setTimestamp();
            return await interaction.reply({ embeds: [noCategoryEmbed], ephemeral: true });
        }

        try {
            // Create channel
            const newChannel = await interaction.guild.channels.create({
                name: `issue-${issueDescription.slice(0, 20)}`,
                type: 0,
                parent: category.id,
                topic: `Issue related to ${role.name}: ${issueDescription}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: role.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });

            // Handle JSON operations
            let issues = [];
            try {
                const data = fs.readFileSync(issuesFilePath, "utf-8");
                issues = JSON.parse(data);
            } catch (error) {
                console.error("Error reading issues file:", error);
            }

            const lastId = issues.reduce((maxId, issue) => Math.max(maxId, parseInt(issue.id)), 0);
            const newId = (lastId + 1).toString();

            const issueData = {
                id: newId,
                title: `Issue for ${role.name}`,
                description: issueDescription,
                status: "open",
                assignedTo: assignee ? assignee.id : null,
                progress: "",
                resources: [],
                createdAt: new Date().toISOString(),
                createdBy: interaction.user.id,
            };

            issues.push(issueData);
            fs.writeFileSync(issuesFilePath, JSON.stringify(issues, null, 2), "utf-8");

            // Create success embed
            const successEmbed = new EmbedBuilder()
                .setTitle("🎉 New Issue Created Successfully!")
                .setColor("#00FF00")
                .setDescription(`Issue channel has been created: <#${newChannel.id}>`)
                .addFields(
                    {
                        name: "📋 Issue Details",
                        value: `\`\`\`${issueDescription}\`\`\``,
                        inline: false
                    },
                    {
                        name: "🎯 Category",
                        value: category.name,
                        inline: true
                    },
                    {
                        name: "👥 Role",
                        value: role.toString(),
                        inline: true
                    },
                    {
                        name: "🆔 Issue ID",
                        value: `#${newId}`,
                        inline: true
                    },
                    {
                        name: "👤 Created By",
                        value: interaction.user.toString(),
                        inline: true
                    },
                    {
                        name: "📌 Assigned To",
                        value: assignee ? assignee.toString() : "Unassigned",
                        inline: true
                    }
                )
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({
                    text: `Issue Tracking System • ID: ${newId}`,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            // Send initial message in the new channel
            const channelEmbed = new EmbedBuilder()
                .setTitle("📢 New Issue Opened")
                .setColor("#3498db")
                .setDescription(issueDescription)
                .addFields(
                    {
                        name: "🎯 Status",
                        value: "Open",
                        inline: true
                    },
                    {
                        name: "📊 Progress",
                        value: "0%",
                        inline: true
                    },
                    {
                        name: "👥 Assigned Team",
                        value: role.toString(),
                        inline: true
                    }
                )
                .setFooter({
                    text: `Issue #${newId} • Use /builder commands to manage this issue`
                })
                .setTimestamp();

            await newChannel.send({ embeds: [channelEmbed] });
            await interaction.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error("Error:", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("⚠️ Error")
                .setDescription("An error occurred while creating the issue channel.")
                .setColor("#FF0000")
                .addFields({
                    name: "Error Details",
                    value: `\`\`\`${error.message}\`\`\``
                })
                .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};