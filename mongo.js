const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://Nikunj:${password}@stackuptest.euwnpqn.mongodb.net/?retryWrites=true&w=majority&appName=StackUpTest`


mongoose.set('strictQuery', false)
mongoose.connect(url)
console.log("Mongodb connected");

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', PersonSchema);

if (process.argv.length === 5) {



    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save().then(result => {
        console.log(result)
        console.log('saved to database')
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(res => console.log(res.name, res.number));
        mongoose.connection.close()
    })
}