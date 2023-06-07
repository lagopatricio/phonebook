const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose.connect(url)
  .then(res =>{
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.log('Error connecting to DB', error.message);
  })

const contactSchema = new mongoose.Schema({
  data:{
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Contact', contactSchema);