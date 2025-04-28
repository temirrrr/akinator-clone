import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Tutorial from './pages/Tutorial'
import Settings from './pages/Settings'
import Achievements from './pages/Achievements'
import Game from './pages/Game'
import GameLLM from './pages/GameLLM'
import Guess from './pages/Guess'

export default function App() {
    return (
        <Router>
            <NavBar/>
            <div className="container py-5" style={{marginTop: '70px'}}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/tutorial" element={<Tutorial/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/achievements" element={<Achievements/>}/>
                    <Route path="/game" element={<Game/>}/>
                    <Route path="/game-llm" element={<GameLLM/>}/>
                    <Route path="/guess" element={<Guess/>}/>
                </Routes>
            </div>
        </Router>
    )
}
