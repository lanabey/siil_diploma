import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSecond, updateFirstBus } from '../redux/actions/actions';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';
import axios from 'axios';
import { debounce } from "lodash";

const secondScreen = ({ inputBlocked, setInputBlocked }) => {
    const { isPositiveNumber } = useUtilityFunctions();

    const savedState = useSelector((state) => state.data.secondScreen);
    const dispatch = useDispatch();

    const [time, setTime] = useState(null);
    const [goButton, setGoButton] = useState(false);
    const [showDialogue, setShowDialogue] = useState(false);
    const [buses, setBuses] = useState([]);
    const [bus, setBus] = useState(-1);
    const [malfunction, setMalfunction] = useState('');
    const [odometer, setOdometer] = useState('');

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get('/api/buses');
                setBuses(response.data);
            } catch (error) {
                console.error('Failed to fetch buses:', error);
            }
        };

        if (showDialogue) {
            fetchBuses();
        }
    }, [showDialogue]);

    useEffect(() => {
        if (savedState) {
            setTime(savedState.time || null);
            setOdometer(savedState.odometer || '');

            if (savedState.bus && savedState.malfunction) {
                setBus(savedState.bus || -1);
                setMalfunction(savedState.malfunction || '');
            }
        }
    }, []);

    useEffect(() => {
        debouncedUpdate();

        return () => debouncedUpdate.cancel();
    }, [dispatch, time, bus, odometer, malfunction]);

    const dispatchChanges = () => {
        const localState = { time, odometer };

        if (bus != -1) {
            localState.bus = bus;
        }

        if (malfunction) {
            localState.malfunction = malfunction;
        }

        dispatch(updateSecond(localState));
    }

    const debouncedUpdate = debounce(dispatchChanges, 300);

    const handleClickMalfunction = (hasMalfunction) => {
        if (hasMalfunction) {
            setShowDialogue(true);
        }
        setGoButton(true);
    }

    const handleStart = () => {
        if (bus != -1) {
            const localState = { bus, busData: buses[bus] };
            console.log('here ', localState);

            dispatch(updateFirstBus(localState));
        }
        
        setInputBlocked(true);
    }

    return (
        <div className="screens__main">
            <div className="form__group">
                <div className="screens__textline screens__textline--margin">Укажите время входа в АТП:</div>
                <input className="form__input" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={inputBlocked}/>
            </div>
            <div className="form__group">
                <div className="screens__textline screens__textline--margin">Подготовка автобуса</div>
                <div className="screens__textline screens__textline--margin">Автобус исправен?</div>
                <div>
                    <button className="button screens__controls screens__controls--green" onClick={() => handleClickMalfunction(false)} disabled={inputBlocked}>Да</button>
                    <button className="button screens__controls screens__controls--red" onClick={() => handleClickMalfunction(true)} disabled={inputBlocked}>Нет</button>
                </div>
            </div>

            {showDialogue && (
                <div className="form__group">
                    <label>
                        <span className="screens__textline screens__textline--margin">Опишите неисправность</span>
                        <textarea className="form__input" cols="30" rows="5" value={malfunction} onChange={(e) => setMalfunction(e.target.value)} disabled={inputBlocked}></textarea>
                    </label>
                    <label>
                        <span className="screens__textline screens__textline--margin">Выберите автобус</span>
                        <select className="form__input" value={bus == -1 ? '' : bus} onChange={e => setBus(e.target.value)} disabled={inputBlocked}>
                            <option value="" disabled selected>Автобус</option>
                            {buses.map((bus, index) => (
                                <option key={index} value={index}>{bus.bus_number}</option>
                            ))}
                        </select>
                    </label>
                    <div className="screens__textline--margin">
                        <span className="screens__textline">Борт </span>
                        <span>{buses[bus] ? buses[bus].bus_number : ''}</span>
                    </div>
                </div>
            )}

            <div className="form__group">
                <label>
                    <span className="screens__textline screens__textline--margin">Введите показания одометра</span>
                    <input className="form__input" type="text" value={odometer} onChange={e => setOdometer(e.target.value)} disabled={inputBlocked} />
                    {(odometer !== '' && !isPositiveNumber(odometer)) && (
                        <span>Некорректное значение, введите целое число</span>
                    )}
                </label>
            </div>

            {(goButton && odometer) && (
                <button className="button form__button button--active" onClick={() => handleStart()}>Поехали!</button>
            )}
        </div>
    );
};

export default secondScreen;