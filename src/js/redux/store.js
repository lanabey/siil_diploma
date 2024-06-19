import { configureStore } from '@reduxjs/toolkit';
import screenReducer from './reducers/screenReducer';

const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('screenData', serializedState);
    } catch (e) {
        console.warn("Error saving state", e);
    }
};

const localStorageMiddleware = store => next => action => {
    const result = next(action);
    const state = store.getState();
    saveToLocalStorage(state.data);
    return result;
};

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('screenData');
        if (serializedState === null) return undefined;
        return { data: JSON.parse(serializedState) };
    } catch (e) {
        console.warn("Error loading state", e);
        return undefined;
    }
};

const preloadedState = loadFromLocalStorage();

const store = configureStore({
    reducer: {
        data: screenReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
    preloadedState,
});

export default store;