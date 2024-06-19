import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EditorField from './EditorField';

const TimetableEditor = ({ selectedTimetable }) => {
    const apiUrl = '/api/schedules/update';

    const [formData, setFormData] = useState({
        schedule: '',
        timetableType: '',
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

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get(`/api/schedule?timetable=${selectedTimetable.timetable}&timetable_type=${selectedTimetable.timetable_type}`);
                setFormData({
                    schedule: response.data.timetable || '',
                    timetableType: response.data.timetable_type || '',
                    departureTime: response.data.departure_time || '',
                    morningDeparture: response.data.mg_start_time || '',
                    firstLunch: response.data.first_lunch_time || '',
                    secondLunch: response.data.second_lunch_time || '',
                    shiftChangeStart: response.data.shift_start || '',
                    shiftChangeEnd: response.data.shift_end || '',
                    route2: response.data.route_2 || '',
                    eveningDeparture: response.data.ev_start_time || '',
                    thirdLunch: response.data.third_lunch_time || '',
                    fourthLunch: response.data.fourth_lunch_time || '',
                    endOfShift: response.data.shifts_finish || '',
                    arrivalTime: response.data.comeback_time || '',
                    tripsCount: response.data.bus_routes_num || '',
                    finalStop1: response.data.name_trmnl_one || '',
                    distanceToFinalStop1: response.data.dist_trmnl_one || '',
                    finalStop2: response.data.name_trmnl_two || '',
                    distanceToFinalStop2: response.data.dist_trmnl_two || '',
                    startFinalStop: response.data.start_trmnl || '',
                    finishFinalStop: response.data.finish_trmnl || '',
                    routeLength: response.data.route_dist || ''
                });
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchSchedules();
    }, [selectedTimetable]);

    const handleUpdate = (updatedField, updatedValue) => {
        setFormData((prevData) => ({
            ...prevData,
            [updatedField]: updatedValue,
        }));
    };    

    return (
        <div className="form">
            <EditorField
                initialValue={formData.schedule}
                label="График"
                fieldName="schedule"
                updateUrl={apiUrl}
                updateType="schedule"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
                onUpdate={handleUpdate}
            />
            <EditorField
                initialValue={formData.timetableType}
                radioValues={[
                    {
                        id: "weekday",
                        key: 0,
                        val: "Будни"
                    },
                    {
                        id: "weekend",
                        key: 1,
                        val: "Выходные"
                    }
                ]}
                fieldName="timetableType"
                updateUrl={apiUrl}
                updateType="timetableType"
                fieldType="radio"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
                onUpdate={handleUpdate}
            />
            <EditorField
                initialValue={formData.departureTime}
                label="Время выезда из парка"
                fieldName="departureTime"
                updateUrl={apiUrl}
                updateType="departureTime"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.morningDeparture}
                label="Время отправления в рейс Утро"
                fieldName="morningDeparture"
                updateUrl={apiUrl}
                updateType="morningDeparture"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.firstLunch}
                label="Время 1-ого обеда"
                fieldName="firstLunch"
                updateUrl={apiUrl}
                updateType="firstLunch"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.secondLunch}
                label="Время 2-ого обеда"
                fieldName="secondLunch"
                updateUrl={apiUrl}
                updateType="secondLunch"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.shiftChangeStart}
                label="Время начала пересменки"
                fieldName="shiftChangeStart"
                updateUrl={apiUrl}
                updateType="shiftChangeStart"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.shiftChangeEnd}
                label="Время окончания пересменки"
                fieldName="shiftChangeEnd"
                updateUrl={apiUrl}
                updateType="shiftChangeEnd"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.route2}
                label="Маршрут 2"
                fieldName="route2"
                updateUrl={apiUrl}
                updateType="route2"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.eveningDeparture}
                label="Время отправления в рейс Вечер"
                fieldName="eveningDeparture"
                updateUrl={apiUrl}
                updateType="eveningDeparture"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.thirdLunch}
                label="Время 3-его обеда"
                fieldName="thirdLunch"
                updateUrl={apiUrl}
                updateType="thirdLunch"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.fourthLunch}
                label="Время 4-ого обеда"
                fieldName="fourthLunch"
                updateUrl={apiUrl}
                updateType="fourthLunch"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.endOfShift}
                label="Время окончания смены"
                fieldName="endOfShift"
                updateUrl={apiUrl}
                updateType="endOfShift"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.arrivalTime}
                label="Время прибытия в ПАТП"
                fieldName="arrivalTime"
                updateUrl={apiUrl}
                updateType="arrivalTime"
                fieldType="time"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.tripsCount}
                label="Количество рейсов"
                fieldName="tripsCount"
                updateUrl={apiUrl}
                updateType="tripsCount"
                fieldType="number"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.finalStop1}
                label="Конечная 1"
                fieldName="finalStop1"
                updateUrl={apiUrl}
                updateType="finalStop1"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.distanceToFinalStop1}
                label="Расстояние до конечной 1"
                fieldName="distanceToFinalStop1"
                updateUrl={apiUrl}
                updateType="distanceToFinalStop1"
                fieldType="number"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.finalStop2}
                label="Конечная 2"
                fieldName="finalStop2"
                updateUrl={apiUrl}
                updateType="finalStop2"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.distanceToFinalStop2}
                label="Расстояние до конечной 2"
                fieldName="distanceToFinalStop2"
                updateUrl={apiUrl}
                updateType="distanceToFinalStop2"
                fieldType="number"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.startFinalStop}
                label="Стартовая конечная"
                fieldName="startFinalStop"
                updateUrl={apiUrl}
                updateType="startFinalStop"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.finishFinalStop}
                label="Финишная конечная"
                fieldName="finishFinalStop"
                updateUrl={apiUrl}
                updateType="finishFinalStop"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
            <EditorField
                initialValue={formData.routeLength}
                label="Длина рейса"
                fieldName="routeLength"
                updateUrl={apiUrl}
                updateType="routeLength"
                fieldType="number"
                addData={{ scheduleKey: formData.schedule, timetableTypeKey: formData.timetableType }}
            />
        </div>
    );
};

export default TimetableEditor;
