const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js");
const ranks = require("../../data/ranks.json");
module.exports = (client, message, args) => {
  let squadName = args;
  let member = message.mentions.users.first();
  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!User.get(message.author.id))
    db.push("users", new User(message.author.id));

  if (
    User.get(message.author.id).squad == null ||
    !Squad.get(User.get(message.author.id).squad) ||
    !Squad.get(User.get(message.author.id).squad).members.find(
      (m) => m.id == message.author.id
    )
  )
    return message.channel.send(
      embeds.error("`❌` Vous n'avez pas encore d'escouade")
    );

  let user = User.get(message.author.id);
  let squad =
    Squad.get(User.get(member?.id)?.squad) ||
    db.get("squads").find((s) => s.name == squadName) ||
    Squad.get(user.squad);

  let pourcent = Math.floor(
    ((squad.xp == 0 ? 1 : squad.xp) / ranks.squads[squad.level]) * 100
  );

  let value = Math.floor(5 * (pourcent / 100));
  let string = "";
  for (i = 0; i < value + 1; i++) {
    if (i === 1) string += "<:blue_start:963397869145038858>";
    if (i === 2) string += "<:blue_midle:963397868754960415>";
    if (i === 3) string += "<:blue_midle:963397868754960415>";
    if (i === 4) string += "<:blue_midle:963397868754960415>";
    if (i === 5) string += "<:blue_back:963397869161807922>";
  }
  if (value === 0)
    string +=
      "<:white_start:963397869199556658><:white_midle:963397869182795816><:white_midle:963397869182795816><:white_midle:963397869182795816><:white_back:963397869212143656>";
  if (value === 1)
    string +=
      "<:white_midle:963397869182795816><:white_midle:963397869182795816><:white_midle:963397869182795816><:white_back:963397869212143656>";
  if (value === 2)
    string +=
      "<:white_midle:963397869182795816><:white_midle:963397869182795816><:white_back:963397869212143656>";
  if (value === 3)
    string +=
      "<:white_midle:963397869182795816><:white_back:963397869212143656>";
  if (value === 4) string += "<:white_back:963397869212143656>";

  message.channel.send({
    embeds: [
      {
        title: squad.name + " " + (squad.public ? "🟢" : "🔴"),
        description:
          squad.description +
          `\n
        \`\`\`Informations\`\`\`
        > \`🔧\` Id: \`${squad.id}\`
        > \`👔\` Leader: \`${
          message.guild.members.cache.get(squad.leader)
            ? message.guild.members.cache.get(squad.leader).user.tag
            : "Introuvable"
        }\`
        > \`👥\` Membres: \`${squad.members.length}\`
        > \`🕓\` Création: <t:${Math.round(squad.creation / 1000)}:R>
        > \`🎏\` Rôles: \`${squad.roles
          .map((role) => {
            return role.name;
          })
          .join("`, `")}\`

        \`\`\`Stats\`\`\`
        > \`💰\` Banque: \`${squad.money}\` <:coin:964145321313710080>
        > \`💭\` Messages: \`${squad.messages}\`
        > \`🔮\` Levels: \`${squad.level} lvl\`
        
        ${string} - (\`${
            squad.xp > 1000
              ? parseFloat(squad.xp / 1000).toFixed(2) + "k"
              : squad.xp
          }/${
            ranks.squads[squad.level] > 1000
              ? parseFloat(ranks.squads[squad.level] / 1000).toFixed(2) + "k"
              : ranks.squads[squad.level]
          }\`)

        \`\`\`Membres\`\`\`
        `,
        fields: [
          squad.members.map((u) => {
            let role = squad.roles.find((r) => r.id == u.role);
            return {
              name: "`📌` Nom: `" + u.username + "`",
              value:
                "`🎯` **Rôle:** `" +
                (role?.leader ? "🏆 " + role?.name : role?.name ?? "Aucun") +
                "`",
              inline: true,
            };
          }),
        ],
        thumbnail: { url: squad.pp ?? "https://aucuneimage.com/pasdimage.png" },
        color: client.config.globalColor,
        footer: {
          text: "Dymensia ・ Made with ❤️",
          icon_url: message.guild.iconURL,
        },
      },
    ],
  });
};
