const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('content', function getContent (req){
  return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.content(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));

let phonebook = [
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
]

app.get('/api/phonebook', (req, res) =>{
  res.json(phonebook);
})

app.get('/info', (req, res) =>{
  res.send(
    `
    <p>Phonebook has info for ${phonebook.length} contacts.</p>
    <p>${new Date()}</p>
    `
    )
})

app.get('/api/phonebook/:id', (req, res) =>{
  const id = Number(req.params.id);
  const contact = phonebook.find(contact => contact.id === id);
  res.json(contact);
})

app.delete('/api/phonebook/:id', (req, res) =>{
  const id = Number(req.params.id);
  phonebook = phonebook.filter(contact => contact.id !== id);
  res.status(204).end();
})

app.post('/api/phonebook', (req, res) =>{
  const id = Math.floor(Math.random() * 10000000000) + 1;
  const newContact = req.body;

  if(!newContact.name){
    return res.status(400).json({
      error: 'Please input a name'
    })
  } else if(phonebook.find(contact => contact.name === newContact.name)){
    return res.status(400).json({
      error: `Contact with name ${newContact.name} already exists.`
    })
  }

  newContact.id = id;
  phonebook = phonebook.concat(newContact);
  res.json(newContact);
})

const PORT = 3001;

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}.`);
})