const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

const createInfoPage = () => {
  return `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `;
};

app.use(cors());
app.use(express.json());
morgan.token('data', (req, res) => { return req.method === 'POST' ? JSON.stringify(req.body) : ' ' });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/info', (req, res) => {
  const page = createInfoPage();
  res.send(page);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'Content missing'
    });
  }

  const person = persons.find(p => p.name === name);

  if (person) {
    return res.status(400).json({
      error: 'Name must be unique'
    });
  }

  const newPerson = {
    name,
    number,
    id: crypto.randomUUID(),
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id.toString() === id);

  if (!person) return res.status(404).end();

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});