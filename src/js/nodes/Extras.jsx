import React, { useState } from 'react';

import RouteAnalytics from '../components/RouteAnalytics';

const Extras = () => {
    const extras = [
        {
            type: 'analytics',
            title: 'Аналитика маршрутов',
            descr: 'Поможет подобрать оптимальный маршрут для работы'
        },
    ]

    const [selectedMenu, setSelectedMenu] = useState('');

    const closeEditors = () => {
        setSelectedMenu('');
    };

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Дополнительные возможности</h1>
                {selectedMenu && (
                    <button className="button button--active" type="button" onClick={closeEditors}>Назад</button>
                )}
            </div>

            {!selectedMenu && (
                <div className="list">
                    {extras.map((item, index) => (
                        <div className="list__item" key={index} onClick={() => setSelectedMenu(item.type)}>
                            <div className="list__card">
                                <div className="list__column">
                                    <h2 className="list__line">{item.title}</h2>
                                    <p className="list__line">{item.descr}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedMenu == 'analytics' && (
                <RouteAnalytics />
            )}
        </div>
    );
};

export default Extras;