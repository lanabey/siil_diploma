import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

import axios from 'axios';

const thirdScreen = () => {
    const { getRoutePrefix, getLastTwoChars } = useUtilityFunctions();

    const savedState = useSelector((state) => state.data.firstScreen);

    const [selectedRoute, setSelectedRoute] = useState({ timetable: '', timetable_type: null });
    const [bus, setBus] = useState({});
    const [phonesOpen, setPhonesOpen] = useState(false);
    const [phonesActive, setPhonesActive] = useState('');
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        if (savedState) {
            setSelectedRoute(savedState.selectedRoute || {});
            setBus(savedState.busData || {});
        }
    }, []);

    useEffect(() => {
        const fetchPhones = async () => {
            try {
                const response = await axios.get('api/phones/all');
                setPhones(response.data);
            } catch (error) {
                console.error('Error fetching phones:', error);
            }
        };

        fetchPhones();
    }, []);

    const handleFinish = async () => {
        try {
            const response = await axios.get('/api/papi');
        } catch (error) {
            console.error('Failed to fetch routes:', error);
        }
    }

    const showPhones = (type) => {
        setPhonesActive(type);
        setPhonesOpen(true);
    }

    const hidePhones = () => {
        setPhonesOpen(false);
    }

    return (
        <div className="screens__main">
            <div className="screens__title">
                <span>Госномер </span>
                <span className="screens__title--blue">{bus.plate_number ? bus.plate_number : ''}</span>
            </div>
            <div className="screens__title">
                <span>Маршрут </span>
                <span className="screens__title--blue">{getRoutePrefix(selectedRoute.timetable)}</span>
            </div>
            <div className="screens__title">
                <span>Выезд </span>
                <span className="screens__title--blue">{getLastTwoChars(selectedRoute.timetable)}</span>
            </div>

            <button className="button screens__controls screens__controls--margin" disabled={true} onClick={() => handleFinish()}>Сойти с рейса</button>

            {phonesOpen && (
                <div className="modal modal--light">
                    <div className="modal__content modal__phones">
                    {phones
                        .filter(phone => phone.num_type === phonesActive)
                        .map(phone => (
                            <a className="modal__link" key={phone.phone_id} href={'tel:' + phone.num}>{phone.num_name}</a>
                        ))}
                        <button className="modal__close modal__close--phones" onClick={() => hidePhones()}></button>
                    </div>
                </div>
            )}

            <div className="screens__phones">
                <button className="screens__button screens__button--num" onClick={() => showPhones('msk')}>
                    <img src="/images/msk.svg" alt="Оператор Москва" />
                    <span className="screens__phones--text">Оператор Москва</span>
                </button>
                <button className="screens__button screens__button--num" onClick={() => showPhones('patp')}>
                    <img src="/images/atp.svg" alt="АТП телефоны" />
                    <span className="screens__phones--text">АТП</span>
                </button>
                <button className="screens__button screens__button--num" onClick={() => showPhones('emr')}>
                    <img src="/images/emrg.svg" alt="Экстренные телефоны" />
                    <span className="screens__phones--text">Экстренные</span>
                </button>
            </div>
        </div>
    );
};

export default thirdScreen;