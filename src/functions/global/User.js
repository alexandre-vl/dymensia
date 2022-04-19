const db = require("quick.db");
module.exports = class User {
  constructor(id, squad = null) {
    this.id = id;
    this.squad = squad;
    this.level = 0;
    this.xp = 0;
    this.money = 0;
    this.items = [];
    this.creation = Date.now();
    this.messages = 0;
  }
  setSquad(newSquad) {
    this.squad = newSquad;
    return this;
  }
  static get(id) {
    if (!db.get("users")) db.set("users", []);
    return db.get("users").find((u) => u.id == id);
  }
  get json() {
    return {
      id: this.id,
      squad: this.squad,
      level: this.level,
      xp: this.xp,
      money: this.money,
      items: this.items,
      creation: this.creation,
      messages: this.messages,
    };
  }
};
