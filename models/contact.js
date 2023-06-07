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
      minlength: [3, 'Contact name must be at least 3 characters long.'],
      required: [true, 'Contact name required.'],
    },
    number: {
      type: String,
      validate:{
        validator: function(val){
          return /\d{2,3}-\d{8}/.test(val);
        },
        message: prop => `${prop.value} is no a valid phone number.`
      },
      required: [true, 'Contact phone number required.']
    }
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