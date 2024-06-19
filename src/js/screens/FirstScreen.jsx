import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFirst } from '../redux/actions/actions';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import axios from 'axios';
import { debounce } from "lodash";

import Alarm from '../components/Alarm';

registerLocale('ru', ru);
setDefaultLocale('ru');

const firstScreen = ({ inputBlocked }) => {
    const { formatDate, formatTime, getRoutePrefix, getLastTwoChars } = useUtilityFunctions();

    const shifts = [
        {
            id: 'first',
            name: 'Первая',
        },
        {
            id: 'second',
            name: 'Вторая',
        },
        {
            id: 'double',
            name: 'Две смены',
        },
    ];

    const [scheduleData, setScheduleData] = useState({
        fromPark: '',
        start: '',
        startTrmnl: 'начальная остановка',
        finish: '',
        finishTrmnl: 'конечная остановка',
        toPark: '',
        toRecord: '',
    });

    const [date, setDate] = useState(new Date());
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState({ timetable: '', timetable_type: null });
    const [buses, setBuses] = useState([]);
    const [bus, setBus] = useState(-1);
    const [shift, setShift] = useState('');
    const [reservation, setReservation] = useState(0);
    const [alarmsVisible, setAlarmsVisible] = useState(false);

    const savedState = useSelector((state) => state.data.firstScreen);
    const dispatch = useDispatch();

    useEffect(() => {
        if (savedState) {
            let dateObj = new Date(savedState.date);

            if (!(dateObj instanceof Date && !isNaN(dateObj.valueOf()))) {
                dateObj = new Date();
            }

            setDate(dateObj);
            setSelectedRoute(savedState.selectedRoute || { timetable: '', timetable_type: null });
            setBus(savedState.bus || -1);
            setShift(savedState.shift || '');
            setReservation(savedState.reservation || 0);
        }
    }, []);

    useEffect(() => {
        debouncedUpdate();

        return () => debouncedUpdate.cancel();
    }, [dispatch, date, selectedRoute, bus, shift, reservation, scheduleData]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get('/api/schedules');
                setRoutes(response.data);
            } catch (error) {
                console.error('Failed to fetch routes:', error);
            }
        };

        fetchRoutes();
    }, []);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get('/api/buses');
                setBuses(response.data);
            } catch (error) {
                console.error('Failed to fetch buses:', error);
            }
        };

        fetchBuses();
    }, []);

    useEffect(() => {
        const fetchShiftSchedule = () => {
            axios.post('api/shiftdata', { shift, timetable: selectedRoute.timetable, timetable_type: selectedRoute.timetable_type })
                .then(response => {
                    setScheduleData({
                        fromPark: formatTime(response.data.fromPark) || '',
                        start: formatTime(response.data.start) || '',
                        startTrmnl: response.data.startTrmnl || 'начальная остановка',
                        finish: formatTime(response.data.finish) || '',
                        finishTrmnl: response.data.finishTrmnl || 'конечная остановка',
                        toPark: formatTime(response.data.toPark) || '',
                        toRecord: formatTime(response.data.onroute) || ''
                    });
                })
                .catch(error => {
                    console.error('Failed to load schedule:', error);
                });
        };

        if (selectedRoute.timetable && shift) {
            fetchShiftSchedule();
        }
    }, [shift, selectedRoute]);

    const dispatchChanges = () => {
        const localState = {
            date: date ? date.toISOString() : null,
            selectedRoute,
            bus,
            shift,
            reservation,
            busData: buses[bus],
            toRecord: scheduleData.toRecord ? scheduleData.toRecord : '',
            fromPark: scheduleData.fromPark ? scheduleData.fromPark : '',
            toPark: scheduleData.toPark ? scheduleData.toPark : ''
        };

        dispatch(updateFirst(localState));
    }

    const debouncedUpdate = debounce(dispatchChanges, 300);

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const handleRouteSelect = e => {
        const chosenRoute = routes.find(route => route.timetable === e.target.value);
        setSelectedRoute({
            timetable: chosenRoute.timetable,
            timetable_type: chosenRoute.timetable_type
        });
    }

    return (
        <div>
            <span className="screens__date">Сегодня: {formatDate(new Date())}</span>
            <button className="button screens__controls" onClick={() => setReservation(1)} disabled={inputBlocked}>Резерв</button>
            <h1 className="screens__title">Следующая смена</h1>
            <div className="screens__container">
                <div className="screens__container screens__container--menu">
                    <span className="screens__heading">Дата</span>
                    <DatePicker
                        className="screens__input"
                        selected={date}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        placeholderText="Выберите дату"
                        dateFormat="d MMMM, EEEE"
                        locale="ru"
                        disabled={inputBlocked}
                    />
                </div>
                <div className="screens__container screens__container--menu">
                    <div className="screens__heading screens__heading--route">
                        <div>
                            <span>Маршрут</span>
                            <span> {getRoutePrefix(selectedRoute.timetable)}</span>
                        </div>
                        <div>
                            <span>Выезд</span>
                            <span> {getLastTwoChars(selectedRoute.timetable)}</span>
                        </div>
                    </div>
                    <select className="screens__input" value={selectedRoute.timetable} onChange={e => handleRouteSelect(e)} disabled={inputBlocked}>
                        <option value="" disabled>Выбрать маршрут</option>
                        {routes.map(route => (
                            <option key={route.timetable} value={route.timetable}>{route.timetable} {route.timetable_type === 1 ? ' (Выходной)' : ''}</option>
                        ))}
                    </select>
                </div>
                <div className="screens__container screens__container--menu">
                    <span className="screens__heading">Смена</span>
                    <select className="screens__input" value={shift} onChange={e => setShift(e.target.value)} disabled={inputBlocked}>
                        <option value="" disabled selected>Выбрать смену</option>
                        {shifts.map(shift => (
                            <option key={shift.id} value={shift.id}>{shift.name}</option>
                        ))}
                    </select>
                </div>
                <div className="screens__container screens__container--menu">
                    <span className="screens__heading">Борт</span>
                    <select className="screens__input" value={bus == -1 ? '' : bus} onChange={e => setBus(e.target.value)} disabled={inputBlocked}>
                        <option value="" disabled selected>Выбрать автобус</option>
                        {buses.map((bus, index) => (
                            <option key={index} value={index}>{bus.bus_number}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="screens__businfo">
                <img src="/images/bus_pattern.webp" alt="Bus" />
                <div className="screens__businfo--info">
                    <span className="list__line list__line--bus">{buses[bus] ? buses[bus].bus_brand : ''}</span>
                    <span className="list__line list__line--bus">{buses[bus] ? buses[bus].plate_number : ''}</span>
                    <div className="screens__businfo--time">
                        <span className="screens__textline list__time--blue">{scheduleData.fromPark ? scheduleData.fromPark : '--:--'}</span>
                        <span className="screens__textline"> из парка</span>
                    </div>
                </div>
            </div>
            <div>
                <div className=" screens__businfo screens__businfo--data">
                    <img className="screens__textline--image" src="/images/trmnl_start.svg" alt="Start mark" />
                    <span className="screens__textline screens__textline--withicon list__time--green">{scheduleData.start ? scheduleData.start : '--:--'}</span><span className="screens__textline">старт</span>
                    <span className="screens__businfo--stop">{scheduleData.startTrmnl}</span>
                </div>
                <div className="screens__businfo screens__businfo--data">
                    <img className="screens__textline--image" src="/images/trmnl_finish.svg" alt="Finish mark" />
                    <span className="screens__textline screens__textline--withicon list__time--red">{scheduleData.finish ? scheduleData.finish : '--:--'}</span><span className="screens__textline">финиш</span>
                    <span className="screens__businfo--stop">{scheduleData.finishTrmnl}</span>
                </div>
            </div>
            <div className="screens__shiftsinfo">
                <div className="screens__alarm">
                    <button className="button screens__button" onClick={() => setAlarmsVisible(true)}>
                        <img src="/images/alarms_icon.svg" alt="Alarms icon" />
                    </button>
                        {alarmsVisible && (
                            <div className="modal modal--alarm">
                                <div className="modal__content modal__content--alarm">
                                    <Alarm fromPark={scheduleData.fromPark} start={scheduleData.start} handleClose={() => setAlarmsVisible(false)} />
                                </div>
                            </div>
                        )}
                </div>
                <div className="screens__shiftsinfo screens__shiftsinfo--content">
                    <div>
                        <span className="screens__textline list__time--blue screens__shiftsinfo--time">{scheduleData.toPark ? scheduleData.toPark : '--:--'}</span><span className="screens__textline"s> в парк</span>
                    </div>
                    <div className="screens__shiftsinfo--onroute">
                        <span className="screens__shiftsinfo--time">{scheduleData.toRecord ? scheduleData.toRecord : '--:--'}</span><span> в табель</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default firstScreen;