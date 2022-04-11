const embeds = require("../../functions/global/embeds.js");
const db = require('quick.db')

module.exports = {
  name: "bal",
  description: "balance command",
  dir: "Economie",
  cooldown: 7,

  run: async (client, message, args) => {
    if(!args[0]) return embeds.missingArgs()
    
  },
};
