import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subMonths, parse } from 'date-fns';
import { ru } from 'date-fns/locale';

const PayslipForm = ({ onSave }) => {
    const [data, setData] = useState({
        payPeriod: '',
        advPaymentDate: null,
        advAmount: '',
        paymentDate: null,
        profit: '',
        totalPayment: '',
        routePayment: '',
        TFTPayment: '',
        bonusPayment: '',
        incomeTax: '',
        totalDeductions: '',
        onrouteTime: '',
        TFTTime: ''
    });
    const [hasChanged, setHasChanged] = useState(false);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
        setHasChanged(true);
    };

    const handleDateChange = (date, field) => {
        setData({
            ...data,
            [field]: date
        });
        setHasChanged(true);
    };

    const handleSave = (e) => {
        e.preventDefault();

        const parseAndValidatePayments = (input) => {
            return input.split(' ').reduce((acc, curr) => {
                const digit = parseFloat(curr);
                if (isNaN(digit)) {
                    throw new Error('Invalid number input');
                }
                return acc + digit;
            }, 0);
        };

        try {
            const routePayment = parseAndValidatePayments(data.routePayment);
            const TFTPayment = parseAndValidatePayments(data.TFTPayment);
            const bonusPayment = parseAndValidatePayments(data.bonusPayment);

            const payPeriodDate = parse(data.payPeriod, 'yyyy-MM', new Date());
            const formattedPayPeriod = format(payPeriodDate, 'yyyy-MM-dd');
            const formattedAdvPaymentDate = data.advPaymentDate ? format(data.advPaymentDate, 'yyyy-MM-dd') : null;
            const formattedPaymentDate = data.paymentDate ? format(data.paymentDate, 'yyyy-MM-dd') : null;

            const formData = {
                'pay_period': formattedPayPeriod,
                'adv_payment_date': formattedAdvPaymentDate,
                'adv_amount': parseFloat(data.advAmount),
                'payment_date': formattedPaymentDate,
                'profit': parseFloat(data.profit),
                'total_payment': parseFloat(data.totalPayment),
                'route_payment': routePayment,
                'TFT_payment': TFTPayment,
                'bonus_payment': bonusPayment,
                'income_tax': parseFloat(data.incomeTax),
                'total_deductions': parseFloat(data.totalDeductions),
                'onroute_time': parseFloat(data.onrouteTime),
                'TFT_time': parseFloat(data.TFTTime)
            };

            setHasChanged(false);
            onSave(formData);
        } catch (error) {
            console.log(error);
        }
    };

    const generateMonthOptions = () => {
        const options = [];
        for (let i = 0; i < 12; i++) {
            const date = subMonths(new Date(), i);
            options.push({
                label: format(date, 'LLLL yyyy', { locale: ru }),
                value: format(date, 'yyyy-MM')
            });
        }
        return options;
    };

    return (
        <form className="form" onSubmit={handleSave}>
            <div className="form__group">
                <label className="form__label">Период</label>
                <select className="form__input" name="payPeriod" value={data.payPeriod} onChange={handleChange} required>
                    <option value="">Выберите период</option>
                    {generateMonthOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="form__group">
                <label className="form__label">Дата аванса</label>
                <DatePicker
                    className="form__input"
                    selected={data.advPaymentDate}
                    onChange={(date) => handleDateChange(date, 'advPaymentDate')}
                    placeholderText="Выберите дату"
                    dateFormat="d MMMM, EEEE"
                    locale="ru"
                />
            </div>
            <div className="form__group">
                <label className="form__label">Сумма аванса на руки</label>
                <input className="form__input" type="number" name="advAmount" value={data.advAmount} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Дата З/П</label>
                <DatePicker
                    className="form__input"
                    selected={data.paymentDate}
                    onChange={(date) => handleDateChange(date, 'paymentDate')}
                    placeholderText="Выберите дату"
                    dateFormat="d MMMM, EEEE"
                    locale="ru"
                />
            </div>
            <div className="form__group">
                <label className="form__label">Сумма З/П на руки</label>
                <input className="form__input" type="number" name="profit" value={data.profit} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Начислено всего</label>
                <input className="form__input" type="number" name="totalPayment" value={data.totalPayment} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Начислено за рейсы</label>
                <input className="form__input" type="text" name="routePayment" value={data.routePayment} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Начислено за ПЗВ</label>
                <input className="form__input" type="text" name="TFTPayment" value={data.TFTPayment} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Начислено премиальных</label>
                <input className="form__input" type="text" name="bonusPayment" value={data.bonusPayment} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Подоходный налог (НДФЛ)</label>
                <input className="form__input" type="number" name="incomeTax" value={data.incomeTax} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Всего удержано</label>
                <input className="form__input" type="number" name="totalDeductions" value={data.totalDeductions} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Часы на линии</label>
                <input className="form__input" type="number" name="onrouteTime" value={data.onrouteTime} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Часы ПЗВ</label>
                <input className="form__input" type="number" name="TFTTime" value={data.TFTTime} onChange={handleChange} required />
            </div>
            <button className={`form__button button ${hasChanged ? 'button--active' : 'button--blocked'}`} type="submit" disabled={!hasChanged}>Сохранить</button>
        </form>
    );
};

export default PayslipForm;
