import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AlarmsList({ fromPark, start, handleClose }) {
    const [getup, setGetup] = useState('');
    const [leave, setLeave] = useState('');
    const [note, setNote] = useState('');
    const [begin, setBegin] = useState('');
    const [departure, setDeparture] = useState('');

    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const response = await axios.get('/api/alarms/get');
    
                if (response.data) {
                    setGetup(calculateTimeDifference(fromPark, response.data.getup || '00:00'));
                    setLeave(calculateTimeDifference(fromPark, response.data.leave || '00:00'));
                } else {
                    setGetup('--:--');
                    setLeave('--:--');
                }
            } catch (error) {
                console.error('Error fetching alarms:', error);
            }
        };
    
        if (fromPark && start) {
            fetchAlarms();
            setNote(calculateTimeDifference(fromPark, '00:20'));
            setDeparture(start);
            setBegin(calculateTimeDifference(start, '00:01'));
        } else {
            setGetup('--:--');
            setLeave('--:--');
            setNote('--:--');
            setBegin('--:--');
        }
        
    }, [fromPark, start]);

    const calculateTimeDifference = (baseTime, minusTime) => {
        if (!baseTime || !minusTime) return '--:--';
    
        let [baseHours, baseMinutes] = baseTime.split(':').map(Number);
        let [minusHours, minusMinutes] = minusTime.split(':').map(Number);
    
        let resultHours = baseHours - minusHours;
        let resultMinutes = baseMinutes - minusMinutes;
    
        if (resultMinutes < 0) {
            resultMinutes += 60;
            resultHours -= 1;
        }
        if (resultHours < 0) {
            resultHours += 24;
        }
    
        return `${resultHours.toString().padStart(2, '0')}:${resultMinutes.toString().padStart(2, '0')}`;
    };
    

    return (
        <div className="modal__alarm">
            <h2>Будильники</h2>
            <button className="modal__close modal__close--alarm" onClick={() => handleClose()}></button>
            <ul>
                <li>{getup} подъем</li>
                <li>{leave} выход</li>
                <li>{note} путевка</li>
                <li>{begin} подача</li>
                <li>{departure ? departure : '--:--'} выезд</li>
            </ul>
        </div>
    );
}

export default AlarmsList;
