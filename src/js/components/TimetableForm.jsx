import React, { useState } from 'react';

const TimetableForm = ({ onSave }) => {
    const [data, setData] = useState({
        schedule: '',
        timetableType: 0,
        departureTime: '',
        morningDeparture: '',
        firstLunch: '',
        secondLunch: '',
        shiftChangeStart: '',
        shiftChangeEnd: '',
        route2: '',
        eveningDeparture: '',
        thirdLunch: '',
        fourthLunch: '',
        endOfShift: '',
        arrivalTime: '',
        tripsCount: '',
        finalStop1: '',
        distanceToFinalStop1: '',
        finalStop2: '',
        distanceToFinalStop2: '',
        startFinalStop: '',
        finishFinalStop: '',
        routeLength: ''
    });
    const [hasChanged, setHasChanged] = useState(false);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
        setHasChanged(true);
    };

    const handleSave = (e) => {
        e.preventDefault();

        let v1 = 0;
        let v2 = 0;
        const dist1 = parseFloat(data.distanceToFinalStop1);
        const dist2 = parseFloat(data.distanceToFinalStop2);

        if (data.startFinalStop === data.finalStop1) {
            v1 = dist1;
        } else if (data.startFinalStop === data.finalStop2) {
            v1 = dist2;
        }

        if (data.finishFinalStop === data.finalStop1) {
            v2 = dist1;
        } else if (data.finishFinalStop === data.finalStop2) {
            v2 = dist2;
        }

        const totalDist = v1 + v2 + parseFloat(data.routeLength) * parseFloat(data.tripsCount);
        const trmnlDist = dist1 <= dist2 ? data.finalStop1 : data.finalStop2;

        const formData = {
            timetable: data.schedule,
            timetable_type: data.timetableType,
            departure_time: data.departureTime,
            mg_start_time: data.morningDeparture,
            first_lunch_time: data.firstLunch,
            second_lunch_time: data.secondLunch,
            shift_start: data.shiftChangeStart,
            shift_end: data.shiftChangeEnd,
            route_2: data.route2,
            ev_start_time: data.eveningDeparture,
            third_lunch_time: data.thirdLunch,
            fourth_lunch_time: data.fourthLunch,
            shifts_finish: data.endOfShift,
            comeback_time: data.arrivalTime,
            bus_routes_num: data.tripsCount,
            name_trmnl_one: data.finalStop1,
            dist_trmnl_one: data.distanceToFinalStop1,
            name_trmnl_two: data.finalStop2,
            dist_trmnl_two: data.distanceToFinalStop2,
            start_trmnl: data.startFinalStop,
            finish_trmnl: data.finishFinalStop,
            route_dist: data.routeLength,
            total_dist: totalDist,
            shift_trmnl: trmnlDist,
        }

        setHasChanged(false);
        onSave(formData);
    };

    return (
        <form className="form" onSubmit={handleSave}>
            <div className="form__group">
                <label className="form__label">График</label>
                <input className="form__input" type="text" name="schedule" value={data.schedule} onChange={handleChange} />
            </div>
            <div className="form__group form__group--row">
                <input
                    className="form__input"
                    type="radio"
                    id="weekday"
                    name="timetableType"
                    value="0"
                    checked={data.timetableType == 0}
                    onChange={handleChange}
                />
                <label htmlFor="weekday">Будни</label>

                <input
                    className="form__input"
                    type="radio"
                    id="weekend"
                    name="timetableType"
                    value="1"
                    checked={data.timetableType == 1}
                    onChange={handleChange}
                />
                <label htmlFor="weekend">Выходные</label>
            </div>
            <div className="form__group">
                <label className="form__label">Время выезда из парка</label>
                <input className="form__input" type="time" name="departureTime" value={data.departureTime} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время отправления в рейс Утро</label>
                <input className="form__input" type="time" name="morningDeparture" value={data.morningDeparture} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время 1-ого обеда</label>
                <input className="form__input" type="time" name="firstLunch" value={data.firstLunch} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время 2-ого обеда</label>
                <input className="form__input" type="time" name="secondLunch" value={data.secondLunch} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время начала пересменки</label>
                <input className="form__input" type="time" name="shiftChangeStart" value={data.shiftChangeStart} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время окончания пересменки</label>
                <input className="form__input" type="time" name="shiftChangeEnd" value={data.shiftChangeEnd} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Маршрут 2</label>
                <input className="form__input" type="text" name="route2" value={data.route2} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время отправления в рейс Вечер</label>
                <input className="form__input" type="time" name="eveningDeparture" value={data.eveningDeparture} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время 3-его обеда</label>
                <input className="form__input" type="time" name="thirdLunch" value={data.thirdLunch} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время 4-ого обеда</label>
                <input className="form__input" type="time" name="fourthLunch" value={data.fourthLunch} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время окончания смены</label>
                <input className="form__input" type="time" name="endOfShift" value={data.endOfShift} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Время прибытия в ПАТП</label>
                <input className="form__input" type="time" name="arrivalTime" value={data.arrivalTime} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Количество рейсов</label>
                <input className="form__input" type="number" name="tripsCount" value={data.tripsCount} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Конечная 1</label>
                <input className="form__input" type="text" name="finalStop1" value={data.finalStop1} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Расстояние до конечной 1</label>
                <input className="form__input" type="number" name="distanceToFinalStop1" value={data.distanceToFinalStop1} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Конечная 2</label>
                <input className="form__input" type="text" name="finalStop2" value={data.finalStop2} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Расстояние до конечной 2</label>
                <input className="form__input" type="number" name="distanceToFinalStop2" value={data.distanceToFinalStop2} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Стартовая конечная</label>
                <input className="form__input" type="text" name="startFinalStop" value={data.startFinalStop} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Финишная конечная</label>
                <input className="form__input" type="text" name="finishFinalStop" value={data.finishFinalStop} onChange={handleChange} />
            </div>
            <div className="form__group">
                <label className="form__label">Длина рейса</label>
                <input className="form__input" type="number" name="routeLength" value={data.routeLength} onChange={handleChange} />
            </div>
            <button className={`form__button button ${hasChanged ? 'button--active' : 'button--blocked'}`} type="submit" disabled={!hasChanged}>Сохранить</button>
        </form>
    );
};

export default TimetableForm;
