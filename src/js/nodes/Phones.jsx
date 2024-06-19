import React, { useState } from 'react';

import PhonesEditor from '../components/PhonesEditor';
import PhonesList from '../components/PhonesList';

const Phones = () => {
    const [listActive, setListActive] = useState(false);
    const [editorActive1, setEditorActive1] = useState(false);
    const [editorActive2, setEditorActive2] = useState(false);

    const closeEditors = () => {
        setListActive(false);
        setEditorActive1(false);
        setEditorActive2(false);
    };

    return (
        <div>
            <div className="section__header">
                <h1 className="section__title">Список телефонных номеров</h1>
                {(listActive || editorActive1 || editorActive2) && (
                    <button className="button button--active" type="button" onClick={closeEditors}>Назад</button>
                )}
            </div>

            {!(listActive || editorActive1 || editorActive2) && (
                <div className="phones">
                    <button className="phones__button" onClick={() => setEditorActive1(true)}>
                        <img src="/images/msk.svg" alt="Оператор Москва" />
                        <span className="phones__text">Оператор Москва</span>
                    </button>
                    <button className="phones__button" onClick={() => setEditorActive2(true)}>
                        <img src="/images/atp.svg" alt="АТП телефоны" />
                        <span className="phones__text">АТП телефоны</span>
                    </button>
                    <button className="phones__button" onClick={() => setListActive(true)}>
                        <img src="/images/emrg.svg" alt="Экстренные телефоны" />
                        <span className="phones__text">Экстренные телефоны</span>
                    </button>
                </div>
            )}

            {editorActive1 && (
                <PhonesEditor phoneType="msk" />
            )}

            {editorActive2 && (
                <PhonesEditor phoneType="patp" />
            )}

            {listActive && (
                <PhonesList />
            )}
        </div>
    );
};

export default Phones;
