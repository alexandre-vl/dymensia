function embedError(error) {
  let embed = {
    embeds: [
      {
        description: "`❌` Ooops ! Une erreur est survenue...",
        color: "C23E3E",
      },
    ],
  };

  return;
}

modules.export.embedError = embedError;
