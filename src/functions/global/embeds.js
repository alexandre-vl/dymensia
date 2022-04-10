function missingArgs() {
  let embed = {
    embeds: [
      {
        description: "`❌` Ooops ! Une erreur est survenue...",
        color: "C23E3E",
      },
    ],
  };
  return embed;
}

function unknownCommand() {
  let embed = {
    embeds: [
      {
        description: "`❌` Ooops ! Cette commande n'existe pas...",
        color: "C23E3E",
      },
    ],
  };
  return embed;
}

module.exports.missingArgs = missingArgs;
