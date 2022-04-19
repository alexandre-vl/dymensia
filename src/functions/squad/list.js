const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js");
const ranks = require("../../data/ranks.json");
module.exports = (client, message, args) => {
  let squadName = args;
  let member = message.mentions.users.first();
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

  let user = User.get(message.author.id);
  let squad =
    Squad.get(User.get(member?.id)?.squad) ||
    db.get("squads").find((s) => s.name == squadName) ||
    Squad.get(user.squad);

  message.channel.send({
    embeds: [
      {
        title: "🟢",
        description: "test",

        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });
};
