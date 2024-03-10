const mongoose = require("mongoose");
const uri = process.env.DB_URI;

mongoose.connect(uri)
  .then(result => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d{6,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  }
});

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', PersonSchema);