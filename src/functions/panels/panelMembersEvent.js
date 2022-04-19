const db = require("quick.db");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { client } = require("../../../index.js");
const id = require("../global/randomId.js");
const { messagecolor } = require("../../utils/color.js");
module.exports = async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId == "panel_members_kick") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );

      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");
      const selectrole = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select_members_kick")
          .setPlaceholder("Choisis le membre à kick")
          .addOptions([
            squad.members.map((r) => {
              return {
                label: r.username + " (" + r.id + ")",
                description: "Clique-moi",
                value: r.id,
              };
            }),
          ])
      );

      interaction.reply({
        ephemeral: true,
        content: `\`💢\` Veuillez préciser le rôle membre à kick`,
        components: [selectrole],
      });
    }
    if (interaction.customId == "panel_members_role") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");

      const selectmembre = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select_members_role")
          .setPlaceholder("Choisis le membre")
          .addOptions([
            squad.members.map((r) => {
              return {
                label: r.username + " (" + r.id + ")",
                description: "Clique-moi",
                value: r.id,
              };
            }),
          ])
      );

      interaction.reply({
        ephemeral: true,
        content: "`🔮` Veuillez préciser le membre",
        components: [selectmembre],
      });
    }
  }

  if (interaction.isSelectMenu()) {
    if (interaction.customId == "select_members_kick") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");
      let user = squad.members.find((m) => m.id == interaction.values[0]);
      if (!user)
        return interaction.reply(
          "`❌` Ce membre n'est plus dans votre escouade"
        );

      squad.members.splice(
        squad.members.indexOf(
          squad.members.find((m) => m.id == interaction.values[0])
        ),
        1
      );
      squads.splice(
        squads.indexOf(squads.find((s) => s.id == squad.id)),
        1,
        squad
      );
      db.set("squads", squads);

      interaction.reply({
        ephemeral: true,
        content: `\`💢\` Vous venez d'expulser \`${user.username}\``,
      });
    }

    if (interaction.customId == "select_members_role") {
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.reply("`❌` Impossible de trouver l'escouade");
      let user = squad.members.find((m) => m.id == interaction.values[0]);
      if (!user)
        return interaction.reply(
          "`❌` Ce membre n'est plus dans votre escouade"
        );

      const selectrole = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select_members_role2")
          .setPlaceholder("Choisis le rôle")
          .addOptions([
            squad.roles.map((r) => {
              return {
                label: r.name + " (" + r.id + ")",
                description: "Clique-moi",
                value: r.id + "-" + user.id,
              };
            }),
          ])
      );

      interaction.reply({
        ephemeral: true,
        embeds: [
          {
            description: "`🦺` Veuillez maintenant préciser le rôle à donner",
            footer: { text: interaction.values[0] },
            color: client.config.globalColor,
          },
        ],
        components: [selectrole],
      });
    }
    if (interaction.customId == "select_members_role2") {
      await interaction.deferUpdate();
      let squads = db.get("squads");
      let squad = squads.find(
        (s) =>
          s.id == db.get("users").find((u) => u.id == interaction.user.id).squad
      );
      if (!squad)
        return interaction.editReply("`❌` Impossible de trouver l'escouade");

      let user = squad.members.find(
        (m) => m.id == interaction.values[0].split("-")[1]
      );
      if (!user)
        return interaction.editReply(
          "`❌` Ce membre n'est plus dans votre escouade"
        );
      let role = squad.roles.find(
        (r) => r.id == interaction.values[0].split("-")[0]
      );
      if (!role)
        return interaction.editReply(
          "`❌` Ce rôle n'est plus disponible votre escouade"
        );
      if (
        role.leader &&
        squad.members.find((m) => m.id == interaction.user.id).role != role.id
      ) {
        return interaction.editReply(
          "`❌` Vous ne pouvez pas transférer la propriété de l'escouade."
        );
      }
      if (
        role.leader &&
        squad.members.find((m) => m.id == interaction.user.id).role == role.id
      ) {
        squad.members.find(
          (m) => m.id == interaction.user.id
        ).role = squad.roles.find((r) => r.default).id;
        squad.leader = user.id;
      }

      user.role = interaction.values[0].split("-")[0];
      squad.members.splice(
        squad.members.indexOf(squad.members.find((m) => m.id == user.id)),
        1,
        user
      );

      squads.splice(
        squads.indexOf(squads.find((s) => s.id == squad.id)),
        1,
        squad
      );
      db.set("squads", squads);

      await interaction.message.channel.send({
        content: "`✅` Vous venez de changer le rôle du membre.",
      });
    }
  }
};
