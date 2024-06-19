import React, { useState } from 'react';
import axios from 'axios';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

const RouteAnalytics = () => {
    const { formatTime } = useUtilityFunctions();

    const [formData, setFormData] = useState({
        sortType: 'distance',
        sortOrder: 'asc',
        startTime: 'morning'
    });

    const [timetables, setTimetables] = useState([]);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/schedules/filter', formData);
            if (response.data) {
                setTimetables(response.data);
                setIsFormSubmitted(true);
            }
        } catch (error) {
            console.error('Error fetching route analytics:', error);
        }
    };

    if (isFormSubmitted) {
        return (
            <div className="list">
                {timetables.map((timetable, index) => (
                    <div className="list__item" key={index}>
                        <div className="list__card">
                            <div className="list__column">
                                <h2 className="list__line">График</h2>
                                <p className="list__line">{timetable.timetable}</p>
                                <p className="list__line">{timetable.timetable_type == 1 ? 'Выходной' : ''}</p>
                            </div>

                            <div className="list__column">
                                <p className="list__line">
                                    <span className="list__time list__time--green">{timetable.mg_start_time ? formatTime(timetable.mg_start_time) : formatTime(timetable.ev_start_time)} </span>
                                    старт
                                </p>
                                <p className="list__line">{timetable.start_trmnl}</p>
                                <p className="list__line">
                                    <span className="list__time list__time--red">{formatTime(timetable.shifts_finish)} </span>
                                    финиш
                                </p>
                                <p className="list__line">{timetable.finish_trmnl}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form__group">
                <div className="form__label form__label--margin">Тип сортировки</div>

                <input
                    className="form__input"
                    type="radio"
                    id="sortByDistance"
                    name="sortType"
                    value="distance"
                    checked={formData.sortType === 'distance'}
                    onChange={handleChange}
                />
                <label htmlFor="sortByDistance">По расстоянию</label>

                <input
                    className="form__input"
                    type="radio"
                    id="sortByTime"
                    name="sortType"
                    value="time"
                    checked={formData.sortType === 'time'}
                    onChange={handleChange}
                />
                <label htmlFor="sortByTime">По времени на линии</label>

                <input
                    className="form__input"
                    type="radio"
                    id="sortByReturnTime"
                    name="sortType"
                    value="returnTime"
                    checked={formData.sortType === 'returnTime'}
                    onChange={handleChange}
                />
                <label htmlFor="sortByReturnTime">По времени возврата в парк</label>
            </div>
            <div className="form__group">
                <div className="form__label form__label--margin">Направление сортировки</div>

                <input
                    className="form__input"
                    type="radio"
                    id="sortAsc"
                    name="sortOrder"
                    value="asc"
                    checked={formData.sortOrder === 'asc'}
                    onChange={handleChange}
                />
                <label htmlFor="sortAsc">По возрастанию</label>

                <input
                    className="form__input"
                    type="radio"
                    id="sortDesc"
                    name="sortOrder"
                    value="desc"
                    checked={formData.sortOrder === 'desc'}
                    onChange={handleChange}
                />
                <label htmlFor="sortDesc">По убыванию</label>
            </div>
            <div className="form__group">
                <div className="form__label form__label--margin">Время старта</div>

                <input
                    className="form__input"
                    type="radio"
                    id="startMorning"
                    name="startTime"
                    value="morning"
                    checked={formData.startTime === 'morning'}
                    onChange={handleChange}
                />
                <label htmlFor="startMorning">Утром</label>

                <input
                    className="form__input"
                    type="radio"
                    id="startEvening"
                    name="startTime"
                    value="evening"
                    checked={formData.startTime === 'evening'}
                    onChange={handleChange}
                />
                <label htmlFor="startEvening">Вечером</label>
            </div>
            <button className="form__button button button--active" type="submit">Отправить</button>
        </form>
    );
};

export default RouteAnalytics;
