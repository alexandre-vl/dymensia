const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  name: "help",
  description: "Help command",
  aliases: ["aide"],
  dir: "Misc",
  cooldown: 2,

  run: async (client, message, args) => {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("category")
        .setPlaceholder("Choisissez la catégorie")
        .addOptions([
          {
            label: "Commandes Squad",
            description: "Cliquez pour avoir plus d'infos",
            value: "squad",
            emoji: "🏠",
          },
          {
            label: "Commandes Coalition",
            description: "Cliquez pour avoir plus d'infos",
            value: "coalition",
            emoji: "🎈",
          },
          {
            label: "Commandes Economie",
            description: "Cliquez pour avoir plus d'infos",
            value: "economie",
            emoji: "🪙",
          },
          {
            label: "Commandes XP",
            description: "Cliquez pour avoir plus d'infos",
            value: "xp",
            emoji: "🏆",
          },
          {
            label: "Commandes Event",
            description: "Cliquez pour avoir plus d'infos",
            value: "event",
            emoji: "🎉",
          },
          {
            label: "Commandes Dons",
            description: "Cliquez pour avoir plus d'infos",
            value: "dons",
            emoji: "💸",
          },
          {
            label: "Commandes Utiles",
            description: "Cliquez pour avoir plus d'infos",
            value: "utiles",
            emoji: "📌",
          },
        ])
    );

    message.reply({
      embeds: [
        {
          title: "🔮 Liste des commandes",
          description: `Voici les catégories de commandes disponibles:\n
          \`d!help squad\`
          \`d!help coalition\`
          \`d!help economie\`
          \`d!help xp\`
          \`d!help event\`
          \`d!help dons\`
          \`d!help utils\`
          `,
          color: client.config.globalColor,
          thumbnail: { url: message.guild.iconURL() },
          footer: {
            text: "Dymensia ・ Made with ❤️",
            icon_url: client.user.displayAvatarURL(),
          },
        },
      ],
      components: [row],
    });
  },
};
