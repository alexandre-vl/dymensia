function missingArgs() {
    let embed = {
        embeds: [{
            description: "`❌` Ooops ! Une erreur est survenue...",
            color: "C23E3E",
        }, ],
    };
    return embed;
}

function unknownCommand() {
    let embed = {
        embeds: [{
            description: "`❌` Ooops ! Cette commande n'existe pas...",
            color: "C23E3E",
        }, ],
    };
    return embed;
}

function noSquad() {
    let embed = {
        embeds: [{
            description: "`❌` Ooops ! Vous ne possédez aucune escouade...",
            color: "C23E3E",
        }, ],
    };
    return embed;
}

function alreadySquad() {
    let embed = {
        embeds: [{
            description: "`❌` Ooops ! Vous avez déjà une escouade...",
            color: "C23E3E",
        }, ],
    };
    return embed;
}

function noLeaderSquad() {
    let embed = {
        embeds: [{
            description: "`❌` Ooops ! Vous n'êtes pas le leader de cette escouade...",
            color: "C23E3E",
        }, ],
    };
    return embed;
}

function cooldowns(time) {
    let embed = {
        embeds: [{
            description: `\`❌\` Molo ! Attends encore \`${time}\` secondes`,
            color: "C23E3E",
        }, ],
    };
    return embed;
}

module.exports.missingArgs = missingArgs;
module.exports.unknownCommand = unknownCommand;
module.exports.alreadySquad = alreadySquad;
module.exports.noLeaderSquad = noLeaderSquad;
module.exports.noSquad = noSquad;
module.exports.cooldowns = cooldowns;