const Squad = require("../global/Squad.js");
const User = require("../global/User.js");
const db = require("quick.db")
const embeds = require("../global/embeds.js");
const { MessageActionRow, MessageButton } = require("discord.js")
module.exports = (client, message, args) => {


    if (!db.get("squads")) db.set("squads", []);
    if (!db.get("users")) db.set("users", []);

    if (!User.get(message.author.id)) db.push('users', new User(message.author.id))

    if (User.get(message.author.id).squad == null) return message.channel.send(embeds.noSquad())


    if (!Squad.get(User.get(message.author.id).squad) ||
        Squad.get(User.get(message.author.id).squad.leader !== message.author.id)) return message.channel.send(embeds.noLeaderSquad())

    const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("accept")
        .setLabel("✅")
        .setStyle("SUCCESS"),
        new MessageButton().setCustomId("decline").setLabel("❌").setStyle("DANGER")
    );



    message.channel
        .send({
            embeds: [{
                author: { name: "📌 Suppression escouade" },
                description: `Voulez-vous vraiment supprimer l'escouade \`${Squad.get(User.get(message.author.id).squad).name}\``,
                color: client.config.globalcolor,
                footer: {
                    text: "Dymensia ・ Made with ❤️",
                    icon_url: message.guild.iconURL,
                },
            }, ],

            components: [row],
        })
        .then((m) => {
            const filter = (i) => {
                return (
                    ["accept", "decline"].includes(i.customId) &&
                    i.user.id === message.author.id &&
                    i.message.id === m.id
                );
            };
            const collector = message.channel.createMessageComponentCollector({
                filter,
                time: 15000,
                max: 1,
                errors: ['time']
            });

            collector.on("collect", async(i) => {
                switch (i.customId) {
                    case "accept":
                        let users = db.get("users");
                        let squads = db.get("squads")
                        let user = User.get(message.author.id)
                        let squad = Squad.get(user.squad)
                        user.squad = null;
                        users.splice(users.indexOf(users.find(u => u.id == user.id)), 1, user)
                        squads.splice(squads.indexOf(squads.find(u => u.id == squad.id)), 1)
                        db.set("users", users)
                        db.set("squads", squads)

                        m.edit({
                            embeds: [{
                                author: { name: "📌 Suppression escouade" },
                                description: `L'escouade \`${Squad.get(User.get(message.author.id).squad).name}\` a bien supprimée.`,
                                color: client.config.globalcolor,
                                footer: {
                                    text: "Dymensia ・ Made with ❤️",
                                    icon_url: message.guild.iconURL,
                                },
                            }],
                            components: [],
                        });
                        i.deferUpdate()
                        break;
                    case "decline":
                        m.edit({
                            embeds: [{
                                author: { name: "❌ Création escouade" },
                                description: `Vous avez décliné la création de l'escouade.`,
                                color: client.config.globalcolor,
                                footer: {
                                    text: "Dymensia ・ Made with ❤️",
                                    icon_url: message.guild.iconURL,
                                },
                            }],
                            components: [],
                        });
                        i.deferUpdate()
                        break;
                }
            });
            collector.on('end', (i, reason) => {
                if (reason == 'limit') return
                m.edit({
                    embeds: [{
                        author: { name: "❌ Création escouade" },
                        description: `Vous avez décliné la suppression de l'escouade.`,
                        color: client.config.globalcolor,
                        footer: {
                            text: "Dymensia ・ Made with ❤️",
                            icon_url: message.guild.iconURL,
                        },
                    }],
                    components: [],
                });
            })
        });
};