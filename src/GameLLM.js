import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "#",
    dangerouslyAllowBrowser: true,
});

const BASE_QUESTIONS = [
    "Это реальный персонаж?",
    "Это мужчина?",
    "Этот человек жив?",
    "Это персонаж из кино?"
];

export default function GameLLM() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [dynamicQs, setDynamicQs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentGuess, setCurrentGuess] = useState(null);

    const totalQuestions = BASE_QUESTIONS.length + dynamicQs.length;

    async function handleAnswer(ans) {
        if (isLoading) return;

        const currentQ = step < BASE_QUESTIONS.length
            ? BASE_QUESTIONS[step]
            : dynamicQs[step - BASE_QUESTIONS.length];

        setAnswers(prev => ({...prev, [currentQ]: ans}));

        if (step + 1 < BASE_QUESTIONS.length) {
            setStep(prev => prev + 1);
        } else if (step + 1 === BASE_QUESTIONS.length) {
            await generateDynamicQuestions();
        } else if (step + 1 < totalQuestions) {
            setStep(prev => prev + 1);
        } else if (step + 1 === totalQuestions) {
            await makeGuess();
        }
    }

    async function generateDynamicQuestions() {
        setIsLoading(true);
        try {
            const prompt = `
Ты — профессиональный угадыватель персонажей.

На основе следующих ответов задай 6 уточняющих вопросов, которые помогут точнее определить личность.

${Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join('\n')}

Формат ответа: каждый вопрос с новой строки без нумерации.
`;
            const res = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{role: 'user', content: prompt}],
                max_tokens: 300,
                temperature: 0.5,
            });
            const text = res.choices[0].message.content.trim();
            const qs = text.split('\n').map(l => l.replace(/^\d+[).]?\s*/, '').trim()).filter(Boolean).slice(0, 6);
            setDynamicQs(qs);
            setStep(prev => prev + 1);
        } catch (err) {
            console.error('Ошибка генерации вопросов:', err);
        }
        setIsLoading(false);
    }

    async function makeGuess() {
        setIsLoading(true);
        try {
            const prompt = `
На основе следующих ответов угадай любого известного персонажа (реального или вымышленного).

${Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join('\n')}

Ответь только именем персонажа без пояснений.
`;
            const res = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{role: 'user', content: prompt}],
                max_tokens: 100,
                temperature: 0,
            });
            const guess = res.choices[0].message.content.trim();
            setCurrentGuess(guess);
        } catch (err) {
            console.error('Ошибка угадывания:', err);
        }
        setIsLoading(false);
    }

    function handleFinalConfirm(correct) {
        navigate('/');
    }

    const currentQ = step < BASE_QUESTIONS.length
        ? BASE_QUESTIONS[step]
        : (step < BASE_QUESTIONS.length + dynamicQs.length
            ? dynamicQs[step - BASE_QUESTIONS.length]
            : null);

    return (
        <div className="card mx-auto text-center" style={{maxWidth: 600}}>
            <div className="card-body">
                {isLoading ? (
                    <h4 className="card-title mb-4">Пожалуйста, подождите...</h4>
                ) : currentGuess ? (
                    <>
                        <h4 className="card-title mb-4">Я думаю, это {currentGuess}!</h4>
                        <button className="btn btn-success me-2" onClick={() => handleFinalConfirm(true)}>
                            Правильно
                        </button>
                        <button className="btn btn-danger" onClick={() => handleFinalConfirm(false)}>
                            Неправильно
                        </button>
                    </>
                ) : currentQ ? (
                    <>
                        <h4 className="card-title mb-4">{currentQ}</h4>
                        <button
                            className="btn btn-success me-2"
                            onClick={() => handleAnswer('Да')}
                        >
                            Да
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleAnswer('Нет')}
                        >
                            Нет
                        </button>
                    </>
                ) : (
                    <h4 className="card-title">Подождите...</h4>
                )}
            </div>
        </div>
    );
}
