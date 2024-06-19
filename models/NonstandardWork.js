const database = require('../database');

class NonstandardWork {
    constructor() {
        this.db = database;
        this.tableName = "non_standard_work";
    }
}

module.exports = new NonstandardWork();