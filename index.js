const express = require('express');
const app = express();
const PORT = 3001

let Persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

app.use(express.json())
app.get('/api/persons', (req, res) => {
    return res.json(Persons);
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const id = getRandomInt(500);
    Persons.push({
        id: id,
        name: body.name,
        number: body.number
    })
    return res.status(200).json({ msg: "Person added successfully" })
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = Persons.find((person) => person.id === id);
    if (person) {
        return res.json(person);
    } else {

        return res.status(404).end();
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = Persons.find((person) => person.id === id);
    if (person) {
        Persons = Persons.filter((person) => person.id !== id);
        return res.json(person);
    } else {

        return res.status(204).end();
    }
})

app.get('/info', (req, res) => {
    return res.send(`
    <p>Phone book has info for ${Persons.length} people</p>
    <br/>
    <p>${new Date(Date.now()).toUTCString()}</p>
    `)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})