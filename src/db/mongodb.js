const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide password as argument.');
  process.exit(1);
}

const db_name = 'phonebook';
const password = process.argv[2];

const db_uri = `mongodb+srv://criss_web_app:${password}@cluster0.edf10.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false);
mongoose.connect(db_uri);

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', PersonSchema);

if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];

  if (!name || !number) {
    console.log('Please provide all data needed. "name" "number"');
    process.exit(1);
  }

  const newPerson = new Person({ name, number });
  newPerson.save().then(res => {
    console.log(`Added ${name} Number ${number} to phonebook`);
    mongoose.connection.close();
    process.exit(0);
  });
}

Person
  .find({})
  .then(res => {
    console.log('Phonebook:');

    res.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
    process.exit(0);
  });

