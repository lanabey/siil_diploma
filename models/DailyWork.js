const database = require('../database');

class DailyWork {
    constructor() {
        this.db = database;
        this.tableName = "daily_work";
    }

    createReport(data) {
        try {
            return this.db(this.tableName).insert(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async filterDW(dwData) {
        try {
            const query = this.db(this.tableName)
                .where('profile_id', dwData.profile_id)
                .andWhere('work_date', '>=', dwData.periodFrom)
                .andWhere('work_date', '<=', dwData.periodTo);

            query.modify((queryBuilder) => {
                if (dwData.timeOnRoute) {
                    queryBuilder.select(this.db.raw('SUM(work_onroute_time) AS dw_onroute_time'));

                }
                if (dwData.tftAccount) {
                    queryBuilder.select(this.db.raw('SUM(work_TFT_time) AS dw_TFT_time'));
                }
                if (dwData.totalWorkedTime) {
                    queryBuilder.select(this.db.raw('SUM(work_onroute_time + work_TFT_time) AS dw_total_work_time'));
                }
                if (dwData.mileage) {
                    queryBuilder.select(this.db.raw('SUM(total_dist) AS dw_total_dist'));
                }
                if (dwData.refueledDiesel) {
                    queryBuilder.select(this.db.raw('SUM(total_fueling) AS dw_total_fueling'));
                }
                if (dwData.ticketsSold) {
                    queryBuilder.select(this.db.raw('SUM(ticketsale_amount) AS dw_ticket_sale_num'));
                }
                // total_shifts
                if (dwData.shiftsCount) {
                    queryBuilder.select(this.db.raw('SUM(shifts_num) AS dw_total_shifts'));
                }
                // total_routes
                if (dwData.routesCount) {
                    queryBuilder.select(this.db.raw('SUM(work_routes_num) AS dw_total_routes'));
                }
                // schedueles_list
                if (dwData.routesList) {
                    queryBuilder.select(this.db.raw('GROUP_CONCAT(DISTINCT CONCAT(timetable, ' - ', timetable_type)) AS dw_schedueles_list'));
                }
                // total_working_days
                if (dwData.workedDaysCount) {
                    queryBuilder.select(this.db.raw('COUNT(DISTINCT work_date) AS dw_total_working_days'));
                }

                if (dwData.workedDaysCount) {
                    queryBuilder.select(this.db.raw('COUNT(DISTINCT CONCAT(timetable, ', ', timetable_type)) AS dw_total_schedueles_num'));
                }
            });

            const result = await query.first();
            return result;
        }

        catch (error) {
            console.error('Error: ', error);
        }
    }

}

module.exports = new DailyWork();