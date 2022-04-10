const db = require("quick.db");
const { MessageActionRow, MessageButton, Interaction } = require("discord.js");
const User = require("../createUser.js");

module.exports = (client, message, args, name) => {
  let squadName = args[0];

  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("accept")
      .setLabel("✅")
      .setStyle("SUCCESS"),
    new MessageButton().setCustomId("decline").setLabel("❌").setStyle("DANGER")
  );

  message.channel
    .send({
      embeds: [
        {
          author: { name: "📌 Création escouade" },
          description: `Voulez-vous vraiment créer l'escouade \`${squadName}\``,
          color: client.config.globalcolor,
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
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "accept":
            let id = require("../global/randomId.js")(6, "squads");
            db.push("squads", {
              name: squadName,
              id: id,
              leader: message.author.id,
              members: [],
              coalition: "none",
              xp: 0,
              level: 0,
              money: 0,
              taxes: 0,
              public: false,
            });
            let users = db.get("users");
            let user = users.find((u) => u.id === message.author.id);
            if (user) {
              user.squad = id;
            } else {
              db.set("users", new User(message.author.id, id));
            }

            i.reply({
              ephemeral: true,
              content: "🎉 Bravo ! Vous venez de créer votre escouade !",
            });

            console.log(db.get("squads"));
            break;
          case "decline":
            i.reply({
              ephemeral: true,
              content: "❌ Vous venez d'annuler la création de votre escouade.",
            });
            break;
        }
      });
    });
};
