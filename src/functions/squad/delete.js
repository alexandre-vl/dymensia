module.exports = (client, message, args) => {
  if (db.get("squads")) db.set("squads", []);

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
          author: { name: "📌 Suppression escouade" },
          description: `Voulez-vous vraiment supprimer l'escouade \`${squadName}\``,
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
            i.reply({
              ephemeral: true,
              content: "📌 Bravo ! Vous venez de créer votre escouade !",
            });
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
