const Squad = require("../global/Squad.js");
const User = require("../global/User.js");
const db = require("quick.db");
const embeds = require("../global/embeds.js");
const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = (client, message, args) => {
  let member = message.mentions.users.first();
  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!member)
    return message.channel.send(
      embeds.error("`❌` Veuillez préciser le membre à kick")
    );

  if (!User.get(message.author.id))
    db.push("users", new User(message.author.id));
  if (!User.get(member.id)) db.push("users", new User(member.id));

  let users = db.get("users");
  let squads = db.get("squads");
  let user = User.get(member.id);
  let squad = Squad.get(user.squad);

  if (
    !squad.roles
      .find(
        (r) => r.id == squad.members.find((m) => m.id == message.author.id).role
      )
      .permission.includes("KICK_MEMBERS")
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas la permission requise pour faire ceci")
    );

  if (
    User.get(member.id).squad == null ||
    !Squad.get(User.get(member.id).squad) ||
    !Squad.get(User.get(member.id).squad).members.find(
      (m) => m.id == message.author.id
    )
  )
    return message.channel.send(
      embeds.error("`❌` Ce membre n'a pas d'escouade")
    );

  if (
    Squad.get(User.get(member.id).squad) &&
    Squad.get(User.get(member.id).squad).leader == member.id
  )
    return message.channel.send(
      embeds.error("`❌` Vous ne pouvez pas kick le leader")
    );

  message.channel.send({
    embeds: [
      {
        author: { name: "💥 Kick escouade" },
        description: `Vous venez de kick \`${member.username}\` de l'escouade.`,
        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });

  user.squad = null;
  users.splice(users.indexOf(users.find((u) => u.id == user.id)), 1, user);
  db.set("users", users);
  squad.members.splice(
    squad.members.indexOf(squad.members.find((m) => m.id == member.id)),
    1
  );
  squads.splice(squads.indexOf(squads.find((u) => u.id == squad.id)), 1, squad);
  db.set("squads", squads);
};
