const db = require("quick.db");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { client } = require("../../../index.js");
const id = require("../global/randomId.js");
module.exports = (interaction) => {
  if (interaction.isButton()) {
    console.log(interaction.message.embeds[0].footer.text);

    if (interaction.customId == "panel_role_rename") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );

      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");

      const selectrole = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select_role")
          .setPlaceholder("Choisis le rôle")
          .addOptions([
            squad.roles.map((r) => {
              return {
                label: r.name,
                description: "Clique-moi",
                value: r.id,
              };
            }),
          ])
      );

      interaction.reply({
        ephemeral: true,
        content: `\`🔖\` Veuillez préciser ci-dessous le rôle à renommer`,
        components: [selectrole],
      });
    }

    if (interaction.customId == "panel_role_add") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );

      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");
      const selectrole = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select_role")
          .setPlaceholder("Choisis les permissions")
          .setMinValues(1)
          .setMaxValues(squad.roles.find((r) => r.leader).permission.length)
          .addOptions([
            squad.roles
              .find((r) => r.leader)
              .permission.map((r) => {
                return {
                  label: r,
                  description: "Clique-moi",
                  value: r,
                };
              }),
          ])
      );

      interaction.reply({
        ephemeral: true,
        content: `\`🎯\` Veuillez préciser les permissions du rôle`,
        components: [selectrole],
      });
    }
    if (interaction.customId == "panel_role_remove") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );

      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");
      const selectrole = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select_role_delete")
          .setPlaceholder("Choisis le rôle à supprimer")
          .addOptions([
            squad.roles.map((r) => {
              return {
                label: r.name,
                description: "Clique-moi",
                value: r.id,
              };
            }),
          ])
      );

      interaction.reply({
        ephemeral: true,
        content: `\`💥\` Veuillez préciser le rôle à supprimer`,
        components: [selectrole],
      });
    }
  }

  /////////////////////////////////
  /////////////////////////////////

  if (interaction.isSelectMenu()) {
    if (interaction.customId == "select_role_delete") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");
      squad.roles.splice(
        squad.roles.indexOf(
          squad.roles.find((r) => r.id == interaction.values[0])
        ),
        1
      );
      squads.splice(
        squads.indexOf(squads.find((s) => s.id == squad.id)),
        1,
        squad
      );
      db.set("squads", squads);
      console.log(squad.roles);
      interaction.reply({
        ephemeral: true,
        content: "`❌` Vous venez de supprimer le rôle",
      });
    }
    if (interaction.customId == "select_permission") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");

      interaction
        .reply({
          ephemeral: true,
          content: `\`🎐\` Veuillez préciser ci-dessous le nom du rôle`,
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
            squad.roles.push({
              id: id(6, "roles"),
              name: m.content,
              permission: interaction.values,
            });
            squads.splice(
              squads.indexOf(squads.find((s) => s.id == squad.id)),
              1,
              squad
            );
            db.set("squads", squads);
            console.log(squad.roles);
            interaction.editReply({
              content: "`✅` Vous venez de créer le rôle : `" + m.content + "`",
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
    if (interaction.customId == "select_role") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");

      let role = squad.roles.find((role) => role.id == interaction.values[0]);
      console.log(role, squad);
      interaction
        .reply({
          ephemeral: true,
          content: `\`🔖\` Veuillez préciser ci-dessous le nouveau nom du rôle`,
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
            role.name = m.content;
            squad.roles.splice(
              squad.roles.indexOf(squad.roles.find((r) => r.id == role.id)),
              1,
              role
            );
            squads.splice(
              squads.indexOf(squads.find((s) => s.id == squad.id)),
              1,
              squad
            );
            db.set("squads", squads);
            interaction.editReply({
              content:
                "`✅` Vous venez de changer le nom du role en : " + role.name,
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
  }
};
