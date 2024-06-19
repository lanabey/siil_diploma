import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUtilityFunctions } from '../utils/UtilityFunctionsContext';

const EditorField = ({ initialValue, label, fieldName, updateUrl, updateType, fieldType = 'text', addData={}, radioValues=[], isDisabled = false, onUpdate = null }) => {
    const { validateTime, formatTime } = useUtilityFunctions();

    const [value, setValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fieldRef = useRef(null);
    const originalValue = useRef('');
    const isEditingRef = useRef(isEditing);

    useEffect(() => {
        if (fieldType === 'time') {
            setValue(formatTime(initialValue));
            originalValue.current = formatTime(initialValue);
        } else {
            setValue(initialValue);
            originalValue.current = initialValue;
        }
    }, [initialValue, fieldType, formatTime]);

    useEffect(() => {
        isEditingRef.current = isEditing;
    }, [isEditing]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEditingRef.current && fieldRef.current && !fieldRef.current.contains(event.target)) {
                setIsEditing(false);
                setValue(originalValue.current);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleSave = async () => {
        if (fieldType === 'time' && !validateTime(value)) {
            setError('Некорректное значение, введите значение в формате чч:мм');
            return;
        }

        try {
            console.log(addData);
            const response = await axios.post(updateUrl, { [fieldName]: value, updateType, ...addData });

            if (onUpdate) onUpdate(fieldName, value);

            setSuccess('Данные успешно обновлены');
            setTimeout(() => {
                setSuccess('');
            }, 6000);
        } catch (error) {
            console.error('Error:', error);
            setError('Ошибка обновления данных');
            setTimeout(() => {
                setError('');
            }, 6000);
        }

        setIsEditing(false);
        originalValue.current = value;
    };

    return (
        <div className="form__group">
            {fieldType != 'radio' && <label className="form__label" htmlFor={fieldName}>{label}</label>}
            <div className="form__editor" ref={fieldRef}>
                {fieldType == 'radio' ? (
                    radioValues.map((radio) => (
                        <div>
                            <input
                                className="form__input"
                                id={radio.id}
                                name={fieldName}
                                type={fieldType}
                                value={radio.key}
                                checked={value == radio.key}
                                disabled={!isEditing || isDisabled}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <label htmlFor={radio.id}>{radio.val}</label>
                        </div>
                    ))
                ) : (
                    <input
                        className="form__input"
                        id={fieldName}
                        name={fieldName}
                        type={fieldType}
                        value={value}
                        disabled={!isEditing || isDisabled}
                        onChange={(e) => setValue(e.target.value)}
                    />
                )}
                
                <button type="button" className="form__editor--button" onClick={handleEdit} style={{ display: isEditing ? 'none' : 'inline' }}>
                    <img src="/images/edit.svg" alt="Edit" />
                </button>
                <button type="button" className="form__editor--button" onClick={handleSave} style={{ display: isEditing ? 'inline' : 'none' }}>
                    <img src="/images/save.svg" alt="Save" />
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default EditorField;
