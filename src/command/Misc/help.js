module.exports = {
  name: "help",
  description: "Help command",
  aliases: ["aide"],
  dir: "Misc",
  cooldown: 2,

  run: async (client, message, args) => {
    message.reply({
      embeds: [
        {
          title: "🔮 Liste des commandes",
          description: `Voici les catégories de commandes disponibles:\n
          \`!help squad\`
          \`!help coalition\`
          \`!help economie\`
          \`!help xp\`
          \`!help event\`
          \`!help dons\`
          \`!help utils\`
          `,
          color: "a200ff",
          thumbnail: { url: message.guild.iconURL() },
          footer: {
            text: "Dymensia ・ Made with ❤️ by Ayumi",
            icon_url: client.user.displayAvatarURL(),
          },
        },
      ],
    });
  },
};
