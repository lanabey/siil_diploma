import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFourth } from '../redux/actions/actions';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';
import axios from 'axios';
import { debounce } from "lodash";

import Calculator from "../components/Calculator";

const fourthScreen = () => {
    const { isPositiveNumber, validateTime, timeToMinutes, timeToDecimal } = useUtilityFunctions();

    const savedState = useSelector((state) => state.data.fourthScreen);
    const firstScreenState = useSelector((state) => state.data.firstScreen);
    const secondScreenState = useSelector((state) => state.data.secondScreen);
    const dispatch = useDispatch();

    const [tripCount, setTripCount] = useState(0);
    const [income, setIncome] = useState(0);
    const [firstRefill, setFirstRefill] = useState('');
    const [secondRefill, setSecondRefill] = useState('');
    const [lastRefill, setLastRefill] = useState('');
    const [totalRefill, setTotalRefill] = useState(0);
    const [reason, setReason] = useState('');
    const [skipTime1, setSkipTime1] = useState('');
    const [skipTime2, setSkipTime2] = useState('');
    const [skipTime3, setSkipTime3] = useState('');
    const [skipTime4, setSkipTime4] = useState('');
    const [odometer, setOdometer] = useState('');
    const [routeDist, setRouteDist] = useState(0);
    const [leaveTime, setLeaveTime] = useState(null);
    const [tft, setTft] = useState(0);
    const [showDialogue, setShowDialogue] = useState(false);
    const [calc, setCalc] = useState(false);

    useEffect(() => {
        if (savedState) {
            setTripCount(savedState.tripCount || 0);
            setIncome(savedState.income || 0);
            setFirstRefill(savedState.firstRefill || '');
            setSecondRefill(savedState.secondRefill || '');
            setLastRefill(savedState.lastRefill || '');
            setReason(savedState.reason || '');
            setSkipTime1(savedState.skipTime1 || '');
            setSkipTime2(savedState.skipTime2 || '');
            setSkipTime3(savedState.skipTime3 || '');
            setSkipTime4(savedState.skipTime4 || '');
            setOdometer(savedState.odometer || '');
            setLeaveTime(savedState.leaveTime || '');
            setTotalRefill(savedState.totalRefill || 0);
            setTft(savedState.tft || 0);
        }
    }, []);

    useEffect(() => {
        const fuel = calcFuel();

        setTotalRefill(fuel);
    }, [firstRefill, secondRefill, lastRefill]);

    useEffect(() => {
        const time = calcWorkTFTTime();

        setTft(time);
    }, [leaveTime]);

    useEffect(() => {
        debouncedUpdate();

        return () => debouncedUpdate.cancel();
    }, [dispatch, tripCount, income, firstRefill, secondRefill, lastRefill, reason, skipTime1, skipTime2, skipTime3, skipTime4, odometer, leaveTime, tft, totalRefill]);

    useEffect(() => {
        const fetchRouteNum = () => {
            axios.post('api/routenum', { timetable: firstScreenState.selectedRoute.timetable, timetable_type: firstScreenState.selectedRoute.timetable_type })
                .then(response => {
                    let count = parseInt(response.data.bus_routes_num);

                    if (isNaN(count)) {
                        count = 0;
                    }

                    setTripCount(count);
                })
                .catch(error => {
                    console.error('Failed to load trips number:', error);
                });
        };

        if (firstScreenState.selectedRoute.timetable) {
            fetchRouteNum();
        }
    }, []);

    useEffect(() => {
        const fetchAtpRouteDist = () => {
            axios.post('api/routedist', { timetable: firstScreenState.selectedRoute.timetable, timetable_type: firstScreenState.selectedRoute.timetable_type })
                .then(response => {
                    let v1 = parseFloat(response.data.dist_trmnl_one);
                    let v2 = parseFloat(response.data.dist_trmnl_two);

                    if (isNaN(v1)) v1 = 0;

                    if (isNaN(v2)) v2 = 0;

                    setRouteDist(v1 + v2);
                })
                .catch(error => {
                    console.error('Failed to load trips number:', error);
                });
        };

        if (firstScreenState.selectedRoute.timetable) {
            fetchAtpRouteDist();
        }
    }, []);

    const dispatchChanges = () => {
        const localState = { tripCount, income, firstRefill, secondRefill, lastRefill, skipTime1, skipTime2, skipTime3, skipTime4, odometer, leaveTime, tft, totalRefill };

        if (reason) {
            localState.reason = reason;
        }

        dispatch(updateFourth(localState));
    }

    const debouncedUpdate = debounce(dispatchChanges, 300);

    const addTrip = () => {
        setTripCount(tripCount + 1);
    }

    const subtractTrip = () => {
        if (tripCount > 0) {
            setTripCount(tripCount - 1);
        }
    }

    const calcOdometer = () => {
        const v1 = parseInt(odometer);
        const v2 = parseInt(secondScreenState.odometer);

        return isNaN(v1) || isNaN(v2) ? 0 : v1 - v2;
    }

    const calcFuel = () => {
        let v1 = parseFloat(firstRefill);
        let v2 = parseFloat(secondRefill);
        let v3 = parseFloat(lastRefill);

        if (isNaN(v1)) v1 = 0;
        if (isNaN(v2)) v2 = 0;
        if (isNaN(v3)) v3 = 0;

        return v1 + v2 + v3;
    }

    const calcRouteDist = () => {
        const odm = calcOdometer();

        return odm - routeDist;
    }

    const sumLunchTime = () => {
        const totalMinutes = [skipTime1, skipTime2, skipTime3, skipTime4]
            .reduce((acc, time) => acc + timeToMinutes(time), 0);

        const totalHours = (totalMinutes / 60).toFixed(2);

        return parseFloat(totalHours);
    }

    const calcWorkTFTTime = () => {
        let fromPark = timeToMinutes(firstScreenState.fromPark);
        let toPark = timeToMinutes(firstScreenState.toPark);
        let time = timeToMinutes(secondScreenState.time);
        let leave = timeToMinutes(leaveTime);

        if (leave < toPark) {
            leave += 1440;
        }
    
        const departureEnterDiff = fromPark - time;
        const exitComebackDiff = leave - toPark;
    
        const totalTimeInMinutes = departureEnterDiff + exitComebackDiff;
        const totalTimeInHours = Math.round((totalTimeInMinutes / 60) * 100) / 100;
    
        return totalTimeInHours;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            const data = {
                work_date: firstScreenState.date,
                plate_number: firstScreenState.busData.plate_number,
                timetable: firstScreenState.selectedRoute.timetable,
                timetable_type: firstScreenState.selectedRoute.timetable_type,
                shift_type: firstScreenState.shift,
                enter_time: secondScreenState.time,
                bus_malfunction: secondScreenState.malfunction ? 1 : 0,
                malfunction_reas: secondScreenState.malfunction ? secondScreenState.malfunction : null,
                // malfunction_photo: data.malfunction_photo,
                odometer_start: secondScreenState.odometer,
                odometer_end: odometer,
                total_dist: calcOdometer(),
                single_route_dist: calcRouteDist(),
                work_routes_num: tripCount,
                shifts_num: firstScreenState.shift == 'double' ? 2 : 1,
                route_num_deviation: reason,
                lunch_intraffic_time: sumLunchTime(),
                // ticketsale_amount: data.ticketsale_amount,
                ticketsale_num: income,
                first_fueling: firstRefill,
                // first_fueling_photo: data.first_fueling_photo,
                refueling: secondRefill,
                // refueling_photo: data.refueling_photo,
                final_fueling: lastRefill ? lastRefill : 0,
                // final_fueling_photo: data.final_fueling_photo,
                total_fueling: totalRefill,
                // dispach_note: data.dispach_note,
                exit_time: leaveTime,
                work_onroute_time: timeToDecimal(firstScreenState.toRecord),
                work_TFT_time: tft,
            }

            axios.post('api/dailywork', data)
                .then(response => {
                    console.log('Report uploaded successfully!', response.data);
                })
                .catch(error => {
                    console.error('Failed to upload report:', error);
                });
        } catch (error) {
            console.error('Failed to fetch routes:', error);
        }
    }

    return (
        <div className="screens__main">
            <h1 className="screens__title">Завершение работы</h1>
            <form onSubmit={handleSubmit}>
                <div className="form__group">
                    <div className="screens__report screens__report--lable">Укажите количество рейсов</div>
                    <div className="screens__row screens__row--center">
                        <span className="screens__report screens__report--right screens__report--large">{tripCount}</span>
                        <button className="button screens__controls screens__controls--green screens__controls--report" type='button' onClick={() => addTrip()}>+</button>
                        <button className="button screens__controls screens__controls--red screens__controls--report" type='button' onClick={() => subtractTrip()}>-</button>
                    </div>
                </div>

                <button className="button screens__report screens__report--button" type='button' onClick={() => setShowDialogue(true)}>Описать изменения на маршруте</button>
                {showDialogue && (
                    <div className="form__group">
                        <label>
                            <span className="screens__report screens__report--lable">Укажите причину изменения количества рейсов</span>
                            <textarea className="form__input" cols="30" rows="5" value={reason} onChange={e => setReason(e.target.value)}></textarea>
                        </label>
                        <label>
                            <span className="screens__report screens__report--lable">Укажите время, потраченное на обед в пробки</span>
                            <input className="form__input" type="text" value={skipTime1} onChange={e => setSkipTime1(e.target.value)} />
                            {(skipTime1 !== '' && !validateTime(skipTime1)) && (
                                <span>Некорректное значение, введите значение в формате чч:мм</span>
                            )}
                        </label>
                        <label>
                            <span className="screens__report screens__report--lable">Укажите время, потраченное на обед в пробки</span>
                            <input className="form__input" type="text" value={skipTime2} onChange={e => setSkipTime2(e.target.value)} />
                            {(skipTime2 !== '' && !validateTime(skipTime2)) && (
                                <span>Некорректное значение, введите значение в формате чч:мм</span>
                            )}
                        </label>
                        <label>
                            <span className="screens__report screens__report--lable">Укажите время, потраченное на обед в пробки</span>
                            <input className="form__input" type="text" value={skipTime3} onChange={e => setSkipTime3(e.target.value)} />
                            {(skipTime3 !== '' && !validateTime(skipTime3)) && (
                                <span>Некорректное значение, введите значение в формате чч:мм</span>
                            )}
                        </label>
                        <label>
                            <span className="screens__report screens__report--lable">Укажите время, потраченное на обед в пробки</span>
                            <input className="form__input" type="text" value={skipTime4} onChange={e => setSkipTime4(e.target.value)} />
                            {(skipTime4 !== '' && !validateTime(skipTime4)) && (
                                <span>Некорректное значение, введите значение в формате чч:мм</span>
                            )}
                        </label>
                    </div>
                )}

                <div className="form__group form__group--row">
                    <label>
                        <span className="screens__report screens__report--lable screens__report--right">Введите сумму выручки из Z-отчета</span>
                        <input className="form__input screens__input--summary" type="number" value={income} onChange={e => setIncome(e.target.value)} />
                        {(income < 0) && (
                            <span>Некорректное значение, введите целое число</span>
                        )}
                    </label>
                    <button className="button screens__report screens__report--calc" type="button" onClick={() => setCalc(true)}>
                        <img src="/images/calc.svg" alt="Calculator" />
                    </button>
                </div>  

                <div className="form__group">
                    <div className="screens__report screens__report--lable">Введите данные по заправке ДТ</div>
                    <div>
                        <input className="form__input screens__input--summary" type="text" value={firstRefill} onChange={e => setFirstRefill(e.target.value)} />
                        <span className="screens__report screens__report--lable screens__report--left">Первая заправка</span>
                    </div>
                    <div>
                        <input className="form__input screens__input--summary" type="text" value={secondRefill} onChange={e => setSecondRefill(e.target.value)} />
                        <span className="screens__report screens__report--lable screens__report--left">Дозаправка</span>
                    </div>
                    <div>
                        <input className="form__input screens__input--summary" type="text" value={lastRefill} onChange={e => setLastRefill(e.target.value)} />
                        <span className="screens__report screens__report--lable screens__report--left">Заправка перед возвратом в парк</span>
                    </div>
                </div>

                <div className="form__group">
                    <label>
                        <span className="screens__report screens__report--lable">Введите показания одометра</span>
                        <input className="form__input" type="text" value={odometer} onChange={e => setOdometer(e.target.value)} />
                        {(odometer !== '' && !isPositiveNumber(odometer)) && (
                            <span>Некорректное значение, введите целое число</span>
                        )}
                    </label>
                </div>

                <h2 className="screens__title">Итого за рабочий день</h2>
                <div className="form__group">
                    <div className="screens__report screens__report--large screens__report--lable"><span className="screens__report--blue">{calcOdometer()}</span> км пройдено</div>
                    <div className="screens__report screens__report--large screens__report--lable"><span className="screens__report--blue">{income || 0}</span> р. по кассе</div>
                    <div className="screens__report screens__report--large screens__report--lable"><span className="screens__report--blue">{totalRefill}</span> л ДТ заправлено</div>
                    <div className="screens__report--lable">Заполните эти данные в ваш путевой лист, вы также можете загрузить фото заполненного путевого листа перед сдачей в диспетчерскую</div>
                </div>

                <div className="form__group">
                    <label>
                        <span className="screens__report--lable">Укажите время выхода из АТП</span>
                        <input className="form__input" type="time" value={leaveTime} onChange={(e) => setLeaveTime(e.target.value)}/>
                    </label>
                </div>

                <button className="button form__button button--active" type='submit'>Завершить работу</button>
            </form>

            {calc && (
                <Calculator reportIncome={income} onCalcClose={() => setCalc(false)} />
            )}
        </div>
    );
};

export default fourthScreen;