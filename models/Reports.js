const database = require('../database');

class Reports {
    constructor() {
        this.db = database;
        this.tableName = "reports";
    }

    getAllReports(profileId) {
        try {
            return this.db.select()
            .from(this.tableName)
            .where({ 'profile_id': profileId })
           
        } catch (err) {
            console.log(err);
        }
    }

    async createReport(dwFilter, payslipFilter, profileId, reportName, periodFrom, periodTo) {
        try {
            const data = {
                profile_id: profileId,
                rep_name: reportName,
                date_start: periodFrom,
                date_end: periodTo,
                dw_onroute_time: dwFilter ? dwFilter.dw_onroute_time : null,
                dw_TFT_time: dwFilter ? dwFilter.dw_TFT_time : null,
                dw_total_work_time: dwFilter ? dwFilter.dw_total_work_time : null,
                dw_total_dist: dwFilter ? dwFilter.dw_total_dist : null,
                dw_total_fueling: dwFilter ? dwFilter.dw_total_fueling : null,
                dw_ticket_sale_num: dwFilter ? dwFilter.dw_ticket_sale_num : null,
                total_shifts: dwFilter ? dwFilter.dw_total_shifts : null,
                total_routes: dwFilter ? dwFilter.dw_total_routes : null,
                total_schedueles_num: dwFilter ? dwFilter.dw_total_schedueles_num : null,
                schedueles_list: dwFilter ? dwFilter.dw_schedueles_list : null,
                total_working_days: dwFilter ? dwFilter.dw_total_working_days : null,
                p_onroute_time: payslipFilter ? payslipFilter.p_onroute_time : null,
                p_TFT_time: payslipFilter ? payslipFilter.p_TFT_time : null,
                p_total_work_time: payslipFilter ? payslipFilter.p_total_work_time : null,
                p_profit: payslipFilter ? payslipFilter.p_profit : null,
                p_income_tax: payslipFilter ? payslipFilter.p_income_tax : null,
                p_total_payment: payslipFilter ? payslipFilter.p_total_payment : null
            }

            const newReportId = await this.db(this.tableName).insert(data);

            return newReportId;
            
        } catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    }

    deleteReport(repId) {
        return this.db(this.tableName)
            .where('rep_id', repId)
            .del();
    }
}

module.exports = new Reports();