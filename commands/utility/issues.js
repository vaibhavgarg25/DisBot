const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Path to the issues.json file
const issuesFilePath = path.join(__dirname, "..", "..", "db_json", "issues.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("issues")
    .setDescription("Creates a new issue channel under the specified category.")
    .addRoleOption((option) =>
      option.setName("role").setDescription("Role related to the issue").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("issue").setDescription("Description of the issue").setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("assignee").setDescription("User assigned to the issue").setRequired(false) // Optional assignee
    ),

  async execute(interaction) {
    // Get the role and issue parameters
    const role = interaction.options.getRole("role");
    const issueDescription = interaction.options.getString("issue");

    // Get the assignee (if provided)
    const assignee = interaction.options.getUser("assignee");

    // Check if the interaction user has permission to raise issues
    const roleId = "1306127819360829450"; // Replace with the ID of the specific role you want to check

    if (!interaction.member.roles.cache.has(roleId)) {
      return await interaction.reply({
        content: "You do not have permission to raise issues",
        ephemeral: true,
      });
    }

    // Find the category that corresponds to the role name
    const category = interaction.guild.channels.cache.find(
      (channel) => channel.type === 4 && channel.name.toLowerCase() === role.name.toLowerCase()
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
        name: `issue-${issueDescription.slice(0, 20)}`, // Limit name length
        type: 0, // 0 for text channel
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

      // Read the current issues from the file
      let issues = [];
      try {
        const data = fs.readFileSync(issuesFilePath, "utf-8");
        issues = JSON.parse(data);
      } catch (error) {
        console.error("Error reading issues file:", error);
      }

      // Find the highest current ID and increment it
      const lastId = issues.reduce((maxId, issue) => Math.max(maxId, parseInt(issue.id)), 0);
      const newId = (lastId + 1).toString();

      // Add the new issue with incremented ID and optional assignee
      const issueData = {
        id: newId,
        title: `Issue for ${role.name}`,
        description: issueDescription,
        status: "open",
        assignedTo: assignee ? assignee.id : null, // Use assignee if provided, else set to null
        progress: "",
        resources: [],
      };

      // Append the new issue to the list
      issues.push(issueData);

      // Write the updated issues back to the file
      fs.writeFileSync(issuesFilePath, JSON.stringify(issues, null, 2), "utf-8");

      // Respond to the interaction
      await interaction.reply(
        `Channel <#${newChannel.id}> created under category ${category.name} for the issue: ${issueDescription}`
      );
    } catch (error) {
      console.error("Error creating channel or updating JSON:", error);
      await interaction.reply({
        content: "There was an error creating the issue channel.",
        ephemeral: true,
      });
    }
  },
};