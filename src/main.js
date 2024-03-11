const Person = require('./models/persons');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const createInfoPage = (length) => {
  return `
    <p>Phonebook has info for ${length} people</p>
    <p>${new Date()}</p>
  `;
};

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
morgan.token('data', (req, res) => { return req.method === 'POST' ? JSON.stringify(req.body) : ' ' });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const page = createInfoPage(persons.length);
    res.send(page);
  });
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  Person.find({ name: name }).then(result => {
    if (result.length > 0) {
      return res.status(400).json({
        error: 'Name must be unique'
      });
    }

    const newPerson = new Person({ name, number, });
    newPerson.save()
      .then(personSaved => {
        res.json(personSaved);
      })
      .catch(err => next(err));
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then(person => {
      if (!person) return res.status(404).end();
      res.json(person);
    })
    .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  const modifiedPerson = {
    name: req.body.name,
    number: req.body.number
  };

  Person.findByIdAndUpdate(id, modifiedPerson,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return next({
          name: 'DeletedResource',
          message: `Information of ${modifiedPerson.name} has already been removed from server`
        });
      }

      res.json(updatedPerson);
    })
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Malformatted id'
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  }

  if (error.name === 'DeletedResource') {
    return res.status(400).json({
      error: error.message
    });
  }

  next(error);
};

const PORT = process.env.PORT;

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});