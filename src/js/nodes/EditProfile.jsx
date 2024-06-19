import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

import EditorField from '../components/EditorField';

const EditProfile = () => {
    const { isPositiveNumber } = useUtilityFunctions();

    const [formData, setFormData] = useState({
        tin: '',
        empId: '',
        ticketPrice: '',
        fullName: ''
    });

    useEffect(() => {
        axios.get('/api/user/profile')
            .then(response => {
                const data = response.data;

                setFormData(prevState => ({
                    ...prevState,
                    tin: data.TIN_org || '',
                    empId: data.emp_id || '',
                    ticketPrice: data.ticket_price || '',
                    fullName: data.driver_name || '',
                }));
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Редактировать профиль</h1>
            </div>

            <div className="form__group">
                <label className="form__label">ИНН организации</label>
                <input
                    className="form__input"
                    type="text"
                    name="tin"
                    value={formData.tin}
                    // onChange={handleChange}
                    disabled={true}
                />
                {/* {(formData.tin !== '' && !isPositiveNumber(formData.tin)) && (
                    <span className="form__error">Некорректное значение, введите целое число</span>
                )} */}
            </div>
            <EditorField
                initialValue={formData.empId}
                label="Табельный номер"
                fieldName="empId"
                updateUrl="/api/user/update"
                updateType="empId"
            />
            <EditorField
                initialValue={''}
                label="Изменить ПИН"
                fieldName="pin"
                updateUrl="/api/user/update"
                updateType="pin"
            />
            <EditorField
                initialValue={formData.ticketPrice}
                label="Цена билета"
                fieldName="ticketPrice"
                updateUrl="/api/user/update"
                updateType="price"
            />
            <EditorField
                initialValue={formData.fullName}
                label="ФИО"
                fieldName="fullName"
                updateUrl="/api/user/update"
                updateType="name"
            />
        </div>
    );
};

export default EditProfile;
