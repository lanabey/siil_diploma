import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ZReportCalculator = ({ reportIncome, onCalcClose }) => {
    const [zReport, setZReport] = useState(reportIncome);
    const [ticketsSold, setTicketsSold] = useState(0);
    const [ticketPrice, setTicketPrice] = useState(0);
    const [quantities, setQuantities] = useState({ q1: 0, q2: 0, q3: 0, q4: 0 });
    const [bill, setBill] = useState(0);
    const [total, setTotal] = useState(0);
    const [result, setResult] = useState('');

    useEffect(() => {
        axios.get(`/api/user/profile`)
            .then(response => {
                setTicketPrice(response.data.ticket_price);
            })
            .catch(error => {
                console.error('Error fetching ticket price:', error);
            });
    }, []);

    useEffect(() => {
        const sums = [
            quantities.q1 * 1,
            quantities.q2 * 2,
            quantities.q3 * 5,
            quantities.q4 * 10,
        ];
        const sumTotal = sums.reduce((acc, sum) => acc + sum, 0);
        setTotal(sumTotal + Number(bill));

        const zReportValue = Number(zReport);
        if (zReportValue === sumTotal + Number(bill)) {
            setResult('Верно');
        } else if (zReportValue > sumTotal + Number(bill)) {
            setResult(`Не верно, не хватает ${zReportValue - (sumTotal + Number(bill))}`);
        } else {
            setResult(`Больше на ${sumTotal + Number(bill) - zReportValue}`);
        }
    }, [quantities, bill, zReport]);

    useEffect(() => {
        if (zReport && ticketPrice) {
            setTicketsSold(Math.floor(zReport / ticketPrice));
        }
    }, [zReport, ticketPrice]);

    const handleZReportChange = (e) => {
        const value = e.target.value;
        setZReport(value);
        if (ticketPrice > 0) {
            setTicketsSold(Math.floor(value / ticketPrice));
        }
    };

    const handleQuantityChange = (e) => {
        const { name, value } = e.target;
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [name]: value,
        }));
    };

    const handleBillChange = (e) => {
        setBill(e.target.value);
    };

    const closeCalculator = () => {
        setZReport('');
        onCalcClose();
    }

    return (
        <div className="modal">
            <div className="calculator modal__content">
                <div className="calculator__header form__group form__group--row form__group--center form__group--spread form__group--margin">
                    <span className="form__label">Z-отчет</span>
                    <input className="form__input form__input--calculator" type="number" value={zReport} onChange={handleZReportChange} />
                    <button className="modal__close modal__close--calculator" onClick={closeCalculator}></button>
                </div>
                <div className="form__group form__group--row form__group--center form__group--spread form__group--margin">
                    <div className="form__label">Продано билетов: </div>
                    <div className="calculator__amount">{ticketsSold}</div>
                </div>
                <div className="calculator__section">
                    <h2>Калькулятор</h2>
                    <div className="calculator__grid">
                        <div className="calculator__label">Деньги</div>
                        <div className="calculator__label">Кол-во</div>
                        <div className="calculator__label calculator__label--right">Сумма</div>
                        <div className="calculator__icon">
                            <img src="/images/one_rub.svg" alt="Calculator" />
                        </div>
                        <input className="form__input form__input--calculator" type="number" name="q1" value={quantities.q1} onChange={handleQuantityChange} />
                        <div className="calculator__amount">{quantities.q1 * 1} ₽</div>
                        <div className="calculator__icon">
                            <img src="/images/two_rub.svg" alt="Calculator" />
                        </div>
                        <input className="form__input form__input--calculator" type="number" name="q2" value={quantities.q2} onChange={handleQuantityChange} />
                        <div className="calculator__amount">{quantities.q2 * 2} ₽</div>
                        <div className="calculator__icon">
                            <img src="/images/five_rub.svg" alt="Calculator" />
                        </div>
                        <input className="form__input form__input--calculator" type="number" name="q3" value={quantities.q3} onChange={handleQuantityChange} />
                        <div className="calculator__amount">{quantities.q3 * 5} ₽</div>
                        <div className="calculator__icon">
                            <img src="/images/ten_rub.svg" alt="Calculator" />
                        </div>
                        <input className="form__input form__input--calculator" type="number" name="q4" value={quantities.q4} onChange={handleQuantityChange} />
                        <div className="calculator__amount">{quantities.q4 * 10} ₽</div>
                    </div>

                    <div className="form__group form__group--row form__group--center form__group--spread form__group--margin">
                        <span>Купюры</span>
                        <input className="form__input form__input--calculator" type="number" value={bill} onChange={handleBillChange} />
                    </div>
                </div>

                <div className="form__group form__group--row form__group--center form__group--spread form__group--margin">
                    <span className="calculator__subtitle">Итого</span>
                    <div className="calculator__amount">{total}</div>
                </div>
                <div className="form__group form__group--row form__group--center form__group--spread form__group--margin">
                    <span>Результат: {result}</span>
                </div>
            </div>
        </div>
    );
};

export default ZReportCalculator;
