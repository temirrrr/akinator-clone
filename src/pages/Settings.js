import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../theme/ThemeContext';
import bgMusic from '../assets/bg-music.mp3';

const THEMES = {
    light: 'Светлая',
    dark: 'Тёмная',
    cosmic: 'Космическая',
    retro: 'Ретро',
    colorful: 'Яркая'
};

export default function Settings() {
    const {theme, setTheme} = useContext(ThemeContext);
    const [music, setMusic] = useState(() => JSON.parse(localStorage.getItem('bgMusic') || 'false'));
    const [audio] = useState(() => new Audio(bgMusic));

    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);

    useEffect(() => {
        if (music) {
            audio.loop = true;
            audio.volume = 0.2;
            audio.play().catch(() => {
            });
        } else {
            audio.pause();
        }
        localStorage.setItem('bgMusic', JSON.stringify(music));
    }, [music, audio]);

    return (
        <div className="mx-auto" style={{maxWidth: '700px'}}>
            <h2 className="mb-4">Настройки</h2>
            <form className="d-flex flex-column gap-4">

                <div>
                    <label className="form-label">Выберите тему оформления:</label>
                    <select
                        className="form-select"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                    >
                        {Object.entries(THEMES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="musicSwitch"
                        checked={music}
                        onChange={e => setMusic(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="musicSwitch">
                        Фоновая музыка
                    </label>
                </div>

            </form>
        </div>
    );
}
