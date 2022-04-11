const db = require('quick.db')
const id = require("../global/randomId.js");
module.exports = class Squad {
    constructor(name) {
        this.name = name,
        this.id = id(6, "squads"),
        this.leader = null,
        this.members = [],
        this.coalition = "none",
        this.xp = 0,
        this.level = 0,
        this.money = 0,
        this.taxes = 0,
        this.public = false
    }
    setLeader(leader){
        this.leader = leader
        return this
    }
    static get(id) {
        return db.get('squads').find(u => u.id == id)
    }
    get json() {
        return {
        name: this.name,
        id: this.id,
        leader: this.leader,
        members: this.members,
        coalition: this.coalition,
        xp: this.xp,
        level: this.level,
        money: this.money,
        taxes: this.taxes,
        public: this.public,
        }
    }


};