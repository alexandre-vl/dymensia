const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");
const User = require("../global/User.js");
const Squad = require("../global/Squad.js");
const embeds = require("../global/embeds.js")

module.exports = (client, message, args) => {
    let squadName = args[0];

    if (!db.get("squads")) db.set("squads", []);
    if (!db.get("users")) db.set("users", []);


    if (!User.get(message.author.id)) db.push('users', new User(message.author.id).json)

    if (User.get(message.author.id).squad !== null) {
        return message.channel.send(embeds.alreadySquad())
    }

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
                author: { name: "📌 Création escouade" },
                description: `Voulez-vous vraiment créer l'escouade \`${squadName}\``,
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
                        let squad = new Squad(squadName).setLeader(message.author.id).json
                        db.push('squads', squad)
                        
                        let users = db.get("users");
                        let user = User.get(message.author.id)
                        user.squad = squad.id;
                        users.splice(users.indexOf(users.find(u => u.id == user.id)), 1, user)
                        db.set("users", users)

                        m.edit({
                            embeds: [{
                                author: { name: "✅ Création escouade" },
                                description: `L'escouade \`${squadName}\` a bien été créé.`,
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
                        description: `Vous avez décliné la création de l'escouade.`,
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