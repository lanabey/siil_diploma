import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhonesList = () => {
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        const fetchPhones = async () => {
            try {
                const response = await axios.get('api/phones?type=emr');
                setPhones(response.data);
            } catch (error) {
                console.error('Error fetching phones:', error);
            }
        };

        fetchPhones();
    }, []);

    return (
        <div>
            {phones.map(phone => (
                <div className="form__group" key={phone.phone_id}>
                    <div className="form__label">{phone.num_name}</div>
                    <div className="form__input form__input--black">{phone.num}</div>
                </div>
            ))}
        </div>
    );
};

export default PhonesList;