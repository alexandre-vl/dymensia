const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js");
const ranks = require("../../data/ranks.json");

module.exports = async (client, message, args) => {
  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!User.get(message.author.id))
    db.push("users", new User(message.author.id));

  let user = User.get(message.author.id);

  let squads = db.get("squads");

  if (args == "members") {
    squads.sort(function (a, b) {
      return a.members.length - b.members.length;
    });
  } else if (args == "level") {
    squads.sort(function (a, b) {
      return a.level - b.level;
    });
  } else if (args == "money") {
    squads.sort(function (a, b) {
      return a.money - b.money;
    });
  } else {
    return message.channel.send(
      embeds.error("`❌` Veuillez préciser en argument `members/level/money`")
    );
  }
  squads.reverse();

  message.channel.send({
    embeds: [
      {
        title: "🏆 Leaderboard " + args.charAt(0).toUpperCase() + args.slice(1),
        fields: squads.map((squad) => {
          return {
            name: `${squad.name} ${squad.public ? "🟢" : "🔴"} (\`${
              squad.id
            }\`)`,
            value: `\`${args.charAt(0).toUpperCase() + args.slice(1)}: ${
              args == "members" ? squad[args].length : squad[args]
            }\``,
          };
        }),
        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });
};
