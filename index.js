const express = require('express');
require('dotenv').config()
var morgan = require('morgan')
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001
const Person = require('./models/person');


app.use(express.static('dist'));
app.use(express.json());

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler);

app.use(cors());
morgan.token('data', function (req, res) { const data = JSON.stringify(req.body); if (data === "{}") { return "" } return data })
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.data(req, res),
    ].join(' ')
}))
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons));
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({ error: "name missing" })
    }
    else if (!body.number) {
        return res.status(400).json({ error: "Number missing" })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save().then(result => {
        res.json(result);
    }).catch(() => {
        res.status(404)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.json(404).end()
        }
    }).catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(deletedPerson => {
        res.json(deletedPerson);
    }).catch(err => next(err))
})

// app.get('/info', (req, res) => {
//     return res.send(`
//     <p>Phone book has info for ${Persons.length} people</p>
//     <br/>
//     <p>${new Date(Date.now()).toUTCString()}</p>
//     `)
// })

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})