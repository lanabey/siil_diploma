import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { UtilityFunctionsProvider } from './utils/UtilityFunctionsContext';
import Screens from './nodes/Screens';
import EditProfile from './nodes/EditProfile';
import Timetables from './nodes/Timetables';
import Alarms from './nodes/Alarms';
import Buses from './nodes/Buses';
import Phones from './nodes/Phones';
import Reports from './nodes/Reports';
import Payslips from './nodes/Payslips';
import Extras from './nodes/Extras';

const componentMapping = {
    'screens': Screens,
    'edit-profile': EditProfile,
    'timetables': Timetables,
    'alarms': Alarms,
    'buses': Buses,
    'phones': Phones,
    'reports': Reports,
    'payslips': Payslips,
    'extras': Extras,
};

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-react-component]');
    
    containers.forEach(container => {
        const componentName = container.getAttribute('data-react-component');
        const Component = componentMapping[componentName];
        
        if (Component) {
            if (componentName == 'screens') {
                ReactDOM.render(
                    <Provider store={store}>
                        <UtilityFunctionsProvider>
                            <Component />
                        </UtilityFunctionsProvider>
                    </Provider>,
                    container
                );
            } else {
                ReactDOM.render(
                    <UtilityFunctionsProvider>
                        <Component />
                    </UtilityFunctionsProvider>,
                    container
                );
            }
        }
    });
});
