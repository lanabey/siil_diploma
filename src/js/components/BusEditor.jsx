import React, { useState, useEffect } from 'react';

import EditorField from './EditorField';

const BusEditor = ({ selectedBus }) => {
    const apiUrl = '/api/buses/update';

    const [currentBus, setCurrentBus] = useState({
        busNumber: '',
        plateNumber: '',
        brand: ''
    });

    useEffect(() => {
        if (selectedBus) {
            setCurrentBus({
                busNumber: selectedBus.bus_number || '',
                plateNumber: selectedBus.plate_number || '',
                brand: selectedBus.bus_brand || ''
            });
        }
    }, [selectedBus]);

    const handleUpdate = (updatedField, updatedValue) => {
        setCurrentBus((prevBus) => ({
            ...prevBus,
            [updatedField]: updatedValue,
        }));
    };

    return (
        <div className="form">
            <EditorField
                initialValue={currentBus.busNumber}
                label="Борт"
                fieldName="busNumber"
                updateUrl={apiUrl}
                updateType="busNumber"
                fieldType="number"
                addData={{ plateNumberKey: currentBus.plateNumber }}
            />
            <EditorField
                initialValue={currentBus.plateNumber}
                label="Госномер"
                fieldName="plateNumber"
                updateUrl={apiUrl}
                updateType="plateNumber"
                addData={{ plateNumberKey: currentBus.plateNumber }}
                onUpdate={handleUpdate}
            />
            <EditorField
                initialValue={currentBus.brand}
                label="Марка"
                fieldName="brand"
                updateUrl={apiUrl}
                updateType="brand"
                addData={{ plateNumberKey: currentBus.plateNumber }}
            />
        </div>
    );
};

export default BusEditor;
