const Squad = require("../global/Squad.js");
const User = require("../global/User.js");
const db = require("quick.db");
const embeds = require("../global/embeds.js");
const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = (client, message, args) => {
  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!User.get(message.author.id)) db.push("users", new User(member.id));

  if (
    User.get(message.author.id).squad !== null &&
    Squad.get(User.get(message.author.id).squad)
  )
    return message.channel.send(
      embeds.error("`❌` Vous avez déjà une escouade")
    );

  let squad = Squad.get(args) || db.get("squads").find((s) => s.name == args);
  if (!squad)
    return message.channel.send(
      embeds.error("`❌` Cette escouade n'existe pas")
    );
  if (!squad.public)
    return message.channel.send(
      embeds.error("`❌` Cette escouade n'est pas public")
    );

  let squads = db.get("squads");
  let users = db.get("users");
  let user = User.get(message.author.id);
  user.squad = squad.id;
  squad.members.push({
    id: message.author.id,
    username: message.author.username,
    role: squad.roles.find((r) => r.default).id,
  });
  squads.splice(squads.indexOf(squads.find((s) => s.id == squad.id)), 1, squad);
  users.splice(users.indexOf(users.find((u) => u.id == user.id)), 1, user);
  db.set("squads", squads);
  db.set("users", users);

  message.channel.send({
    embeds: [
      {
        description:
          "`🏆` Vous venez de rejoindre l'escouade `" + squad.name + "`",
        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });
};
