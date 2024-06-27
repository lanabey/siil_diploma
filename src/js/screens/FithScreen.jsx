import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { resetData } from '../redux/actions/actions';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

const fifthScreen = ({ resetScreen }) => {
    const { getRoutePrefix, getLastTwoChars, decimalToTime } = useUtilityFunctions();

    const firstScreenState = useSelector((state) => state.data.firstScreen);
    const secondScreenState = useSelector((state) => state.data.secondScreen);
    const fourthScreenState = useSelector((state) => state.data.fourthScreen);
    // const dispatch = useDispatch();

    const [selectedRoute, setSelectedRoute] = useState({ timetable: '', timetable_type: null });
    const [bus, setBus] = useState({});

    useEffect(() => {
        if (firstScreenState) {
            setSelectedRoute(firstScreenState.selectedRoute || {});
            setBus(firstScreenState.busData || {});
        }
    }, []);

    const calcOdometer = () => {
        let odometer = 0;
        if (fourthScreenState.odometer && secondScreenState.odometer) {
            const v1 = parseInt(fourthScreenState.odometer);
            const v2 = parseInt(secondScreenState.odometer);
            odometer = v1 - v2;
        }
        return odometer;
    }

    return (
        <div>
            <div className="section__header">
                <h2 className="section__title">Итоги дня</h2>
            </div>
            <div>
                <div className="form__group form__group--row form__group--center form__group--spread">
                    <div className="report__text">Маршрут</div>
                    <div className="report__text">{getRoutePrefix(selectedRoute.timetable)}</div>
                    <div className="report__text">Выезд</div>
                    <div className="report__text">{getLastTwoChars(selectedRoute.timetable)}</div>
                </div>
                <div className="report__bus">
                    <div className="report__text">Автобус</div>
                    <div className="report__icon">
                        <img src="/images/bus_pattern.webp" alt="Bus" />
                    </div>
                    <div className="report__col">
                        <div className="report__line report__bus--line">
                            <div className="report__text">{bus.bus_brand ? bus.bus_brand : ''}</div>
                        </div>
                        <div className="report__line report__bus--line">
                            <div className="report__text">{bus.plate_number ? bus.plate_number : ''}</div>
                        </div>
                        <div className="report__line report__bus--line">
                            <div className="report__text">{bus.bus_number ? bus.bus_number : ''}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="report__grid">
                <div className="report__cell">Всего рейсов</div>
                <div className="report__cell report__cell--right">{fourthScreenState.tripCount ? fourthScreenState.tripCount : 0}</div>

                <div className="report__cell">Количество смен</div>
                <div className="report__cell report__cell--right">{firstScreenState.shift == 'double' ? 2 : 1}</div>

                <div className="report__cell">Пройдено пути (км)</div>
                <div className="report__cell report__cell--right">{calcOdometer()}</div>

                <div className="report__cell">Время на линии</div>
                <div className="report__cell report__cell--right">{firstScreenState.toRecord ? firstScreenState.toRecord : '00:00'}</div>

                <div className="report__cell">ПЗВ</div>
                <div className="report__cell report__cell--right">{decimalToTime(fourthScreenState.tft)}</div>

                <div className="report__cell">Заправлено топлива (л)</div>
                <div className="report__cell report__cell--right">{fourthScreenState.totalRefill ? fourthScreenState.totalRefill : 0}</div>

                <div className="report__cell">Z-отчет (р)</div>
                <div className="report__cell report__cell--right">{fourthScreenState.income ? fourthScreenState.income : 0}</div>
            </div>

            <button className="button button--active" type='button' onClick={() => resetScreen()}>Новая смена</button>
        </div>

    );
};

export default fifthScreen;



