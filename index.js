require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Contact = require('./models/contact');

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

app.get('/api/phonebook', (req, res) =>{
  Contact.find({}).then(contacts => {
    res.json(contacts);
  })
})

// app.get('/info', (req, res) =>{
//   res.send(
//     `
//     <p>Phonebook has info for ${phonebook.length} contacts.</p>
//     <p>${new Date()}</p>
//     `
//     )
// })

app.get('/api/phonebook/:id', (req, res) =>{
  Contact.findById(req.params.id).then(contact => {
    res.json(contact);
  })
})

// app.delete('/api/phonebook/:id', (req, res) =>{
//   const id = Number(req.params.id);
//   phonebook = phonebook.filter(contact => contact.id !== id);
//   res.status(204).end();
// })

app.post('/api/phonebook', (req, res) =>{
  const newContact = req.body;

  if (newContact.data.name.length < 1 || newContact.data.name === undefined){
    return res.status(400).json({ error: 'Please input a name.' })
  }

  const contact = new Contact({
    data:{
      name: newContact.name, 
      number: newContact.number,
    }
  })

  contact.save().then(savedContact => {
    res.json(savedContact);
  })
})

const PORT = process.env.PORT
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}.`);
})