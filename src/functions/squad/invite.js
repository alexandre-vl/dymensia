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
      embeds.error("`❌` Veuillez mentionner le membre")
    );

  if (!User.get(member.id)) db.push("users", new User(member.id));
  if (!User.get(message.author.id)) db.push("users", new User(member.id));

  if (
    User.get(message.author.id).squad == null ||
    !Squad.get(User.get(message.author.id).squad)
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas encore d'escouade")
    );

  if (
    User.get(member.id).squad !== null &&
    User.get(member.id).squad == User.get(message.author.id).squad
  )
    return message.channel.send(
      embeds.error("`❌` Cet utilisateur est déjà dans votre escouade")
    );
  let squad = Squad.get(User.get(message.author.id).squad);
  console.log(
    squad,
    squad.members.find((m) => m.id == message.author.id)
  );
  if (
    !squad.roles
      .find(
        (r) => r.id == squad.members.find((m) => m.id == message.author.id).role
      )
      .permission.includes("INVITE_MEMBERS")
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas la permission requise pour faire ceci")
    );

  if (member.id == message.member.id)
    return message.channel.send(
      embeds.error("`❌` Vous ne pouvez pas faire ceci à cet utilisateur")
    );

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("accept")
      .setLabel("✅")
      .setStyle("SUCCESS"),
    new MessageButton().setCustomId("decline").setLabel("🚫").setStyle("DANGER")
  );

  member
    .send({
      embeds: [
        {
          title: "📨 Invitation",
          description: `> Vous venez de recevoir une invitation de la part de \`${
            message.author.tag
          }\` pour rejoindre son escouade nommé \`${
            Squad.get(User.get(message.author.id).squad).name
          }\`.
        
        > Voulez-vous accepter l'invitation ?
                `,
          color: client.config.globalColor,
          footer: {
            text: "Dymensia ・ Made with ❤️",
            icon_url: message.guild.iconURL,
          },
        },
      ],
      components: [row],
    })
    .then((m) => {
      const filter = (i) => {
        return (
          ["accept", "decline"].includes(i.customId) && i.message.id === m.id
        );
      };

      const collector = m.channel.createMessageComponentCollector({
        filter,
        time: 60000,
        max: 1,
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "accept":
            let squads = db.get("squads");
            let users = db.get("users");
            let squad = Squad.get(User.get(message.author.id).squad);
            let user = User.get(member.id);
            user.squad = squad.id;
            squad.members.push({
              id: member.id,
              username: member.username,
              role: squad.roles.find((r) => r.default).id,
            });
            squads.splice(
              squads.indexOf(squads.find((s) => s.id == squad.id)),
              1,
              squad
            );
            users.splice(
              users.indexOf(users.find((u) => u.id == user.id)),
              1,
              user
            );
            db.set("squads", squads);
            db.set("users", users);

            i.reply({
              embeds: [
                {
                  description:
                    "`🎈` Vous venez d'accepter l'invitation !\n Bienvenue dans l'escouade !",
                  color: client.config.globalColor,
                  footer: {
                    text: "Dymensia ・ Made with ❤️",
                    icon_url: message.guild.iconURL,
                  },
                },
              ],
            });
            break;
          case "decline":
            i.reply({
              embeds: [
                {
                  description: "`🚫` Vous venez de décliner l'invitation...",
                  color: client.config.globalColor,
                  footer: {
                    text: "Dymensia ・ Made with ❤️",
                    icon_url: message.guild.iconURL,
                  },
                },
              ],
            });
            break;
        }
      });
    });

  message.channel.send({
    embeds: [
      {
        description:
          "`📨` Invitation dans l'escouade bien envoyée à `" + member.tag + "`",
        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });
};
