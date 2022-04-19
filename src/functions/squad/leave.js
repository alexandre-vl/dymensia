const Squad = require("../global/Squad.js");
const User = require("../global/User.js");
const db = require("quick.db");
const embeds = require("../global/embeds.js");
const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = (client, message, args) => {
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

  if (
    Squad.get(User.get(message.author.id).squad) &&
    Squad.get(User.get(message.author.id).squad).leader == message.author.id
  )
    return message.channel.send(
      embeds.error(
        "`❌` Vous ne pouvez pas leave votre escouade en tant que leader!"
      )
    );

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("accept")
      .setLabel("✅")
      .setStyle("SUCCESS"),
    new MessageButton().setCustomId("decline").setLabel("🚫").setStyle("DANGER")
  );
  message.channel
    .send({
      embeds: [
        {
          author: { name: "✈ Leave escouade" },
          description: `Voulez-vous vraiment quitter l'escouade \`${
            Squad.get(User.get(message.author.id).squad).name
          }\``,
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
          ["accept", "decline"].includes(i.customId) &&
          i.user.id === message.author.id &&
          i.message.id === m.id
        );
      };

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 15000,
        max: 1,
        errors: ["time"],
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "accept":
            let users = db.get("users");
            let squads = db.get("squads");
            let user = User.get(message.author.id);
            let squad = Squad.get(user.squad);

            m.edit({
              embeds: [
                {
                  author: { name: "📌 Leave escouade" },
                  description: `Vous venez de quitter l'escouade \`${
                    Squad.get(User.get(message.author.id).squad).name
                  }\``,
                  color: client.config.globalColor,
                  footer: {
                    text: "Dymensia ・ Made with ❤️",
                    icon_url: message.guild.iconURL,
                  },
                },
              ],
              components: [],
            });
            user.squad = null;
            users.splice(
              users.indexOf(users.find((u) => u.id == user.id)),
              1,
              user
            );
            db.set("users", users);
            squad.members.splice(
              squad.members.indexOf(
                squad.members.find((m) => m.id == message.author.id)
              ),
              1
            );
            squads.splice(
              squads.indexOf(squads.find((u) => u.id == squad.id)),
              1,
              squad
            );
            db.set("squads", squads);
            i.deferUpdate();
            break;
          case "decline":
            m.edit({
              embeds: [
                {
                  author: { name: "🚫 Leave escouade" },
                  description: `Vous avez décliné le leave de l'escouade.`,
                  color: client.config.globalColor,
                  footer: {
                    text: "Dymensia ・ Made with ❤️",
                    icon_url: message.guild.iconURL,
                  },
                },
              ],
              components: [],
            });
            i.deferUpdate();
            break;
        }
      });
      collector.on("end", (i, reason) => {
        if (reason == "limit") return;
        m.edit({
          embeds: [
            {
              author: { name: "🚫 Leave escouade" },
              description: `Vous avez décliné le leave de l'escouade.`,
              color: client.config.globalColor,
              footer: {
                text: "Dymensia ・ Made with ❤️",
                icon_url: message.guild.iconURL,
              },
            },
          ],
          components: [],
        });
      });
    });
};
