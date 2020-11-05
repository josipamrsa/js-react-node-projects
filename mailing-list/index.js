const express = require('express'); // import iz es6 neće raditi
const app = express();              // server

// Spajanje na bazu i shema
const Osoba = require('./models/osoba');

// Cross-origin
const cors = require('cors');
app.use(cors());

// Middleware za parsiranje dobivenog odgovora
app.use(express.json()); 

// Middleware za posluživanje builda
app.use(express.static('build'));

const RUTA_OSOBE = '/api/osobe';
const ERR_HANDLER = [
    {
        errIme: "CastError",
        status: 400,
        errPoruka: "Krivi format ID parametra!"
    },

    {
        errIme: "ValidationError",
        status: 400,
        errPoruka: "Greška kod provjere podataka!"
    },

    {
        errIme: "MongoParseError",
        status: 400,
        errPoruka: "Krivi format poslanih podataka"
    },

    {
        errIme: "ReferenceError",
        status: 500,
        errPoruka: "Podaci nisu dohvaćeni"
    }
];

// Dohvat svih osoba
app.get(RUTA_OSOBE, (request, response) => {
    Osoba.find({}).then(result => {
        response.json(result)
    });
});

// Unos nove osobe
app.post(RUTA_OSOBE, (request, response, next) => {
    const podatak = request.body; // Dohvatimo poslane podatke o novoj osobi

    // Ima li poslani podatak bitne informacije
    if (!podatak.ime && !podatak.email) {           // undefined se parsira kao false vrijednost kad je postavljeno ovako
        return response.status(400).json({
            greska: "Nedostatak parametra!",           
        });
    }

    // Nova osoba prema MongoDB shemi
    const osoba = new Osoba({
        ime: podatak.ime,
        email: podatak.email,
    });

    // Spremanje u bazu
    osoba
    .save()
    .then(result => {
        response.json(result);
    })
    .catch(err => next(err));
});

// Brisanje jednog podatka
app.delete(`${RUTA_OSOBE}/:id`, (request, response, next) => {
    const id = request.params.id; 
    Osoba.findByIdAndRemove(id)
    .then(result => {
        response.status(204).end();
    })
    .catch(err => next(err));  
});

// Ažuriranje podatka
app.put(`${RUTA_OSOBE}/:id`, (request, response, next) => {   
    const id = request.params.id; 
    const podatak = request.body;

    const osoba = {
        ime: podatak.ime,
        email: podatak.email
    };

    const provOsoba = new Osoba({...osoba}); // Validacija novog ažuriranja preko sheme

    // Helper metoda kod Mongoose
    provOsoba.validate(err => {
        // Ako dobiveni podaci ne odgovaraju shemi, prekini izvršavanje
        if (err) {
            next(err);
            return;
        }
        // Ako sve valja, nastavi sa izvršavanjem ažuriranja baze
        // Kako bi se prikazivali novi podaci, treba poslati treći parametar new: true
        Osoba.findByIdAndUpdate(id, osoba, {new: true})
        .then(result => {
            response.json(result);
        })
        .catch(err => next(err))
    });
    
});

// Da ne bi bilo "uuups di sam ja to dospio/la"
const nepoznataRuta = (request, response) => {
    response.status(404).send(
        { greska: "Nepostojeća ruta!" }
    );
};

app.use(nepoznataRuta);

// Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.log("Middleware za greške");
    console.log(error);
    const err = ERR_HANDLER.find(e => e.errIme === error.name); // Dohvati tip greške
    if (err) return response.status(err.status).send({greska: err.errPoruka}); // Ako postoji, vrati taj objekt
    else return response.status(500).send({greska: "Nepoznata greška (500)!"}); // Ako ne, greška je na serveru
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server je pokrenut.");
});
