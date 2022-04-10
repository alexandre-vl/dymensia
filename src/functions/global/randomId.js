const db = require("quick.db");

const randomId = (nbrId, tableSearch) => {
  const characters = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  let id = "";
  for (let i = 0; i < nbrId; i++) {
    id += characters[Math.round(Math.random() * characters.length)];
  }
  
  if (!db.get(tableSearch).find((e) => e.id === id)) {
    return id;
  } else {
    return randomId(nbrId, tableSearch);
  }
};

module.exports = randomId;
