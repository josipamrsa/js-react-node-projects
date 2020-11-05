const mongoose = require('mongoose');

const pass = process.env.ATLAS_PASS; 
const dbname = "adresar-api";

// Greška na vježbama prošli put je bila zbog "prelamanja" URL-a, pa treba sve biti u jednoj liniji
const url = `mongodb+srv://oarwa-adr:${pass}@adresarcluster.3ylnm.mongodb.net/${dbname}?retryWrites=true&w=majority`;

console.log("Spajanje na bazu...");

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then (result => console.log("Uspješno spajanje na bazu!"))
  .catch (err => console.log("Greška pri spajanju!", err));

const osobaSchema = new mongoose.Schema({
    ime: {
        type: String,
        required: true,
        minlength: 5
    },

    email: {
        type: String,
        required: true,
        minlength: 5
    }
});

osobaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Osoba', osobaSchema, 'osobe');