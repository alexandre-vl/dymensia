const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js");

module.exports = (client, message, args) => {
  let squadName = args;

  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!User.get(message.author.id))
    db.push("users", new User(message.author.id));
  if (!squadName) {
    return message.channel.send(
      embeds.error("`❌` Veuillez préciser le nom de votre escouade")
    );
  }
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
    !squad.roles
      .find(
        (r) => r.id == squad.members.find((m) => m.id == message.author.id).role
      )
      .permission.includes("MANAGE_SQUAD")
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas la permission requise pour faire ceci")
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
          author: { name: "📋 Renommage escouade" },
          description: `Voulez-vous vraiment renommer l'escouade \`${
            Squad.get(User.get(message.author.id).squad).name
          }\` en \`${squadName}\``,
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
            let user = User.get(message.author.id);
            let squads = db.get("squads");
            let squad = Squad.get(user.squad);
            squad.name = squadName;
            squads.splice(
              squads.indexOf(squads.find((squad) => squad.id == squad.id)),
              1,
              squad
            );
            db.set("squads", squads);
            console.log(db.get("squads"));

            m.edit({
              embeds: [
                {
                  author: { name: "✅ Renommage escouade" },
                  description: `Votre escouade à été renommée en \`${squadName}\`.`,
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
          case "decline":
            m.edit({
              embeds: [
                {
                  author: { name: "🚫 Renommage escouade" },
                  description: `Vous avez décliné la renommage de l'escouade.`,
                  color: client.config.globalcolor,
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
              author: { name: "❌ Création escouade" },
              description: `Vous avez décliné la création de l'escouade.`,
              color: client.config.globalcolor,
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
