const embeds = require("../../functions/global/embeds.js");

module.exports = {
  name: "squad",
  description: "Squad command",
  aliases: ["s"],
  dir: "Misc",
  cooldown: 2,
  methods: [
    "create",
    "delete",
    "rename",
    "info",
    "invite",
    "setrole",
    "join",
    "leave",
    "kick",
  ],

  run: async (client, message, args) => {
    let command = client.commandes.get("squad");

    let name = args.slice(1).join(" ");

    if (command.methods.includes(args[0])) {
      let method = args[0];
      require(`../../functions/squad/${method}`)(client, message, name);
    } else if (["panel", "infos", "info"].includes(args[0])) {
      require(`../../functions/panels/panelSquad.js`)(message, name);
    } else {
      return message.channel.send(
        embeds.error("`❌` Désolé, la commande n'existe pas")
      );
    }
  },
};
