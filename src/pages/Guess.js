import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {learnNewCharacter, updateCharacter} from '../utils/akinator';
import questionsData from '../data/questions.json';

export default function Guess() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const {candidates, answers, gaveUp, guess: llmGuess} = state || {};
    const guess = candidates?.[0] || (llmGuess ? {name: llmGuess} : null);


    const [step, setStep] = useState('confirm');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [newAnswers, setNewAnswers] = useState(answers || {});

    const stats = JSON.parse(localStorage.getItem('akinatorStats') || '{}');

    const saveStats = (updates) => {
        const updated = {...stats, ...updates};
        localStorage.setItem('akinatorStats', JSON.stringify(updated));
    };

    function onConfirm(correct) {
        const played = (stats.games || 0) + 1;
        if (correct) {
            saveStats({games: played, wins: (stats.wins || 0) + 1});
            navigate('/');
        } else {
            saveStats({games: played, losses: (stats.losses || 0) + 1});
            if (candidates) {
                setStep('learn');
            } else {
                navigate('/');
            }
        }
    }

    function onLearnSubmit(e) {
        e.preventDefault();
        learnNewCharacter(name, image, newAnswers);
        if (guess?.id) {
            updateCharacter(guess.id, newAnswers);
        }
        saveStats({taught: (stats.taught || 0) + 1});
        navigate('/');
    }


    return (
        <div className="mx-auto" style={{maxWidth: '600px'}}>
            {step === 'confirm' ? (
                <div className="card text-center shadow-sm">
                    <div className="card-body">
                        {gaveUp ? (
                            <>
                                <h3 className="card-title mb-4">Я не смог угадать... Кто это был?</h3>
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => setStep('learn')}
                                >
                                    Добавить персонажа
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/')}
                                >
                                    Вернуться на главную
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="card-title mb-4">Это {guess.name}?</h3>
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => onConfirm(true)}
                                >
                                    Да
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => onConfirm(false)}
                                >
                                    Нет
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <form onSubmit={onLearnSubmit} className="card p-4 shadow-sm">
                    <h4 className="mb-3">Кто это был на самом деле?</h4>
                    <input
                        className="form-control mb-3"
                        placeholder="Имя персонажа"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input
                        className="form-control mb-3"
                        placeholder="URL изображения (опц.)"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                    />
                    <h5 className="mb-2">Отметьте вопросы, на которые ответ был «Да»:</h5>
                    {Object.keys(newAnswers).map(qid => (
                        <div className="form-check mb-2" key={qid}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={qid}
                                checked={newAnswers[qid] === 'Да'}
                                onChange={e => setNewAnswers({
                                    ...newAnswers,
                                    [qid]: e.target.checked ? 'Да' : 'Нет'
                                })}
                            />
                            <label className="form-check-label" htmlFor={qid}>
                                {questionsData.find(q => q.id === qid)?.text || qid}
                            </label>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary mt-3">
                        Сохранить нового персонажа
                    </button>
                </form>
            )}
        </div>
    );
}
