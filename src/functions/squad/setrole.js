const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js");

module.exports = (client, message, args) => {
  let member = message.mentions.users.first();
  let roleName = args.split(" ")[0];

  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

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

  if (!member)
    return message.channel.send(
      embeds.error("`❌` Veuillez mentionner un membre")
    );

  if (!User.get(member.id)) db.push("users", new User(member.id));
  if (!User.get(message.author.id)) db.push("users", new User(member.id));

  if (!roleName) {
    return message.channel.send("`❌` Veuillez préciser le nom du rôle");
  }

  if (
    User.get(member.id).squad !== null &&
    User.get(member.id).squad !== User.get(message.author.id).squad
  )
    return message.channel.send(
      "`❌` Ce membre n'est pas dans la même escouade que vous"
    );
  let user = User.get(message.author.id);
  let squads = db.get("squads");
  let squad = Squad.get(user.squad);
  if (
    !squad.roles
      .find(
        (r) => r.id == squad.members.find((m) => m.id == message.author.id).role
      )
      .permission.includes("MANAGE_ROLES")
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas la permission requise pour faire ceci")
    );

  let role = squad.roles.find((r) => r.name == roleName);
  if (!role)
    return message.channel.send(
      embeds.error("`❌` Ce rôle n'existe pas dans cette escouade")
    );

  let memberInSquad = squad.members.find((m) => m.id == member.id);

  if (
    role.leader &&
    squad.members.find((m) => m.id == message.author.id).role != role.id
  ) {
    return message.channel.send(
      embeds.error(
        "`❌` Vous ne pouvez pas transférer la propriété de l'escouade."
      )
    );
  }
  if (
    role.leader &&
    squad.members.find((m) => m.id == message.author.id).role == role.id
  ) {
    squad.members.find(
      (m) => m.id == message.author.id
    ).role = squad.roles.find((r) => r.default).id;
    squad.leader = message.author.id;
  }

  memberInSquad.role = role.id;
  squad.members.splice(
    squad.members.indexOf(squad.members.find((m) => m.id == memberInSquad.id)),
    1,
    memberInSquad
  );

  squads.splice(
    squads.indexOf(squads.find((squad) => squad.id == squad.id)),
    1,
    squad
  );
  db.set("squads", squads);

  message.channel.send({
    embeds: [
      {
        author: { name: "🎭 Changement de rôle" },
        description: `Vous venez de changer le rôle de \`${member.tag}\` en \`${roleName}\``,
        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });
};
