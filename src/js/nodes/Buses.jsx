import React, { useState, useEffect } from 'react';
import axios from 'axios';

import BusForm from '../components/BusForm';
import BusEditor from '../components/BusEditor';

const Buses = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [formActive, setFormActive] = useState(false);
    const [editorActive, setEditorActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [busToDelete, setBusToDelete] = useState(null);

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await axios.get('/api/buses');
            setBuses(response.data);
        } catch (error) {
            console.error('Error fetching buses:', error);
        }
    };

    const handleEdit = (bus) => {
        setSelectedBus(bus);
        setEditorActive(true);
    };

    const handleCreate = () => {
        setFormActive(true);
    };

    const confirmDelete = (bus) => {
        setBusToDelete(bus);
        setModalVisible(true);
    };

    const closeEditors = () => {
        setFormActive(false);
        setEditorActive(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/buses/delete`, { data: { plateNumber: busToDelete.plate_number } });

            setModalVisible(false);
            fetchBuses();
        } catch (error) {
            console.error('Error deleting a bus:', error);
        }
    };

    const handleSave = async (formData) => {
        try {
            await axios.put(`/api/buses/create`, formData);

            setSelectedBus(null);
            setFormActive(false);
            fetchBuses();
        } catch (error) {
            console.error('Error saving a bus:', error);
        }
    };

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Список автобусов</h1>
                {(formActive || editorActive) && (
                    <button className="button button--active" type="button" onClick={closeEditors}>Назад</button>
                )}
            </div>

            {!(formActive || editorActive) && (
                <div className="list">
                    <button className="list__add list__add--narrow" onClick={handleCreate}>Добавить автобус</button>

                    {buses.map((bus, index) => (
                        <div className="list__item" key={index}>
                            <div className="list__card">
                                <div className="list__column">
                                    <h2 className="list__line">Борт</h2>
                                    <p className="list__line">{bus.bus_number}</p>
                                </div>
                                <div className="list__column">
                                    <img src="/images/bus_pattern.webp" alt="Bus" />
                                </div>
                                <div className="list__column">
                                    <p className="list__line">{bus.plate_number}</p>
                                    <p className="list__line">{bus.bus_brand}</p>
                                </div>
                            </div>
                            <div className="list__buttons">
                                <button type="button" className="form__editor--button" onClick={() => handleEdit(bus)}>
                                    <img src="/images/edit.svg" alt="Edit" />
                                </button>
                                <button type="button" className="form__editor--button" onClick={() => confirmDelete(bus)}>
                                    <img src="/images/delete.svg" alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {formActive && (
                <BusForm onSave={handleSave} />
            )}

            {editorActive && (
                <BusEditor selectedBus={selectedBus} />
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal__content">
                        <h2>Вы уверены, что хотите удалить этот автобус?</h2>
                        <button className="modal__button button button--active" onClick={handleDelete}>Да</button>
                        <button className="modal__button button" onClick={() => setModalVisible(false)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buses;