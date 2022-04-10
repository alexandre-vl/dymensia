const embeds = require("../../functions/global/embeds.js");

module.exports = {
  name: "squad",
  description: "Squad command",
  aliases: ["s"],
  dir: "Misc",
  cooldown: 2,
  methods: ["create", "delete"],

  run: async (client, message, args) => {
    let command = client.commandes.get("squad");

    if (!args[0]) {
      return message.channel.send(embeds.missingArgs());
    }

    if (command.methods.includes(args[0])) {
      let method = args[0];
      args.shift();
      require(`../../functions/squad/${method}`)(client, message, args);
    } else {
      return message.channel.send(embeds.unknownCommand());
    }
  },
};
