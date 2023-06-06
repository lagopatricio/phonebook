require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Contact = require('./models/contact');

const app = express();

app.use(express.static('build'));
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

app.get('/api/phonebook', (req, res, next) =>{
  Contact.find({})
    .then(contacts => {
      res.json(contacts);
    })
    .catch(err => next(err))
})

app.get('/info', (req, res, next) =>{
  Contact.find({})
    .then(contacts => {
      res.send(`<p>The phonebook contains ${Object.keys(contacts).length} contacts.</p>
                <p>${new Date}</p>`);
    })
    .catch(err => next(err))
})

app.get('/api/phonebook/:id', (req, res, next) =>{
  Contact.findById(req.params.id)
    .then(contact => {
      res.json(contact);
    })
    .catch(err => next(err))
})

app.delete('/api/phonebook/:id', (req, res, next) =>{
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err))
})

app.post('/api/phonebook', (req, res, next) =>{
  const newContact = req.body;
  const newContactData = newContact.data

  if (newContactData.name.length < 1 || newContactData.name === undefined){
    return res.status(400).json({ error: 'Please input a name.' })
  } else if (newContactData.number.length < 1 || newContactData.number === undefined){
    return res.status(400).json({ error: 'Please input a number.' })
  }

  const contact = new Contact({
    data:{
      name: newContactData.name, 
      number: newContactData.number,
    }
  })

  contact.save()
    .then(savedContact => {
      res.json(savedContact);
    })
    .catch(err => next(err))
})

app.put('/api/phonebook/:id', (req, res, next) =>{
  const updatedContact = req.body;
  const updatedContactData = updatedContact.data

  const contact = {
    data:{
      name: updatedContactData.name, 
      number: updatedContactData.number,
    }
  }

  Contact.findByIdAndUpdate(req.params.id, contact, {new: true})
    .then(result =>{
      res.json(result)
    })
    .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 
  
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}.`);
})