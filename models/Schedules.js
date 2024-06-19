const database = require('../database');

class Schedules {
    constructor() {
        this.db = database;
        this.tableName = "schedules";
    }

    getRoutes() {
        return this.db.select('timetable', 'timetable_type')
            .from(this.tableName);
    }

    getRoutesWithTime() {
        return this.db.select('timetable', 'timetable_type', 'mg_start_time', 'ev_start_time', 'shifts_finish', 'start_trmnl', 'finish_trmnl')
            .from(this.tableName);
    }

    getRoute(data) {
        try {
            const { timetable, timetable_type } = data;

            return this.db.select()
                .from(this.tableName)
                .andWhere('timetable', timetable)
                .andWhere('timetable_type', timetable_type)
                .then(res => {
                    if (res.length > 0) {
                        return res[0];
                    } else {
                        return null;
                    }
                })
                .catch(err => {
                    console.error('Error fetching timetable:', err);
                });
        }
        catch (error) {
            console.error(error);
        }
    }

    getRouteNum(data) {
        try {
            const { timetable, timetable_type } = data;

            return this.db.select('bus_routes_num')
                .from(this.tableName)
                .andWhere('timetable', timetable)
                .andWhere('timetable_type', timetable_type)
                .then(res => {
                    if (res.length > 0) {
                        return res[0];
                    } else {
                        return null;
                    }
                })
                .catch(err => {
                    console.error('Error fetching bus route number:', err);
                });
        }
        catch (error) {
            console.error(error);
        }
    }

    getShift(data) {
        try {
            const { shift, timetable, timetable_type } = data;
            if (shift == 'first') {
                return this.db.select(
                    'departure_time as fromPark',
                    'mg_start_time as start',
                    'start_trmnl as startTrmnl',
                    'shift_start as toPark',
                    'name_trmnl_one as finishTrmnl',
                    'shift_end as finish',
                    this.db.raw(`
                        SEC_TO_TIME(
                            IF(TIME_TO_SEC(shift_end) >= TIME_TO_SEC(mg_start_time),
                                TIME_TO_SEC(shift_end) - TIME_TO_SEC(mg_start_time),
                                86400 + (TIME_TO_SEC(shift_end) - TIME_TO_SEC(mg_start_time))
                            ) -
                            COALESCE(TIME_TO_SEC(first_lunch_time), 0) -
                            COALESCE(TIME_TO_SEC(second_lunch_time), 0)
                        ) AS onroute
                    `)
                )
                    .from(this.tableName)
                    .whereNotNull('mg_start_time')
                    .andWhere('timetable', timetable)
                    .andWhere('timetable_type', timetable_type)
                    .then(res => {
                        return res[0];
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }

            else if (shift == 'second') {
                return this.db.select(
                    'shift_start as fromPark',
                    'ev_start_time as start',
                    'shift_trmnl as startTrmnl',
                    'comeback_time as toPark',
                    'finish_trmnl as finishTrmnl',
                    'shifts_finish as finish',
                    this.db.raw(`
                        SEC_TO_TIME(
                            GREATEST(
                                IF(
                                    TIME_TO_SEC(shifts_finish) >= TIME_TO_SEC(ev_start_time),
                                    TIME_TO_SEC(shifts_finish) - TIME_TO_SEC(ev_start_time),
                                    86400 + (TIME_TO_SEC(shifts_finish) - TIME_TO_SEC(ev_start_time))
                                ) -
                                COALESCE(TIME_TO_SEC(third_lunch_time), 0) -
                                COALESCE(TIME_TO_SEC(fourth_lunch_time), 0),
                                0
                            )
                        ) AS onroute
                    `)
                )
                    .from(this.tableName)
                    .whereNotNull('ev_start_time')
                    .andWhere('timetable', timetable)
                    .andWhere('timetable_type', timetable_type)
                    .then(res => {
                        return res[0];
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }

            else if (shift == 'double') {
                return this.db.select(
                    'departure_time as fromPark',
                    this.db.raw(`COALESCE(mg_start_time, ev_start_time) as start`),
                    'start_trmnl as startTrmnl',
                    'comeback_time as toPark',
                    'finish_trmnl as finishTrmnl',
                    'shifts_finish as finish',
                    this.db.raw(`
                            SEC_TO_TIME(
                                GREATEST(
                                    TIME_TO_SEC(shifts_finish) -
                                    COALESCE(TIME_TO_SEC(mg_start_time), TIME_TO_SEC(ev_start_time)) -
                                    COALESCE(TIME_TO_SEC(first_lunch_time), 0) -
                                    COALESCE(TIME_TO_SEC(second_lunch_time), 0) -
                                    COALESCE(TIME_TO_SEC(third_lunch_time), 0) -
                                    COALESCE(TIME_TO_SEC(fourth_lunch_time), 0) -
                                    (TIME_TO_SEC(shift_end) - TIME_TO_SEC(shift_start)),
                                    0
                                ) + IF(shifts_finish < mg_start_time OR shifts_finish < ev_start_time, 86400, 0)
                            ) AS onroute
                    `)
                )
                    .from(this.tableName)
                    .whereNotNull('ev_start_time')
                    .andWhere('timetable', timetable)
                    .andWhere('timetable_type', timetable_type)
                    .then(res => {
                        if (res.length > 0) {
                            return res[0];
                        } else {
                            return null;
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching double shift data:', err);
                    });
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    getAtpRouteDist(data) {
        try {
            const { timetable, timetable_type } = data;

            return this.db.select('dist_trmnl_one', 'dist_trmnl_two')
                .from(this.tableName)
                .where({
                    timetable: timetable,
                    timetable_type: timetable_type
                })
                .then(res => {
                    return res[0];
                });
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    createSchedule(data) {
        try {
            data.schedule_update = this.db.fn.now();

            return this.db(this.tableName).insert(data)
                .then((res) => res[0]);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async updateSchedule(timetable, timetable_type, data) {
        try {
            if (
                data.start_trmnl || data.finish_trmnl || data.name_trmnl_one ||
                data.name_trmnl_two || data.dist_trmnl_one || data.dist_trmnl_two ||
                data.route_dist || data.bus_routes_num
            ) {
                const existingData = await this.db(this.tableName)
                    .select('*')
                    .where('timetable', timetable)
                    .andWhere('timetable_type', timetable_type)
                    .first();

                const start_trmnl = data.start_trmnl || existingData.start_trmnl;
                const finish_trmnl = data.finish_trmnl || existingData.finish_trmnl;
                const name_trmnl_one = data.name_trmnl_one || existingData.name_trmnl_one;
                const name_trmnl_two = data.name_trmnl_two || existingData.name_trmnl_two;
                const dist_trmnl_one = parseFloat(data.dist_trmnl_one) || existingData.dist_trmnl_one;
                const dist_trmnl_two = parseFloat(data.dist_trmnl_two) || existingData.dist_trmnl_two;
                const route_dist = parseFloat(data.route_dist) || existingData.route_dist;
                const bus_routes_num = parseFloat(data.bus_routes_num) || existingData.bus_routes_num;

                let v1 = 0.0, v2 = 0.0;

                if (start_trmnl === name_trmnl_one) {
                    v1 = dist_trmnl_one;
                } else if (start_trmnl === name_trmnl_two) {
                    v1 = dist_trmnl_two;
                }

                if (finish_trmnl === name_trmnl_one) {
                    v2 = dist_trmnl_one;
                } else if (finish_trmnl === name_trmnl_two) {
                    v2 = dist_trmnl_two;
                }

                data.total_dist = v1 + v2 + route_dist * bus_routes_num;
            }

            if (data.dist_trmnl_one || data.dist_trmnl_two || data.name_trmnl_one || data.name_trmnl_two) {
                const existingData = await this.db(this.tableName)
                    .select('*')
                    .where('timetable', timetable)
                    .andWhere('timetable_type', timetable_type)
                    .first();

                const dist_trmnl_one = data.dist_trmnl_one || existingData.dist_trmnl_one;
                const dist_trmnl_two = data.dist_trmnl_two || existingData.dist_trmnl_two;
                const name_trmnl_one = data.name_trmnl_one || existingData.name_trmnl_one;
                const name_trmnl_two = data.name_trmnl_two || existingData.name_trmnl_two;

                data.shift_trmnl = dist_trmnl_one <= dist_trmnl_two ? name_trmnl_one : name_trmnl_two;
            }

            data.schedule_update = this.db.fn.now();

            return this.db(this.tableName)
                .update(data)
                .where('timetable', timetable)
                .andWhere('timetable_type', timetable_type);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async deleteSchedule(timetable, timetable_type) {
        try {
            return this.db(this.tableName)
                .where('timetable', timetable)
                .andWhere('timetable_type', timetable_type)
                .del();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    getTimetablesWithFilter(filter) {
        try {
            return this.db.select(
                'timetable',
                'timetable_type',
                'mg_start_time',
                'ev_start_time',
                'shifts_finish',
                'start_trmnl',
                'finish_trmnl',
                this.db.raw(`
                    SEC_TO_TIME(
                        GREATEST(
                            TIME_TO_SEC(
                                IF(
                                    shifts_finish < LEAST(COALESCE(mg_start_time, '23:59:59'), COALESCE(ev_start_time, '23:59:59')),
                                    shifts_finish + INTERVAL 1 DAY,
                                    shifts_finish
                                )
                            ) -
                            COALESCE(TIME_TO_SEC(mg_start_time), TIME_TO_SEC(ev_start_time)) -
                            COALESCE(TIME_TO_SEC(first_lunch_time), 0) -
                            COALESCE(TIME_TO_SEC(second_lunch_time), 0) -
                            COALESCE(TIME_TO_SEC(third_lunch_time), 0) -
                            COALESCE(TIME_TO_SEC(fourth_lunch_time), 0) -
                            (TIME_TO_SEC(shift_end) - TIME_TO_SEC(shift_start)),
                            0
                        )
                    ) AS onroute
                `),
                this.db.raw(`
                    SEC_TO_TIME(
                        TIME_TO_SEC(comeback_time) + 
                        IF(TIME_TO_SEC(comeback_time) < TIME_TO_SEC('05:00:00'), 86400, 0)
                    ) AS adjusted_comeback_time
                `)
            )
                .from(this.tableName)
                .modify((queryBuilder) => {
                    if (filter.sortType && filter.sortOrder) {
                        const sortField = filter.sortType === 'distance' ? 'total_dist' : (
                            filter.sortType === 'time' ? 'onroute' : 'adjusted_comeback_time'
                        );
                        queryBuilder.orderBy(sortField, filter.sortOrder || 'asc');
                    }

                    if (filter.startTime === 'morning') {
                        queryBuilder.whereNotNull('mg_start_time').andWhere('mg_start_time', '<', this.db.raw('TIME("12:00:00")'));
                    } else if (filter.startTime === 'evening') {
                        queryBuilder.where('mg_start_time', '>=', this.db.raw('TIME("12:00:00")')).orWhereNotNull('ev_start_time');
                    }
                })
                .limit(5);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }

    }
}

module.exports = new Schedules();