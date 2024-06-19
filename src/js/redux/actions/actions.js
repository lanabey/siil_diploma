export const updateFirst = (data) => ({
    type: 'UPDATE_FIRST',
    payload: data,
});

export const updateFirstBus = (data) => ({
    type: 'UPDATE_BUS_IN_FIRST_SCREEN',
    payload: data,
});

export const updateSecond = (data) => ({
    type: 'UPDATE_SECOND',
    payload: data,
});updateFourth

export const updateFourth = (data) => ({
    type: 'UPDATE_FOURTH',
    payload: data,
});

export const updateAppData = (data) => ({
    type: 'UPDATE_APP_DATA',
    payload: data,
});

export const resetData = () => ({
    type: 'RESET_DATA',
});