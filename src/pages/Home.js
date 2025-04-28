import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function Home() {
    const nav = useNavigate()
    return (
        <div className="d-flex flex-column align-items-center text-center py-5">
            <h1 className="display-3 fw-bold mb-3">Nalrimet's Akinator</h1>
            <p className="lead mb-4 text">Отвечай на вопросы — и я попробую угадать твоего персонажа!</p>
            <div className="d-grid gap-3 w-75 w-md-50">
                <button className="btn btn-lg btn-primary" onClick={() => nav('/game')}>Через базу данных</button>
                <button className="btn btn-lg btn-warning" onClick={() => nav('/game-llm')}>Через GPT</button>
                <hr/>
                <button className="btn btn-outline-primary" onClick={() => nav('/tutorial')}>Туториал</button>
                <button className="btn btn-outline-secondary" onClick={() => nav('/settings')}>Настройки</button>
                <button className="btn btn-outline-success" onClick={() => nav('/achievements')}>Достижения</button>
            </div>
        </div>
    )
}