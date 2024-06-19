import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditorField from './EditorField';

const PhonesEditor = ({ phoneType }) => {
    const apiUrl = '/api/phones/update';
    const createUrl = '/api/phones/create';

    const [phones, setPhones] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);
    const [data, setData] = useState({
        numName: '',
        num: ''
    });

    useEffect(() => {
        fetchPhones();
    }, []);

    const fetchPhones = async () => {
        try {
            const response = await axios.get(`/api/phones?type=${phoneType}`);
            setPhones(response.data);
        } catch (error) {
            console.error('Error fetching phones:', error);
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
        setHasChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                num_type: phoneType,
                num: data.num,
                num_name: data.numName,
            };

            await axios.put(createUrl, formData);

            setData({ numName: '', num: '' });
            setHasChanged(false);
            fetchPhones();
        } catch (error) {
            console.error('Error creating new phone:', error);
        }
    };

    return (
        <div>
            <div className="form">
                {phones.map((phone) => (
                    <EditorField
                        key={phone.num}
                        initialValue={phone.num}
                        label={phone.num_name}
                        fieldName="num"
                        updateUrl={apiUrl}
                        updateType="phone"
                        addData={{ phoneId: phone.phone_id }}
                    />
                ))}
            </div>

            <h2>Добавить новый</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__group">
                    <label className="form__label">
                        Имя:
                    </label>
                    <input
                        className="form__input"
                        type="text"
                        name="numName"
                        value={data.numName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form__group">
                    <label className="form__label">
                        Номер:
                    </label>
                    <input
                        className="form__input"
                        type="text"
                        name="num"
                        value={data.num}
                        onChange={handleChange}
                    />
                </div>
                <button className={`form__button button ${hasChanged ? 'button--active' : 'button--blocked'}`} type="submit" disabled={!hasChanged}>Сохранить</button>
            </form>
        </div>
    );
};

export default PhonesEditor;
