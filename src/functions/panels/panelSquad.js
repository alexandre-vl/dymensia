const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js");
const ranks = require("../../data/ranks.json");
const { client } = require("../../../index.js");
const panelSquadEvent = require("./panelSquadEvent.js");
module.exports = (message, squadId) => {
  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!User.get(message.author.id))
    db.push("users", new User(message.author.id));

  if (
    User.get(message.author.id).squad == null ||
    !Squad.get(User.get(message.author.id).squad) ||
    !Squad.get(User.get(message.author.id).squad).members.find(
      (m) => m.id == message.author.id
    )
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas encore d'escouade")
    );
  let squads = db.get("squads");
  let squad =
    Squad.get(squadId) ||
    squads.find((s) => s.name == squadId) ||
    Squad.get(User.get(message.author.id).squad);
  if (!squad) {
    return message.channel.send(
      embeds.error("`❌` Cette escouade n'existe pas")
    );
  }
  let role = squad.roles.find(
    (r) => r.id == squad.members.find((m) => m.id == message.author.id).role
  ) || {
    permission: [
      "CREATE_TAXES",
      "MANAGE_ROLES",
      "MANAGE_MEMBERS",
      "KICK_MEMBERS",
      "INVITE_MEMBERS",
      "MANAGE_SQUAD",
      "WITHDRAW_MONEY",
    ],
  };

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("panel_rename")
      .setLabel("🔖")
      .setStyle("PRIMARY")
      .setDisabled(!role.permission.includes("MANAGE_SQUAD")),
    new MessageButton()
      .setCustomId("panel_privacy")
      .setLabel("🔐")
      .setStyle("PRIMARY")
      .setDisabled(!role.permission.includes("MANAGE_SQUAD")),
    new MessageButton()
      .setCustomId("panel_desc")
      .setLabel("🎈")
      .setStyle("PRIMARY")
      .setDisabled(!role.permission.includes("MANAGE_SQUAD")),
    new MessageButton()
      .setCustomId("panel_image")
      .setLabel("🎨")
      .setStyle("PRIMARY")
      .setDisabled(!role.permission.includes("MANAGE_SQUAD"))
  );
  const row2 = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("panel_roles")
      .setLabel("🦺")
      .setStyle("PRIMARY")
      .setDisabled(!role.permission.includes("MANAGE_ROLES")),
    new MessageButton()
      .setCustomId("panel_members")
      .setLabel("🔮")
      .setStyle("PRIMARY")
      .setDisabled(!role.permission.includes("MANAGE_ROLES"))
  );
  message.channel.send({
    embeds: [
      {
        title: squad.name,
        description: `\`💻\` Panel d'escouade:

      \`🔖\` ➜ Renomme l'escouade
      \`🔐\` ➜ Change la confidentialité de l'escouade
      \`🎈\` ➜ Change la description de l'escouade
      \`🎨\` ➜ Change photo de profil de l'escouade
      \`🦺\` ➜ Gérer les rôles de l'escouade
      \`🔮\` ➜ Gérer les membres de l'escouade
    `,
        color: client.config.globalColor,
        footer: {
          text: message.author.id,
          icon_url: message.guild.iconURL,
        },
      },
    ],
    components: [row, row2],
  });
};
