module.exports = class User {
  constructor(id, squad) {
    this.id = id;
    this.squad = squad;
    this.level = 0;
    this.xp = 0;
    this.money = 0;
    this.items = []
  }
  setSquad(newSquad) {
    this.squad = newSquad
    return this
  }
};
