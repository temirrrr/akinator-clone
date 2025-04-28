import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import questionsData from '../data/questions.json'
import charactersData from '../data/characters.json'

export default function Game() {
    const navigate = useNavigate()
    const allQuestions = questionsData
    const [remainingQ, setRemainingQ] = useState([...allQuestions])
    const [asked, setAsked] = useState([])
    const [answers, setAnswers] = useState({})
    const [candidates, setCandidates] = useState(charactersData)

    const MIN_Q = 10
    const THRESHOLD = 0.9
    const MAX_QUESTIONS = 12;

    const topScore = React.useMemo(() => {
        if (asked.length === 0) return 0
        return Math.max(...candidates.map(c => {
            const match = asked.reduce(
                (acc, q) => acc + (answers[q.id] === (c.yes.includes(q.id) ? 'Да' : 'Нет') ? 1 : 0),
                0
            )
            return match / asked.length
        }))
    }, [asked, answers, candidates])

    useEffect(() => {
        if (asked.length >= MIN_Q && topScore >= THRESHOLD) {
            navigate('/guess', {state: {candidates, answers}});
        } else if (asked.length >= MAX_QUESTIONS && candidates.length === 0) {
            navigate('/guess', {state: {candidates, answers, gaveUp: true}});
        }
    }, [topScore, asked, candidates, answers, navigate]);

    const currentQ = remainingQ.length
        ? remainingQ[Math.floor(Math.random() * remainingQ.length)]
        : null

    function onAnswer(ans) {
        if (!currentQ) return
        setAsked(a => [...a, currentQ])
        setAnswers(a => ({...a, [currentQ.id]: ans}))
        setCandidates(candidates.filter(c =>
            (ans === 'Да') === c.yes.includes(currentQ.id)
        ))
        setRemainingQ(r => r.filter(q => q.id !== currentQ.id))
    }

    if (!currentQ) {
        navigate('/guess', {state: {candidates, answers}})
        return null
    }

    return (
        <div className="card mx-auto" style={{maxWidth: 600}}>
            <div className="card-header">Вопрос {asked.length + 1}</div>
            <div className="card-body text-center">
                <p className="fs-4 mb-4">{currentQ.text}</p>
                {['Да', 'Нет'].map(opt => (
                    <button
                        key={opt}
                        className="btn btn-outline-primary mx-2"
                        onClick={() => onAnswer(opt)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    )
}
