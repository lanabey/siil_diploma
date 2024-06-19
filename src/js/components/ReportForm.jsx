import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

const ReportForm = ({ onSave }) => {
    const [data, setData] = useState({
        reportName: '',
        periodFrom: null,
        periodTo: null,
        timeOnRoute: false,
        tftAccount: false,
        totalWorkedTime: false,
        takeHomePay: false,
        totalAccrued: false,
        incomeTax: false,
        mileage: false,
        refueledDiesel: false,
        ticketsSold: false,
        shiftsCount: false,
        routesCount: false,
        routesList: false,
        workedDaysCount: false,
        compareWithPayslip: false
    });

    const [hasChanged, setHasChanged] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData({
            ...data,
            [name]: type === 'checkbox' ? checked : value
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

        try {
            const periodFromDate = data.periodFrom instanceof Date ? data.periodFrom : parse(data.periodFrom, 'yyyy-MM-dd', new Date());
            const periodToDate = data.periodTo instanceof Date ? data.periodTo : parse(data.periodTo, 'yyyy-MM-dd', new Date());
    
            const formattedPeriodFrom = periodFromDate ? format(periodFromDate, 'yyyy-MM-dd') : null;
            const formattedPeriodTo = periodToDate ? format(periodToDate, 'yyyy-MM-dd') : null;
    
            const reportData = {
                ...data,
                periodFrom: formattedPeriodFrom,
                periodTo: formattedPeriodTo
            };
    
            setHasChanged(false);
            onSave(reportData);
        } catch (error) {
            console.log(error);
        }
    };

    const setPeriod = (period) => {
        let from, to;
        const now = new Date();

        if (period === 'month') {
            from = startOfMonth(subMonths(now, 1));
            to = endOfMonth(subMonths(now, 1));
        } else if (period === 'quarter') {
            from = startOfQuarter(subMonths(now, 3));
            to = endOfQuarter(subMonths(now, 3));
        } else if (period === 'year') {
            from = startOfYear(subYears(now, 1));
            to = endOfYear(subYears(now, 1));
        }

        setData({
            ...data,
            periodFrom: from,
            periodTo: to
        });
        setHasChanged(true);
    };

    return (
        <form className="form" onSubmit={handleSave}>
            <div className="form__group">
                <label className="form__label">Название</label>
                <input className="form__input" type="text" name="reportName" value={data.reportName} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Период с</label>
                <DatePicker
                    className="form__input"
                    selected={data.periodFrom}
                    onChange={(date) => handleDateChange(date, 'periodFrom')}
                    placeholderText="Выберите дату"
                    dateFormat="dd.MM.yyyy"
                    required
                />
            </div>
            <div className="form__group">
                <label className="form__label">Период по</label>
                <DatePicker
                    className="form__input"
                    selected={data.periodTo}
                    onChange={(date) => handleDateChange(date, 'periodTo')}
                    placeholderText="Выберите дату"
                    dateFormat="dd.MM.yyyy"
                    required
                />
            </div>
            <div className="form__group form__group--row form__group--spread">
                <button className="button button--active button--small" type="button" onClick={() => setPeriod('month')}>Месяц</button>
                <button className="button button--active button--small" type="button" onClick={() => setPeriod('quarter')}>Квартал</button>
                <button className="button button--active button--small" type="button" onClick={() => setPeriod('year')}>Год</button>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="timeOnRoute" id="timeOnRoute" checked={data.timeOnRoute} onChange={handleChange} />
                <label className="form__label" htmlFor="timeOnRoute">Время работы на линии</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="tftAccount" id="tftAccount" checked={data.tftAccount} onChange={handleChange} />
                <label className="form__label" htmlFor="tftAccount">Учет ПЗВ</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="totalWorkedTime" id="totalWorkedTime" checked={data.totalWorkedTime} onChange={handleChange} />
                <label className="form__label" htmlFor="totalWorkedTime">Общее отработанное время</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="takeHomePay" id="takeHomePay" checked={data.takeHomePay} onChange={handleChange} />
                <label className="form__label" htmlFor="takeHomePay">Заработная плата на руки</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="totalAccrued" id="totalAccrued" checked={data.totalAccrued} onChange={handleChange} />
                <label className="form__label" htmlFor="totalAccrued">Начислено всего</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="incomeTax" id="incomeTax" checked={data.incomeTax} onChange={handleChange} />
                <label className="form__label" htmlFor="incomeTax">Подоходный налог (НДФЛ)</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="mileage" id="mileage" checked={data.mileage} onChange={handleChange} />
                <label className="form__label" htmlFor="mileage">Пройденный километраж</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="refueledDiesel" id="refueledDiesel" checked={data.refueledDiesel} onChange={handleChange} />
                <label className="form__label" htmlFor="refueledDiesel">Заправленное дизельное топливо</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="ticketsSold" id="ticketsSold" checked={data.ticketsSold} onChange={handleChange} />
                <label className="form__label" htmlFor="ticketsSold">Количество проданных билетов</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="shiftsCount" id="shiftsCount" checked={data.shiftsCount} onChange={handleChange} />
                <label className="form__label" htmlFor="shiftsCount">Количество смен</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="routesCount" id="routesCount" checked={data.routesCount} onChange={handleChange} />
                <label className="form__label" htmlFor="routesCount">Количество рейсов</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="routesList" id="routesList" disabled={true} checked={data.routesList} onChange={handleChange} />
                <label className="form__label" htmlFor="routesList">Список маршрутов</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="workedDaysCount" id="workedDaysCount" checked={data.workedDaysCount} onChange={handleChange} />
                <label className="form__label" htmlFor="workedDaysCount">Количество отработанных дней</label>
            </div>
            <div className="form__group form__group--checkbox">
                <input className="form__input" type="checkbox" name="compareWithPayslip" id="compareWithPayslip" disabled={true} checked={data.compareWithPayslip} onChange={handleChange} />
                <label className="form__label" htmlFor="compareWithPayslip">Сравнить с расчетным листком</label>
            </div>

            <button className={`form__button button ${hasChanged ? 'button--active' : 'button--blocked'}`} type="submit" disabled={!hasChanged}>Сохранить</button>
        </form>
    );
};

export default ReportForm;
