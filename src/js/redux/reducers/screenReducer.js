const initialState = {};

const screenReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_FIRST':
            return {
                ...state,
                firstScreen: action.payload,
            };
        case 'UPDATE_BUS_IN_FIRST_SCREEN':
            return {
                ...state,
                firstScreen: {
                    ...state.firstScreen,
                    bus: action.payload.bus,
                    busData: action.payload.busData,
                }
            };
        case 'UPDATE_SECOND':
            return {
                ...state,
                secondScreen: action.payload,
            };
        case 'UPDATE_FOURTH':
            return {
                ...state,
                fourthScreen: action.payload,
            };
        case 'UPDATE_APP_DATA':
            return {
                ...state,
                appData: action.payload,
            };
        case 'RESET_DATA':
            return {
                ...state,
                firstScreen: null,
                secondScreen: null,
                fourthScreen: null,
                appData: null,
            };
        default:
            return state;
    }
};

export default screenReducer;