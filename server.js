const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = './src/data/characters.json';

app.post('/save-character', (req, res) => {
    const {name, image, yes} = req.body;
    if (!name || !yes) return res.status(400).send('Invalid data');

    const characters = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    const newId = `c${characters.length + 1}`;
    const newChar = {id: newId, name, yes};
    characters.push(newChar);
    fs.writeFileSync(DATA_PATH, JSON.stringify(characters, null, 2));
    res.send({success: true});
})

app.post('/update-character', (req, res) => {
    const {id, yes} = req.body;
    if (!id || !yes) return res.status(400).send('Invalid data');

    const characters = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    const idx = characters.findIndex(c => c.id === id);

    if (idx === -1) return res.status(404).send('Character not found');

    characters[idx].yes = yes;
    fs.writeFileSync(DATA_PATH, JSON.stringify(characters, null, 2));
    res.send({success: true});
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
