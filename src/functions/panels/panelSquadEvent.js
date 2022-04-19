const db = require("quick.db");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const { client } = require("../../../index.js");
module.exports = (interaction) => {
  if (interaction.isButton()) {
    if (interaction.message.embeds[0].footer.text == interaction.user.id) {
      if (interaction.customId == "panel_rename") {
        let squads = db.get("squads");
        let squad =
          squads.find((s) => s.name == interaction.message.embeds[0].title) ||
          squads.find((s) => s.id == interaction.message.embeds[0].title);
        if (!squad)
          return interaction.reply("`❌` Impossible de trouver l'escouade");

        interaction
          .reply({
            ephemeral: true,
            content: `\`🔖\` Veuillez préciser ci-dessous le nouveau nom de l'escouade`,
          })
          .then(() => {
            let filter = (m) => interaction.user.id === m.author.id;
            const collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            });
            collector.on("collect", (m) => {
              m.delete();
              squad.name = m.content;
              squads.splice(
                squads.indexOf(squads.find((s) => s.id == squad.id)),
                1,
                squad
              );
              db.set("squads", squads);
              interaction.editReply({
                content:
                  "`✅` Vous venez de changer le nom de l'escouade en `" +
                  m.content +
                  "`.",
              });
              collector.stop();
            });

            collector.on("end", (collected, reason) => {
              if (reason == "limit" || reason == "user") return;

              interaction.editReply({
                ephemeral: true,
                content: "`❌` Fin du changement",
              });
            });
          });
      }
      if (interaction.customId == "panel_privacy") {
        let squads = db.get("squads");
        let squad =
          squads.find((s) => s.name == interaction.message.embeds[0].title) ||
          squads.find((s) => s.id == interaction.message.embeds[0].title);
        console.log(squads);
        if (!squad)
          return interaction.reply("`❌` Impossible de trouver l'escouade");
        if (squad.public) {
          squad.public = false;
          squads.splice(
            squads.indexOf(squads.find((s) => s.id == squad.id)),
            1,
            squad
          );
          interaction.reply({
            ephemeral: true,
            content: `\`🔒\` Votre escouade est désormais privée.`,
          });
        } else {
          squad.public = true;
          squads.splice(
            squads.indexOf(squads.find((s) => s.id == squad.id)),
            1,
            squad
          );
          interaction.reply({
            ephemeral: true,
            content: `\`🔓\` Votre escouade est désormais public`,
          });
        }
        db.set("squads", squads);
      }
      if (interaction.customId == "panel_desc") {
        let squads = db.get("squads");
        let squad =
          squads.find((s) => s.name == interaction.message.embeds[0].title) ||
          squads.find((s) => s.id == interaction.message.embeds[0].title);
        if (!squad)
          return interaction.reply("`❌` Impossible de trouver l'escouade");

        interaction
          .reply({
            ephemeral: true,
            content: `\`🎈\` Veuillez préciser ci-dessous la nouvelle description`,
          })
          .then(() => {
            let filter = (m) => interaction.user.id === m.author.id;
            const collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 60000,
              errors: ["time"],
            });
            collector.on("collect", (m) => {
              m.delete();
              squad.description = m.content;
              squads.splice(
                squads.indexOf(squads.find((s) => s.id == squad.id)),
                1,
                squad
              );
              db.set("squads", squads);
              interaction.editReply({
                content:
                  "`✅` Vous venez de changer la description de l'escouade en `" +
                  m.content +
                  "`.",
              });
              collector.stop();
            });

            collector.on("end", (collected, reason) => {
              if (reason == "limit" || reason == "user") return;

              interaction.editReply({
                ephemeral: true,
                content: "`❌` Fin du changement",
              });
            });
          });
      }
      if (interaction.customId == "panel_image") {
        let squads = db.get("squads");
        let squad =
          squads.find((s) => s.name == interaction.message.embeds[0].title) ||
          squads.find((s) => s.id == interaction.message.embeds[0].title);
        if (!squad)
          return interaction.reply("`❌` Impossible de trouver l'escouade");

        interaction
          .reply({
            ephemeral: true,
            content: `\`🎨\` Veuillez préciser le lien de l'image direct (ex: https://i.imgur.com/50w0rMh.png)`,
          })
          .then(() => {
            let filter = (m) => interaction.user.id === m.author.id;
            const collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            });
            collector.on("collect", (m) => {
              if (!m.content.startsWith("https://"))
                interaction.editReply({
                  content:
                    "`🎨` Image invalide, veuillez préciser un lien direct (ex: https://i.imgur.com/50w0rMh.png)",
                });
              m.delete();
              squad.pp = m.content;
              squads.splice(
                squads.indexOf(squads.find((s) => s.id == squad.id)),
                1,
                squad
              );
              db.set("squads", squads);
              interaction.editReply({
                content:
                  "`✅` Vous venez de changer la photo de profil de l'escouade en : " +
                  m.content,
              });
              collector.stop();
            });

            collector.on("end", (collected, reason) => {
              if (reason == "limit" || reason == "user") return;

              interaction.editReply({
                ephemeral: true,
                content: "`❌` Fin du changement",
              });
            });
          });
      }
      if (interaction.customId == "panel_roles") {
        let squads = db.get("squads");
        let squad =
          squads.find((s) => s.name == interaction.message.embeds[0].title) ||
          squads.find((s) => s.id == interaction.message.embeds[0].title);
        if (!squad)
          return interaction.reply("`❌` Impossible de trouver l'escouade");

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("panel_role_add")
            .setLabel("➕")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("panel_role_remove")
            .setLabel("➖")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("panel_role_rename")
            .setLabel("🔖")
            .setStyle("PRIMARY")
        );

        interaction.reply({
          ephemeral: true,
          embeds: [
            {
              title: squad.name,
              description: `\`💻\` Panel Rôles:

          \`➕\` ➜ Créer un rôle
          \`➖\` ➜ Supprimer un rôle
          \`🔖\` ➜ Renomme l'escouade
    `,
              color: client.config.globalColor,
              footer: {
                text: "Dymensia ・ Made with ❤️",
                icon_url: interaction.message.guild.iconURL,
              },
            },
          ],
          components: [row],
        });
      }
    }
    if (interaction.customId == "panel_members") {
      let squads = db.get("squads");
      let squad =
        squads.find((s) => s.name == interaction.message.embeds[0].title) ||
        squads.find((s) => s.id == interaction.message.embeds[0].title);
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("panel_members_kick")
          .setLabel("💢")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("panel_members_role")
          .setLabel("🦺")
          .setStyle("PRIMARY")
      );

      interaction.reply({
        ephemeral: true,
        embeds: [
          {
            title: squad.name,
            description: `\`💻\` Panel Membres:

          \`💢\` ➜ Kick un membre
          \`🦺\` ➜ Gérer le rôle des membres
          `,
            color: client.config.globalColor,
            footer: {
              text: "Dymensia ・ Made with ❤️",
              icon_url: interaction.message.guild.iconURL,
            },
          },
        ],
        components: [row],
      });
    }
  }
};
