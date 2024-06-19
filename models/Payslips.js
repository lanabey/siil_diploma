const database = require('../database');

class Payslips {
    constructor() {
        this.db = database;
        this.tableName = "payslips";
    }

    getPayslips(profileId) {
        try {
            return this.db.select()
                .from(this.tableName)
                .where({ 'profile_id': profileId });
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    createPayslip(data) {
        try {
            return this.db(this.tableName).insert(data)
                .then((res) => res[0]);
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // createPayslip(profileId, payslipData) {
    //     const insertData = {
    //         profile_id: profileId,
    //         pay_period: payslipData.payPeriod,
    //         adv_save: payslipData.advSave ? 1 : 0,
    //     };

    //     if (payslipData.advSave) {
    //         // Пользователь сохраняет аванс
    //         insertData.adv_payment_date = payslipData.advPaymentDate;
    //         insertData.adv_amount = payslipData.advAmount;
    //     }

    //     else {
    //         // Пользователь заполняет всю таблицу сразу
    //         Object.assign(insertData, {
    //             adv_payment_date: payslipData.advPaymentDate,
    //             adv_amount: payslipData.advAmount,
    //             payment_date: payslipData.paymentDate,
    //             profit: payslipData.profit,
    //             total_payment: payslipData.totalPayment,
    //             route_payment: payslipData.routePayment,
    //             TFT_payment: payslipData.TFTPayment,
    //             bonus_payment: payslipData.bonusPayment,
    //             income_tax: payslipData.incomeTax,
    //             total_deductions: payslipData.totalDeductions,
    //             onroute_time: payslipData.onrouteTime,
    //             TFT_time: payslipData.TFTTime,
    //         });
    //     }
    //     return this.db(this.tableName).insert(insertData);
    // }

    updatePayslip(profileId, payPeriod, payslipData) {
        return this.db
            .from(this.tableName)
            .where({ profile_id: profileId, pay_period: payPeriod, adv_save: 1 })
            .update({
                // Позьзователь до-заполняет данные
                payment_date: payslipData.paymentDate,
                profit: payslipData.profit,
                total_payment: payslipData.totalPayment,
                route_payment: payslipData.routePayment,
                TFT_payment: payslipData.TFTPayment,
                bonus_payment: payslipData.bonusPayment,
                income_tax: payslipData.incomeTax,
                total_deductions: payslipData.totalDeductions,
                onroute_time: payslipData.onrouteTime,
                TFT_time: payslipData.TFTTime,
            });
    }

    getFilledPayslip(profileId, payPeriod) {
        return this.db
            .from(this.tableName)
            .where({
                profile_id: profileId,
                pay_period: payPeriod,
                adv_payment_date: this.db.raw('IS NOT NULL'),
                payment_date: this.db.raw('IS NOT NULL'),
            })
            .select(
                this.db.raw('adv_amount + profit AS totalProfit'),
                'total_payment',
                'onroute_time',
                'route_payment',
                'TFT_time',
                'TFT_payment',
                'bonus_payment',
                'income_tax',
                'adv_amount',
                'profit'
            )
            .first()
            .then(result => {
                if (!result) {
                    throw new Error('Payslip not found or contains null fields');
                }
                return result;
            });
    }

    isDataFull(profileId, payPeriod) {
        return this.db
            .from(this.tableName)
            .where({ profile_id: profileId, pay_period: payPeriod })
            .select('adv_save', 'onroute_time')
            .first()
            .then(result => {
                if (result && ((result.adv_save === 1 || result.adv_save === 0) && result.onroute_time !== null)) {
                    return true;
                } else {
                    return false;
                }
            });
    }

    async filterPayslips(payslipData) {
        try {
            const query = this.db(this.tableName)
                .where('profile_id', payslipData.profile_id)
                .andWhere('pay_period', '>=', payslipData.periodFrom)
                .andWhere('pay_period', '<=', payslipData.periodTo);

            query.modify((queryBuilder) => {
                if (payslipData.takeHomePay) {
                    queryBuilder.select(this.db.raw('SUM(profit) AS p_profit'));
                }
                if (payslipData.totalAccrued) {
                    queryBuilder.select(this.db.raw('SUM(total_payment) AS p_total_payment'));
                }
                if (payslipData.incomeTax) {
                    queryBuilder.select(this.db.raw('SUM(income_tax) AS p_income_tax'));
                }
            });

            const result = await query.first();
            return result;

        } catch (error) {
            console.error('Error: ', error);
        }
    }
}

module.exports = new Payslips();