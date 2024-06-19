const database = require('../database');

class Phones {
    constructor() {
        this.db = database;
        this.tableName = "phones";
    }

    getPhonesByType(profileId, type) {
        try {
            if (type == 'emr') {
                return this.db.select('phone_id', 'num_name', 'num')
                    .from(this.tableName)
                    .where({ 'num_type': type });
            } else {
                return this.db.select('phone_id', 'num_name', 'num')
                    .from(this.tableName)
                    .where({ 'profile_id': profileId })
                    .andWhere({ 'num_type': type });
            }
        } catch (err) {
            console.log(err);
        }
    }

    getPhonesAll(profileId) {
        try {
            return this.db.select('phone_id', 'num_name', 'num', 'num_type')
                .from(this.tableName)
                .where(function() {
                    this.where('profile_id', profileId)
                        .orWhere('num_type', 'emr');
                });
        } catch (err) {
            console.log(err);
        }
    }

    updatePhone(phoneId, num) {
        try {
            return this.db(this.tableName)
                .update({ 'num': num })
                .where({ 'phone_id': phoneId });
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    createPhone(data) {
        try {
            return this.db(this.tableName).insert(data)
                .then((res) => res[0]);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // delete(id) {

    // }
}

module.exports = new Phones();