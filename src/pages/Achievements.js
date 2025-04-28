import React, {useEffect, useState} from 'react';

const ACHIEVEMENTS = [
    'Первый раунд',
    'Победа!',
    'Поражение...',
    '10 игр',
    '50 игр',
    '100 игр',
    'Обучил джинна',
    'Темная тема',
    'Entropy Master',
    'Мастер вопросов'
];

const CONDITIONS = [
    s => s.games >= 1,
    s => s.wins >= 1,
    s => s.losses >= 1,
    s => s.games >= 10,
    s => s.games >= 50,
    s => s.games >= 100,
    s => s.taught >= 1,
    () => JSON.parse(localStorage.getItem('darkMode') || 'false'),
    s => s.games >= 20,
    s => s.games >= 30
];

export default function Achievements() {
    const [stats, setStats] = useState({
        games: 0,
        wins: 0,
        losses: 0,
        taught: 0
    });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('akinatorStats') || '{}');
        setStats(s => ({...s, ...stored}));
    }, []);

    const progress = [
        Math.min(stats.games, 1) / 1,
        Math.min(stats.wins, 1) / 1,
        Math.min(stats.losses, 1) / 1,
        Math.min(stats.games, 10) / 10,
        Math.min(stats.games, 50) / 50,
        Math.min(stats.games, 100) / 100,
        Math.min(stats.taught, 1) / 1,
        JSON.parse(localStorage.getItem('darkMode') || 'false') ? 1 : 0,
        Math.min(stats.games, 20) / 20,
        Math.min(stats.games, 30) / 30
    ];

    return (
        <div className="row gx-4 gy-4">
            {ACHIEVEMENTS.map((title, i) => {
                const unlocked = CONDITIONS[i](stats);
                return (
                    <div className="col-12 col-md-6 col-lg-4" key={i}>
                        <div className={`card shadow-sm h-100 ${unlocked ? 'border-success' : 'border-danger'}`}>
                            <div className="card-body text-center">
                                <h5 className="card-title">{title}</h5>
                                <div className="mb-2">
                                    {unlocked ? '🔓 Открыто' : '🔒 Заблокировано'}
                                </div>
                                <div className="progress" style={{height: '8px'}}>
                                    <div
                                        className={`progress-bar ${unlocked ? 'bg-success' : 'bg-secondary'}`}
                                        role="progressbar"
                                        style={{width: `${progress[i] * 100}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
