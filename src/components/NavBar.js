import React from 'react'
import {NavLink} from 'react-router-dom'

export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
            <div className="container">
                <NavLink className="navbar-brand" to="/">Nalrimet's Akinator</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav ms-auto">
                        {[
                            ['/', 'Главная'],
                            ['/tutorial', 'Туториал'],
                            ['/settings', 'Настройки'],
                            ['/achievements', 'Достижения'],
                            ['/game', 'Начать игру'],
                        ].map(([to, label]) => (
                            <li className="nav-item" key={to}>
                                <NavLink
                                    to={to}
                                    className={({isActive}) =>
                                        'nav-link' + (isActive ? ' active' : '')
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
