const database = require('../database');

class Alarms {
    constructor() {
        this.db = database;
        this.tableName = "alarms";
    }

    createGetup(profileId, getupTime) {
        try {
            return this.db.transaction(async trx => {
                const existingEntry = await trx(this.tableName)
                    .select('profile_id')
                    .where('profile_id', profileId)
                    .first();
    
                if (existingEntry) {
                    await trx(this.tableName)
                        .update({ wakeup_time: getupTime })
                        .where('profile_id', profileId);
                } else {
                    await trx(this.tableName)
                        .insert({ profile_id: profileId, wakeup_time: getupTime });
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    createLeave(profileId, leaveTime) {
        try {
            return this.db.transaction(async trx => {
                const existingEntry = await trx(this.tableName)
                    .select('profile_id')
                    .where('profile_id', profileId)
                    .first();
    
                if (existingEntry) {
                    await trx(this.tableName)
                        .update({ leaving_home_time: leaveTime })
                        .where('profile_id', profileId);
                } else {
                    await trx(this.tableName)
                        .insert({ profile_id: profileId, leaving_home_time: leaveTime });
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    getAlarm(profileId) {
        try {
            return this.db.select(
                'wakeup_time as getup',
                'leaving_home_time as leave'
            )
                .from(this.tableName)
                .andWhere('profile_id', profileId)
                .then(res => {
                    return res.length > 0 ? res[0] : null;
                });
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Alarms();