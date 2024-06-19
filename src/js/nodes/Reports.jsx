import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

import ReportForm from '../components/ReportForm';

const Reports = () => {
    const { formatDateInReport, decimalToTime } = useUtilityFunctions();

    const [reports, setReports] = useState([]);
    const [formActive, setFormActive] = useState(false);
    const [infoActive, setInfoActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [activeReport, setActiveReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports/all');
            setReports(response.data);

        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleCreate = () => {
        setFormActive(true);
    };

    const handleReportClick = (report) => {
        setActiveReport(report);
        setInfoActive(true);
    };

    const confirmDelete = (report) => {
        setReportToDelete(report);
        setModalVisible(true);
    };

    const closeEditors = () => {
        setFormActive(false);
        setInfoActive(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/reports/delete`, { data: { rep_id: reportToDelete.rep_id } });

            setModalVisible(false);
            fetchReports();
        } catch (error) {
            console.error('Error deleting a report:', error);
        }
    };

    const handleSave = async (formData) => {
        try {
            await axios.put(`/api/reports/create`, formData);

            setFormActive(false);
            fetchReports();
        } catch (error) {
            console.error('Error saving a report:', error);
        }
    };

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Отчеты</h1>
                {(infoActive || formActive) && (
                    <button className="button button--active" type="button" onClick={closeEditors}>Назад</button>
                )}
            </div>

            {!(infoActive || formActive) && (
                <div className="list">
                    <button className="list__add list__add--narrow" onClick={handleCreate}>Добавить отчет</button>

                    {reports.map((report, index) => (
                        <div className="list__item" key={index}>
                            <div className="list__card" onClick={() => handleReportClick(report)}>
                                <div className="list__column">
                                    <h2 className="list__line">{report.rep_name}</h2>
                                    {/* <p className="list__line">{formatDateInReport(report.date)}</p> */}
                                </div>
                            </div>
                            <div className="list__buttons">
                                <button type="button" className="form__editor--button" onClick={() => confirmDelete(report)}>
                                    <img src="/images/delete.svg" alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {formActive && (
                <ReportForm onSave={handleSave} />
            )}

            {infoActive && (
                <div>
                    <div className="report__subtitle">Период</div>
                    <span>с </span><span className="report__subtitle report__subtitle--date">{formatDateInReport(activeReport.date_start)} </span><span>по </span><span className="report__subtitle report__subtitle--date">{formatDateInReport(activeReport.date_end)}</span>

                    <div className="report__grid">

                        {activeReport.dw_onroute_time && (
                            <>
                                <div className="report__cell">Время работы на линии</div>
                                <div className="report__cell report__cell--right">{decimalToTime(activeReport.dw_onroute_time)}</div>
                            </>
                        )}

                        {activeReport.dw_TFT_time && (
                            <>
                                <div className="report__cell">Часы ПЗВ</div>
                                <div className="report__cell report__cell--right">{decimalToTime(activeReport.dw_TFT_time)}</div>
                            </>
                        )}

                        {activeReport.dw_total_work_time && (
                            <>
                                <div className="report__cell">Общее время работы</div>
                                <div className="report__cell report__cell--right">{decimalToTime(activeReport.dw_total_work_time)}</div>
                            </>
                        )}

                        {activeReport.dw_total_dist && (
                            <>
                                <div className="report__cell">Всего пройдено (км)</div>
                                <div className="report__cell report__cell--right">{activeReport.dw_total_dist}</div>
                            </>
                        )}

                        {activeReport.dw_total_fueling && (
                            <>
                                <div className="report__cell">Всего заправлено</div>
                                <div className="report__cell report__cell--right">{activeReport.dw_total_fueling}</div>
                            </>
                        )}

                        {activeReport.dw_ticket_sale_num && (
                            <>
                                <div className="report__cell">Всего билетов продано</div>
                                <div className="report__cell report__cell--right">{activeReport.dw_ticket_sale_num}</div>
                            </>
                        )}

                        {(activeReport.p_onroute_time ||
                            activeReport.p_TFT_time ||
                            activeReport.p_total_work_time ||
                            activeReport.p_profit ||
                            activeReport.p_income_tax ||
                            activeReport.p_total_payment) && (
                                <div className="report__cell report__cell--title">Из расчетного листка</div>
                        )}

                        {activeReport.p_onroute_time && (
                            <>
                                <div className="report__cell">Время работы на линии</div>
                                <div className="report__cell report__cell--right">{decimalToTime(activeReport.p_onroute_time)}</div>
                            </>
                        )}

                        {activeReport.p_TFT_time && (
                            <>
                                <div className="report__cell">Часы ПЗВ</div>
                                <div className="report__cell report__cell--right">{decimalToTime(activeReport.p_TFT_time)}</div>
                            </>
                        )}

                        {activeReport.p_total_work_time && (
                            <>
                                <div className="report__cell">Общее время работы</div>
                                <div className="report__cell report__cell--right">{decimalToTime(activeReport.p_total_work_time)}</div>
                            </>
                        )}

                        {activeReport.p_profit && (
                            <>
                                <div className="report__cell">Заработная плата (р)</div>
                                <div className="report__cell report__cell--right">{activeReport.p_profit}</div>
                            </>
                        )}

                        {activeReport.p_income_tax && (
                            <>
                                <div className="report__cell">Удержано НДФЛ</div>
                                <div className="report__cell report__cell--right">{activeReport.p_income_tax}</div>
                            </>
                        )}

                        {activeReport.p_total_payment && (
                            <>
                                <div className="report__cell">Всего начислено</div>
                                <div className="report__cell report__cell--right">{activeReport.p_total_payment}</div>
                            </>
                        )}

                        {activeReport.total_shifts && (
                            <>
                                <div className="report__cell">Всего смен отработано</div>
                                <div className="report__cell report__cell--right">{activeReport.total_shifts}</div>
                            </>
                        )}

                        {activeReport.total_routes && (
                            <>
                                <div className="report__cell">Всего маршрутов пройдено</div>
                                <div className="report__cell report__cell--right">{activeReport.total_routes}</div>
                            </>
                        )}

                        {activeReport.total_schedueles_num && (
                            <>
                                <div className="report__cell">Уникальных маршрутов</div>
                                <div className="report__cell report__cell--right">{activeReport.total_schedueles_num}</div>
                            </>
                        )}

                        {/* Uncomment and add condition if you want to display the unique schedules list */}
                        {/* {activeReport.schedueles_list && (
                            <>
                                <div className="report__cell">Список уникальных маршрутов</div>
                                <div className="report__cell report__cell--right">{activeReport.schedueles_list}</div>
                            </>
                        )} */}

                        {activeReport.total_working_days && (
                            <>
                                <div className="report__cell">Дней отработано</div>
                                <div className="report__cell report__cell--right">{activeReport.total_working_days}</div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal__content">
                        <h2>Вы уверены, что хотите удалить этот отчет?</h2>
                        <button className="modal__button button button--active" onClick={handleDelete}>Да</button>
                        <button className="modal__button button" onClick={() => setModalVisible(false)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
