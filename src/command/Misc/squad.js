module.exports = {
  name: "squad",
  description: "Squad command",
  aliases: ["s"],
  dir: "Misc",
  cooldown: 2,

  run: async (client, message, args) => {
    
      if (!args[0]) {
          return message.channel.send()
      }
      
      
  },
};
