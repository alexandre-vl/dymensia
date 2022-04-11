const embeds = require("../../functions/global/embeds.js");
const us
const db = require('quick.db')

module.exports = {
  name: "bal",
  description: "balance command",
  dir: "Economie",
  cooldown: 7,

  run: async (client, message, args) => {

    if (!db.get("users")) db.set("users", []);
    if (!User.get(message.author.id)) db.push('users', new User(message.author.id).json)

    if(!args[0]) {

        message.channel.send({
          embeds: [{
              author: { name: "💲 Balance" },
              description: `Vous possédez \`${coin} Dymensia Coin\``,
              color: client.config.globalcolor,
              footer: {
                  text: "Dymensia ・ Made with ❤️",
                  icon_url: message.guild.iconURL,
              },
          }, ],

          components: [row],
      })
    }
    else{

    }
  },
};
