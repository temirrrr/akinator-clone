// src/pages/Tutorial.js
import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function Tutorial() {
    const nav = useNavigate();

    return (
        <div className="mx-auto" style={{maxWidth: '800px'}}>
            <div className="card shadow-sm p-4">
                <h2 className="text-center mb-4">Как играть</h2>

                <div className="mb-4">
                    <h4 className="text-primary">Режим 1: База данных</h4>
                    <p>
                        Я задам тебе случайные вопросы, чтобы отсеивать кандидатов из списка известных персонажей.
                        Отвечай «Да», «Нет» или «Не знаю». Когда я буду уверен достаточно — я попробую угадать!
                        Если я ошибусь — ты сможешь добавить нового персонажа в мою базу данных ✨.
                    </p>
                </div>

                <div className="mb-4">
                    <h4 className="text-success">Режим 2: Искусственный интеллект</h4>
                    <p>
                        Я задам тебе 4 базовых вопроса, а затем с помощью нейросети придумаю ещё 6 уточняющих.
                        После 10 ответов я попытаюсь угадать любого реального или вымышленного персонажа!
                    </p>
                </div>

                <div className="text-center">
                    <button className="btn btn-primary me-2" onClick={() => nav('/game')}>
                        Играть через базу данных
                    </button>
                    <button className="btn btn-success" onClick={() => nav('/game-llm')}>
                        Играть через ИИ
                    </button>
                </div>
            </div>
        </div>
    );
}
