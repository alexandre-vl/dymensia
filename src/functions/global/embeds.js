function error(error) {
  let embed = {
    embeds: [
      {
        description: error,
        color: "C23E3E",
      },
    ],
  };
  return embed;
}

module.exports.error = error;
