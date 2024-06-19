const database = require('../database');

class Organizations {
    constructor() {
        this.db = database;
        this.tableName = "organizations";
    }


    findByTIN(tin) {
        return this.db.select('TIN_org')
            .from(this.tableName)
            .where('TIN_org', tin)
            .first(); 
    }

    getAll() {
        return this.db.select('TIN_org', 'org_name')
            .from(this.tableName);
    }
}

module.exports = new Organizations();