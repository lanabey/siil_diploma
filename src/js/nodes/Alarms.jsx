import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AlarmForm from '../components/EditorField';

const AlarmSettings = () => {
    const [getup, setGetup] = useState('');
    const [leave, setLeave] = useState('');

    useEffect(() => {
        const fetchAlarmData = async () => {
            try {
                const response = await axios.get('/api/alarms/get');
                const data = response.data;

                if (data) {
                    setGetup(data.getup || '');
                    setLeave(data.leave || '');
                } else {
                    setGetup('--:--');
                    setLeave('--:--');
                }
            } catch (error) {
                console.error('Error fetching alarm data:', error);
            }
        };

        fetchAlarmData();
    }, []);

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Будильники</h1>
            </div>

            <AlarmForm
                initialValue={getup}
                label="За сколько до выхода из дома вас разбудить?"
                fieldName="getupTime"
                updateUrl="/api/alarms/getup"
                fieldType="time"
            />
            <AlarmForm
                initialValue={leave}
                label="Сколько вам ехать до автопарка?"
                fieldName="leaveTime"
                updateUrl="/api/alarms/leave"
                fieldType="time"
            />
            <div className="info">
                Укажите время в формате 00 часов 00 минут, например 00:30 - это 30 минут.
                Программа рассчитает время будильников согласно расписанию вашей предстоящей смены.
            </div>
        </div>
    );
};

export default AlarmSettings;
