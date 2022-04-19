const { Collection } = require("discord.js");
const embeds = require("../functions/global/embeds.js");
const db = require("quick.db");
const User = require("../functions/global/User.js");
const Squad = require("../functions/global/Squad.js");
const ranks = require("../data/ranks.json");
module.exports = async (client, message) => {
  if (message.author.bot) {
    return;
  }
  const prefix = client.config.prefix;

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
    return message.channel.send(`Hey, mon prefix est \`${prefix}\``);
  }

  if (!message.content.startsWith(prefix)) {
    function getRandomInt(max) {
      return Math.floor(Math.random() * max + 1);
    }

    let user = User.get(message.author.id);
    if (user) {
      let users = db.get("users");
      let gainXP = getRandomInt(9);
      user.messages += 1;
      user.xp += gainXP;
      if (user.xp > ranks.users[user.level]) {
        user.level += 1;
      }
      users.splice(users.indexOf(users.find((u) => u.id == user.id)), 1, user);
      db.set("users", users);

      let squad = Squad.get(user.squad);
      if (squad) {
        let squads = db.get("squads");

        squad.messages += 1;
        squad.xp += gainXP;
        if (squad.xp > ranks.squads[squad.level]) {
          squad.level += 1;
        }
        squads.splice(
          squads.indexOf(squads.find((s) => s.id == squad.id)),
          1,
          squad
        );
        db.set("squads", squads);
      }
    }
    return;
  }

  const command = message.content
    .split(" ")[0]
    .slice(prefix.length)
    .toLowerCase();
  const args = message.content.split(" ").slice(1);
  let cmd;

  if (client.commandes.has(command)) {
    cmd = client.commandes.get(command);
  } else if (client.aliases?.has(command)) {
    cmd = client.commandes.get(client.aliases.get(command));
  }
  if (!cmd) return;

  const props = require(`../command/${cmd.dir}/${cmd.name}`);

  // COOLDOWNS & ERREUR
  if (!cooldowns.has(props.name)) {
    cooldowns.set(props.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(props.name);
  const cooldownAmount = (props.cooldown || 2) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        embeds.error(
          `\`❌\` Molo ! Attends encore \`${timeLeft.toFixed(1)}\` seconde(s)`
        )
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // PERMISSION CHECKER
  if (props.permissions) {
    if (!message.member.permissions.has(props.permissions)) {
      return message.reply(
        `You're missing permissions : ${props.permissions
          .map((p) => `**${p}**`)
          .join(", ")}`
      );
    }
  }

  //LOADING COMMANDS
  try {
    cmd.run(client, message, args);
  } catch (e) {
    client.emit("error", e, message);
  }
};
