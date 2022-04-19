const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embedsMess = require("../global/embeds.js");
const ranks = require("../../data/ranks.json");

module.exports = async (client, message, args) => {
  if (!db.get("squads")) db.set("squads", []);
  if (!db.get("users")) db.set("users", []);

  if (!User.get(message.author.id))
    db.push("users", new User(message.author.id));

  let user = User.get(message.author.id);

  const button1 = new MessageButton()
    .setCustomId("previousbtn")
    .setLabel("◀")
    .setStyle("DANGER");

  const button2 = new MessageButton()
    .setCustomId("nextbtn")
    .setLabel("▶")
    .setStyle("SUCCESS");
  const button3 = new MessageButton()
    .setCustomId("joinbtn")
    .setLabel("📥")
    .setStyle("PRIMARY");

  buttonList = [button1, button2, button3];

  let embeds = db.get("squads").map((squad) => {
    return {
      title: squad.name + " " + (squad.public ? "🟢" : "🔴"),
      description: `
        > \`🔧\` Id: \`${squad.id}\`
        > \`👔\` Leader: \`${
          message.guild.members.cache.get(squad.leader)
            ? message.guild.members.cache.get(squad.leader).user.tag
            : "Introuvable"
        }\`
        > \`👥\` Membres: \`${squad.members.length}\`
        > \`🕓\` Création: <t:${Math.round(squad.creation / 1000)}:R>
        `,
      color: client.config.globalColor,
      footer: { text: squad.id },
    };
  });
  console.log(embeds);
  if (args == "public") embeds = embeds.filter((s) => s.title.includes("🟢"));

  timeout = 120000;
  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  embeds[page].footer = {
    text: `${embeds[page].footer.text} - ${page + 1} / ${embeds.length}`,
  };
  const curPage = await message.channel.send({
    embeds: [embeds[page]],
    components: [row],
    fetchReply: true,
  });

  const filter = (i) =>
    (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId) &&
    i.user.id == message.author.id;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = page > 0 ? --page : embeds.length - 1;
        break;
      case buttonList[1].customId:
        page = page + 1 < embeds.length ? ++page : 0;
        break;
      case buttonList[2].customId:
        let squads = db.get("squads");
        let users = db.get("users");
        let squad = squads.find(
          (squad) => squad.id == embeds[page].footer.text.split(" - ")[0]
        );
        let user = db.get("users").find((u) => u.id == i.user.id);
        if (
          user.squad !== null &&
          Squad.get(User.get(message.author.id).squad)
        ) {
          i.message.channel
            .send(embedsMess.error("`❌` Vous avez déjà une escouade"))
            .then((m) =>
              setTimeout(() => {
                m.delete().catch((e) => {});
              }, 4000)
            );
          return await i.reply({}).catch((e) => {});
        }
        user.squad = squad.id;
        squad.members.push({
          id: message.author.id,
          username: message.author.username,
          role: squad.roles.find((r) => r.default).id,
        });
        squads.splice(
          squads.indexOf(squads.find((s) => s.id == squad.id)),
          1,
          squad
        );
        users.splice(
          users.indexOf(users.find((u) => u.id == user.id)),
          1,
          user
        );
        db.set("squads", squads);
        db.set("users", users);
        i.message.channel
          .send(
            embedsMess.error(
              "`📥` Vous venez de rejoindre l'escouade : `" + squad.name + "`"
            )
          )
          .then((m) =>
            setTimeout(() => {
              m.delete().catch((e) => {});
            }, 4000)
          );
        return await i.reply({}).catch((e) => {});
        break;
      default:
        break;
    }
    embeds[page].footer = {
      text: `${embeds[page].footer.text.split(" - ")[0]} - ${page + 1} / ${
        embeds.length
      }`,
    };
    await i.reply({}).catch((e) => {});
    await i.message.edit({
      embeds: [embeds[page]],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", (_, reason) => {
    if (reason !== "messageDelete") {
      const disabledRow = new MessageActionRow().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true),
        buttonList[2].setDisabled(true)
      );
      embeds[page].footer = {
        text: `${embeds[page].footer.text.split(" - ")[0]} - ${page + 1} / ${
          embeds.length
        }`,
      };
      curPage.edit({
        embeds: [embeds[page]],
        components: [disabledRow],
      });
    }
  });
};
