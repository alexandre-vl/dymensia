const db = require("quick.db");
const id = require("../global/randomId.js");
const { client } = require("../../../index.js");
module.exports = class Squad {
  constructor(name) {
    this.name = name;
    this.description = "Aucune description";
    this.id = id(6, "squads");
    this.pp = null;
    this.leader = null;
    this.members = [];
    this.roles = [
      {
        id: id(6, "roles"),
        name: "Leader",
        leader: true,
        permission: [
          "CREATE_TAXES",
          "MANAGE_ROLES",
          "MANAGE_MEMBERS",
          "KICK_MEMBERS",
          "INVITE_MEMBERS",
          "MANAGE_SQUAD",
          "WITHDRAW_MONEY",
        ],
      },
      {
        id: id(6, "roles"),
        default: true,
        name: "Membre",
        permission: ["INVITE_MEMBERS"],
      },
    ];
    this.coalition = "none";
    this.messages = 0;
    this.xp = 0;
    this.level = 0;
    this.money = 0;
    this.taxes = 0;
    this.public = false;
    this.creation = Date.now();
    this.inventory = [];
  }
  setLeader(leader) {
    this.leader = leader;
    this.members.push({
      id: leader,
      username: client.guilds.cache
        .get(client.config.guild)
        .members.cache.get(leader).user.username,
      role: this.roles.find((r) => r.leader).id,
    });
    return this;
  }
  static get(id) {
    return db.get("squads").find((u) => u.id == id);
  }
  get json() {
    return {
      name: this.name,
      description: this.description,
      id: this.id,
      pp: this.pp,
      leader: this.leader,
      members: this.members,
      roles: this.roles,
      coalition: this.coalition,
      messages: this.messages,
      xp: this.xp,
      level: this.level,
      money: this.money,
      taxes: this.taxes,
      public: this.public,
      creation: this.creation,
      inventory: this.inventory,
    };
  }
};
