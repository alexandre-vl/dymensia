const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
  allowedMentions: { parse: ["users", "roles"] },
  fetchAllMembers: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER"],
});

//SET COLLECTION
client.commandes = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
cooldowns = new Collection();

//SET UTILS
client.logger = require("./src/utils/logger");
client.color = require("./src/utils/color.js");

//SET CONFIG
client.config = require("./config");

// LOAD THE 4 HANDLERS
["error", "command", "event"].forEach((file) => {
  require(`./src/utils/handlers/${file}`)(client);
});

client.login(client.config.token);

module.exports.client = client;
