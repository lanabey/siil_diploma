import React, { useState } from 'react';

const BusForm = ({ onSave }) => {
    const [data, setData] = useState({
        busNumber: '',
        plateNumber: '',
        brand: '',
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

        const formData = {
            bus_number: data.busNumber,
            plate_number: data.plateNumber,
            bus_brand: data.brand,
        }

        setHasChanged(false);
        onSave(formData);
    };

    return (
        <form className="form" onSubmit={handleSave}>
            <div className="form__group">
                <label className="form__label">Борт</label>
                <input className="form__input" type="number" name="busNumber" value={data.busNumber} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Госномер</label>
                <input className="form__input" type="text" name="plateNumber" value={data.plateNumber} onChange={handleChange} required />
            </div>
            <div className="form__group">
                <label className="form__label">Марка</label>
                <input className="form__input" type="text" name="brand" value={data.brand} onChange={handleChange} required />
            </div>
            <button className={`form__button button ${hasChanged ? 'button--active' : 'button--blocked'}`} type="submit" disabled={!hasChanged}>Сохранить</button>
        </form>
    );
};

export default BusForm;