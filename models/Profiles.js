const database = require('../database');

class Profiles {
    constructor() {
        this.db = database;
        this.tableName = "profiles";
    }

    createUser(username, tinorg, password) {
        try {
            return this.db(this.tableName).insert({
                'emp_id': username,
                'TIN_org': tinorg,
                'pin': password,
            })
                .then((res) => res[0]);
        } catch (err) {
            console.log(err);
        }
    }

    getUser(username, tinorg) {
        try {
            return this.db.select('profile_id', 'pin')
                .from(this.tableName)
                .where({ 'emp_id': username })
                .andWhere({ 'TIN_org': tinorg })
                .then((res) => res[0]);
        } catch (err) {
            console.log(err);
        }
    }

    getUserById(id) {
        try {
            return this.db.select('TIN_org', 'emp_id', 'ticket_price', 'driver_name')
                .from(this.tableName)
                .where({ 'profile_id': id })
                .then((res) => res[0]);
        } catch (err) {
            console.log(err);
        }
    }

    updateUser(id, data) {
        try {
            return this.db(this.tableName)
                .update(data)
                .where('profile_id', id);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new Profiles();