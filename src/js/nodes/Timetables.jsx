import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

import TimetableForm from '../components/TimetableForm';
import TimetableEditor from '../components/TimetableEditor';

const Timetables = () => {
    const { formatTime } = useUtilityFunctions();

    const [timetables, setTimetables] = useState([]);
    const [selectedTimetable, setSelectedTimetable] = useState(null);
    const [formActive, setFormActive] = useState(false);
    const [editorActive, setEditorActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [timetableToDelete, setTimetableToDelete] = useState(null);

    useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = async () => {
        try {
            const response = await axios.get('/api/schedules/all');
            setTimetables(response.data);
        } catch (error) {
            console.error('Error fetching timetables:', error);
        }
    };

    const handleEdit = (timetable) => {
        setSelectedTimetable(timetable);
        setEditorActive(true);
    };

    const handleCreate = () => {
        setFormActive(true);
    };

    const confirmDelete = (timetable) => {
        setTimetableToDelete(timetable);
        setModalVisible(true);
    };

    const closeEditors = () => {
        setFormActive(false);
        setEditorActive(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/schedules/delete`, { data: { timetable: timetableToDelete.timetable, timetableType: timetableToDelete.timetable_type } });
            
            setModalVisible(false);
            fetchTimetables();
        } catch (error) {
            console.error('Error deleting timetable:', error);
        }
    };

    const handleSave = async (formData) => {
        try {
            await axios.put(`/api/schedules/create`, formData);

            setSelectedTimetable(null);
            setFormActive(false);
            fetchTimetables();
        } catch (error) {
            console.error('Error saving timetable:', error);
        }
    };

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Расписания</h1>
                {(formActive || editorActive) && (
                    <button className="button button--active" type="button" onClick={closeEditors}>Назад</button>
                )}
            </div>

            {!(formActive || editorActive) && (
                <div className="list">
                    <button className="list__add  list__add--narrow" onClick={handleCreate}>Создать расписание</button>

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
                            <div className="list__buttons">
                                <button type="button" className="form__editor--button" onClick={() => handleEdit(timetable)}>
                                    <img src="/images/edit.svg" alt="Edit" />
                                </button>
                                <button type="button" className="form__editor--button" onClick={() => confirmDelete(timetable)}>
                                    <img src="/images/delete.svg" alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {formActive && (
                <TimetableForm onSave={handleSave} />
            )}

            {editorActive && (
                <TimetableEditor selectedTimetable={selectedTimetable} />
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal__content">
                        <h2>Вы уверены, что хотите удалить это расписание?</h2>
                        <button className="modal__button button button--active" onClick={handleDelete}>Да</button>
                        <button className="modal__button button" onClick={() => setModalVisible(false)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timetables;