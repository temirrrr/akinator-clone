import questionsData from '../data/questions.json';
import charactersData from '../data/characters.json';

const LS_CHARS = 'akinator_characters';

export function loadQuestions() {
    return questionsData;
}

export function loadCharacters() {
    const saved = localStorage.getItem(LS_CHARS);
    return saved ? JSON.parse(saved) : charactersData;
}

export function saveCharacters(chars) {
    localStorage.setItem(LS_CHARS, JSON.stringify(chars));
}

// Простая фильтрация: оставляем персонажей, у которых атрибут совпал или если ответ "Не знаю"
export function filterCandidates(candidates, qid, answer) {
    if (answer === 'Не знаю') return candidates;
    return candidates.filter(c => c.attributes[qid] === answer);
}

// Выбор следующего вопроса по энтропии (Habr-реализация)
export function pickNextQuestion(candidates, asked) {
    const qs = loadQuestions().filter(q => !asked.includes(q.id));
    let best = null, bestEnt = -1;
    qs.forEach(q => {
        const yes = candidates.filter(c => c.attributes[q.id] === 'Да').length;
        const no = candidates.length - yes;
        const pY = yes / candidates.length;
        const pN = no / candidates.length;
        const ent =
            (pY > 0 ? -pY * Math.log2(pY) : 0) +
            (pN > 0 ? -pN * Math.log2(pN) : 0);
        if (ent > bestEnt) {
            bestEnt = ent;
            best = q;
        }
    });
    return best;
}

export async function learnNewCharacter(name, image, answers) {
    const yesList = Object.entries(answers)
        .filter(([_, ans]) => ans === 'Да')
        .map(([qid]) => qid);

    await fetch('http://localhost:4000/save-character', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, image, yes: yesList}),
    });
}

export async function updateCharacter(id, newAnswers) {
    const yesAnswers = Object.entries(newAnswers)
        .filter(([_, ans]) => ans === 'Да')
        .map(([qid]) => qid);

    await fetch('http://localhost:4000/update-character', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, yes: yesAnswers}),
    });
}
