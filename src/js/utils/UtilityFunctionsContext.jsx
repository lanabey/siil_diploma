import React, { createContext, useContext } from 'react';

const UtilityFunctionsContext = createContext(null);

export const useUtilityFunctions = () => useContext(UtilityFunctionsContext);

export const UtilityFunctionsProvider = ({ children }) => {
    const getRoutePrefix = (timetable) => {
        return timetable.split('-')[0];
    };

    const getLastTwoChars = (timetable) => {
        const res = timetable.slice(-2);
        return res[0] == '0' ? res[1] : res;
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long', weekday: 'long' };
        return new Date(date).toLocaleDateString('ru-RU', options);
    };

    const formatDateInReport = (date) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('ru-RU', options);
    };

    // const toUTCDate = (date) => {
    //     return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // };

    const getMonthYear = (date) => {
        const options = { year: 'numeric', month: 'long' };
        return new Date(date).toLocaleDateString('ru-RU', options);
    };

    const formatTime = (timeStr = '') => {
        if (!timeStr || timeStr === '--:--') return timeStr;
        const timeParts = timeStr.split(':');
        if (timeParts.length > 1) {
            return `${ timeParts[0] }:${ timeParts[1] }`;
        }
        return timeStr;
    };

    const validateTime = (time) => {
        return /^\d{2}:\d{2}$/.test(time);
    };

    const isPositiveNumber = (numberStr) => {
        return /^\d+$/.test(numberStr) && parseInt(numberStr) >= 0;
    };

    const timeToMinutes = (time) => {
        if (!time) return 0;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const timeToDecimal = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        const decimalHours = hours + (minutes / 60);
        return Math.round(decimalHours * 100) / 100;
    }

    function decimalToTime(decimalHours) {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    }

    const value = {
        getRoutePrefix,
        getLastTwoChars,
        formatDate,
        formatDateInReport,
        // toUTCDate,
        formatTime,
        validateTime,
        isPositiveNumber,
        timeToMinutes,
        timeToDecimal,
        decimalToTime,
        getMonthYear,
    };

    return (
        <UtilityFunctionsContext.Provider value={value}>
            {children}
        </UtilityFunctionsContext.Provider>
    );
};