import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAppData, resetData } from '../redux/actions/actions';

import FirstScreen from '../screens/FirstScreen';
import SecondScreen from '../screens/SecondScreen';
import ThirdScreen from '../screens/ThirdScreen';
import ForthScreen from '../screens/ForthScreen';
import FithScreen from '../screens/FithScreen';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [inputBlocked, setInputBlocked] = useState(false);

    const savedState = useSelector((state) => state.data.appData);
    const dispatch = useDispatch();

    useEffect(() => {
        if (savedState) {
            setInputBlocked(savedState.inputBlocked || false);
        }
    }, []);

    useEffect(() => {
        const localState = { inputBlocked };

        dispatch(updateAppData(localState));
    }, [dispatch, inputBlocked]);

    const resetScreens = () => {
        dispatch(resetData());
        setInputBlocked(false);
        setCurrentScreen(1);
    }

    return (
        <div>
            <div className="tabs">
                <button className={`tabs__btn ${currentScreen === 1 ? 'tabs__btn--active' : ''}`} onClick={() => setCurrentScreen(1)}>1</button>
                <button className={`tabs__btn ${currentScreen === 2 ? 'tabs__btn--active' : ''}`} onClick={() => setCurrentScreen(2)}>2</button>
                <button className={`tabs__btn ${currentScreen === 3 ? 'tabs__btn--active' : ''}`} onClick={() => setCurrentScreen(3)}>3</button>
                <button className={`tabs__btn ${currentScreen === 4 ? 'tabs__btn--active' : ''}`} onClick={() => setCurrentScreen(4)}>4</button>
                <button className={`tabs__btn ${currentScreen === 5 ? 'tabs__btn--active' : ''}`} onClick={() => setCurrentScreen(5)}>5</button>
            </div>
            <div>
                {currentScreen === 1 && <FirstScreen inputBlocked={inputBlocked || false}/>}
                {currentScreen === 2 && <SecondScreen inputBlocked={inputBlocked || false} setInputBlocked={setInputBlocked}/>}
                {currentScreen === 3 && <ThirdScreen />}
                {currentScreen === 4 && <ForthScreen />}
                {currentScreen === 5 && <FithScreen resetScreen={resetScreens}/>}
            </div>
        </div>
    );
};

export default App;
