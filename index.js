const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.static('build'));

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
    'data':{
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    "id": 1
  },
  {
    'data':{
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    "id": 2
  },
  { 
    'data':{
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    "id": 3
  },
  { 
    'data':{
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    "id": 4
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
  const newContactData = newContact.data;

  if(!newContactData.name){
    return res.status(400).json({
      error: 'Please input a name'
    })
  } else if(phonebook.find(contact => contact.data.name === newContactData.name)){
    return res.status(400).json({
      error: `Contact with name ${newContactData.name} already exists.`
    })
  }

  req.body.id = id;
  phonebook = phonebook.concat(newContact);
  res.json(newContact);
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}.`);
})