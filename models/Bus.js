const database = require('../database');

class Bus {
    constructor() {
        this.db = database;
        this.tableName = "bus";
    }
    
    addBus(data) {
        try {
            return this.db(this.tableName).insert({
                'plate_number': data.plate,
                'bus_number': data.busNum,
                'bus_brand': data.brand,
                'bus_photo': data.photo,
                'bus_update': this.db.fn.now(),
                'profile_id': data.profileId,
            });
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    createBus(data) {
        try {
            data.bus_update = this.db.fn.now();

            return this.db(this.tableName).insert(data)
                .then((res) => res[0]);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    getBusInfo(plateNumber) {
        return this.db
            .select('*')
            .from(this.tableName)
            .where('plate_number', plateNumber)
            .first();
    }

    updateBusInfo(data) {
        const updateData = {
            'bus_update': this.db.fn.now()
        };
        Object.keys(data).forEach(key => {
            if (data[key] !== null) {
                updateData[key] = data[key];
            }
        });

        return this.db(this.tableName)
            .where('plate_number', data.plate)
            .update(updateData);
    }

    updateBus(plateNumber, data) {
        try {
            data.bus_update = this.db.fn.now();
            
            return this.db(this.tableName)
                .update(data)
                .where('plate_number', plateNumber)
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    deleteBus(plateNumber) {
        return this.db(this.tableName)
            .where('plate_number', plateNumber)
            .del();
    }

    getBuses() {
        return this.db.select('plate_number', 'bus_number', 'bus_brand')
        .from(this.tableName);
    }
}
    
module.exports = new Bus();