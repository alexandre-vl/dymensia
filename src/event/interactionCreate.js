const { Collection } = require("discord.js");

module.exports = async (client, interaction) => {
  if (interaction.isCommand() || interaction.isContextMenu()) {
    if (!interaction.guild) return;
    if (!client.slash.has(interaction.commandName)) return;

    const command = client.slash.get(interaction.commandName);
    try {
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = command.cooldown || 2 * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({
            content: `Wait ${timeLeft.toFixed(1)} more second${
              timeLeft.toFixed(1) < 2 ? "" : "s"
            } to use **${command.name}**`,
            ephemeral: true,
          });
        }
      }
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      if (command.permissions) {
        if (!interaction.member.permissions.has(command.permissions)) {
          return interaction.reply({
            content: `You're missing permissions : ${command.permissions
              .map((p) => `**${p}**`)
              .join(", ")}`,
            ephemeral: true,
          });
        }
      }
      command.run(client, interaction);
    } catch (e) {
      console.log(e);
      await interaction.reply({
        content: client.language.ERROR,
        ephemeral: true,
      });
    }
  }

  if (interaction.isSelectMenu()) {
    ////// COMMAND HELP ///////
    let choices = {
      squad: [
        "`squad create <name>` ➜ Créer une escouade",
        "`squad delete` ➜ Supprime votre escouade",
        "`squad rename <new-name>` ➜ Renomme votre escouade",
        "`squad info` ➜ Voir les informations de votre escouade",
        "`squad invite <membre>` ➜ Invite un membre dans l'escouade",
        "`squad setrole <role> <membre>` ➜ Change le rôle d'un membre de l'escouade",
        "`squad join <name/id>` ➜ Rejoindre une escouade public",
        "`squad leave ` ➜ Permet de quitter son escouade",
        "`squad kick <membre>` ➜ Permet de kick un membre de son escouade",
        "`squad list` ➜ Voir la liste des escouades",
        "`squad panel` ➜ Gère l'escouade à partir du panel",
      ],
      coalition: [],
      economie: [],
      xp: [],
      event: [],
      dons: [],
      utils: [],
    };

    if (
      [
        "squad",
        "coalition",
        "economie",
        "xp",
        "event",
        "dons",
        "utils",
      ].includes(interaction.values[0])
    )
      interaction.reply({
        ephemeral: true,
        embeds: [
          {
            title: "🔮 Liste des commandes",
            description: `Catégorie: \`${interaction.values[0]}\`\n
                ${choices[interaction.values[0]].join("\n")}
                `,
            color: client.config.globalColor,
            thumbnail: { url: interaction.guild.iconURL() },
            footer: {
              text: "Dymensia ・ Made with ❤️",
              icon_url: client.user.displayAvatarURL(),
            },
          },
        ],
      });
  }
  require("../functions/panels/panelSquadEvent.js")(interaction);
  require("../functions/panels/panelRolesEvent.js")(interaction);
  require("../functions/panels/panelMembersEvent.js")(interaction);
};
