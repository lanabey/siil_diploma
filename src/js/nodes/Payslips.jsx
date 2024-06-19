import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

import PayslipForm from '../components/PayslipForm';

const Payslips = () => {
    const { getMonthYear } = useUtilityFunctions();

    const [payslips, setPayslips] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [infoActive, setInfoActive] = useState(false);
    const [formActive, setFormActive] = useState(false);
    const [activePayslip, setActivePayslip] = useState(null);

    useEffect(() => {
        fetchPayslips();
    }, []);

    const fetchPayslips = async () => {
        try {
            const response = await axios.get('/api/payslips/');
            setPayslips(response.data);

            const uniqueYears = [...new Set(response.data.map(payslip => new Date(payslip.pay_period).getFullYear()))];
            setYears(uniqueYears);

            if (uniqueYears.length > 0) {
                setSelectedYear(uniqueYears[uniqueYears.length - 1]);
            }
        } catch (error) {
            console.error('Error fetching payslips:', error);
        }
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleCreate = () => {
        setFormActive(true);
    };

    const handlePayslipClick = (payslip) => {
        setActivePayslip(payslip);
        setInfoActive(true);
    };

    const closeEditors = () => {
        setFormActive(false);
        setInfoActive(false);
        setActivePayslip(null);
    };

    const handleSave = async (formData) => {
        try {
            await axios.put(`/api/payslips/create`, formData);

            setActivePayslip(null);
            setFormActive(false);
            fetchPayslips();
        } catch (error) {
            console.error('Error saving a payslip:', error);
        }
    };

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Расчетные листки</h1>
                {(infoActive || formActive) && (
                    <button className="button button--active" type="button" onClick={closeEditors}>Назад</button>
                )}
            </div>
            
            {!(infoActive || formActive) && (
                <div className="list">
                    <button className="list__add" onClick={handleCreate}>Добавить</button>
                    <div className="list__item">
                        <div className="payslip__input--title">Выбрать год</div>
                        <select className="form__input payslip__input" id="year-select" value={selectedYear} onChange={handleYearChange}>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ul>
                        {payslips
                            .filter(payslip => new Date(payslip.pay_period).getFullYear() === parseInt(selectedYear))
                            .map((payslip, index) => (
                                <li className="payslip__period" key={index} onClick={() => handlePayslipClick(payslip)}>
                                    {getMonthYear(payslip.pay_period)}
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {infoActive && (
                <div>
                    <div className="form__group">
                        <div className="form__label">Чистый доход</div>
                        <div className="form__input form__input--black">{activePayslip.profit + activePayslip.adv_amount}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Начислено всего</div>
                        <div className="form__input form__input--black">{activePayslip.total_payment}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Часы на линии</div>
                        <div className="form__input form__input--black">{activePayslip.onroute_time}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Начислено за рейсы</div>
                        <div className="form__input form__input--black">{activePayslip.route_payment}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Часы ПЗВ</div>
                        <div className="form__input form__input--black">{activePayslip.TFT_time}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Начислено за ПЗВ</div>
                        <div className="form__input form__input--black">{activePayslip.TFT_payment}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Начислено премиальных</div>
                        <div className="form__input form__input--black">{activePayslip.bonus_payment}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Подоходный налог (НДФЛ)</div>
                        <div className="form__input form__input--black">{activePayslip.income_tax}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Сумма аванса</div>
                        <div className="form__input form__input--black">{activePayslip.adv_amount}</div>
                    </div>
                    <div className="form__group">
                        <div className="form__label">Сумма З/П</div>
                        <div className="form__input form__input--black">{activePayslip.profit}</div>
                    </div>
                </div>
            )}

            {formActive && (
                <PayslipForm onSave={handleSave} />
            )}
        </div>
    );
};

export default Payslips;
