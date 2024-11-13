const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("issues")
    .setDescription("Creates a new issue channel under the specified category.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role related to the issue")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("issue")
        .setDescription("Description of the issue")
        .setRequired(true)
    ),

  async execute(interaction) {
    // Get the role and issue parameters
    const role = interaction.options.getRole("role");
    const issue = interaction.options.getString("issue");

    // Check if the interaction user has permission to manage channels
    const roleId = "1306127819360829450"; // Replace with the ID of the specific role you want to check

    if (!interaction.member.roles.cache.has(roleId)) {
      return await interaction.reply({
        content: "You do not have permission to raise issues",
        ephemeral: true,
      });
    }

    // Find the category that corresponds to the role name
    const category = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === 4 &&
        channel.name.toLowerCase() === role.name.toLowerCase()
    );

    if (!category) {
      return await interaction.reply({
        content: `No category found for the role ${role.name}.`,
        ephemeral: true,
      });
    }

    try {
      // Create a new text channel under the specified category
      const newChannel = await interaction.guild.channels.create({
        name: `issue-${issue}`,
        type: 0, // 0 for text channel
        parent: category.id,
        topic: `Issue related to ${role.name}: ${issue}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone, // Deny access for everyone by default
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: role.id, // Allow access for the specified role
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      // Respond to the interaction
      await interaction.reply(
        `Channel <#${newChannel.id}> created under category ${category.name} for the issue: ${issue}`
      );
    } catch (error) {
      console.error("Error creating channel:", error);
      await interaction.reply({
        content: "There was an error creating the issue channel.",
        ephemeral: true,
      });
    }
  },
};
