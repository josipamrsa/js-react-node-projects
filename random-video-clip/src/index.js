import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import './index.css'; // css stilovi za aplikaciju
import * as Icon from 'react-feather'; // ikone za botune

window.onload = () => { alert("Spoiler alert :)") };

// baza podataka
const baza_isjecaka = [
  {
    'video' : "https://www.youtube.com/watch?v=4aXIFFaWNjM",
    'film' : "Inglorious Basterds",
    'opis' : "Arrivederci!",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=cvjmwbLEynU",
    'film' : "Once Upon A Time In Hollywood",
    'opis' : "Don't cry in front of the Mexicans.",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=rplDqXjP8UU",
    'film' : "Once Upon A Time In Hollywood",
    'opis' : "My booze don't need no buddy!",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=Ik-RsDGPI5Y",
    'film' : "Pulp Fiction",
    'opis' : "Dancing scene",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=yaMRzF9arDc",
    'film' : "Pulp Fiction",
    'opis' : "Vincent, I'm on the intercom!",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=QxJHJPCh65A",
    'film' : "Django Unchained",
    'opis' : "Dinner scene",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=fCbf4DjlHuM",
    'film' : "Kill Bill: Vol. 2",
    'opis' : "Encounter with Pai Mei",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=ksj9I_2aw_Y",
    'film' : "Django Unchained",
    'opis' : "You will?!",
    'glasovi': 0
  },

  {
    'video' : "https://www.youtube.com/watch?v=z0FldmJv3Mc",
    'film' : "Pulp Fiction",
    'opis' : "Hamburgers! The cornerstone of any nutritious breakfast.",
    'glasovi': 0
  }
]; 

// bazna komponenta za isječak
const Isjecak = (props) => {
  return (
    <div>
      <ReactPlayer url={props.url} />
    </div>
  );
};

// bazna komponenta za prikaz lajkova
const PrikazLajkova = (props) => {
  return (
    <div>
      <p>
        <Icon.ThumbsUp size="2vmin" />
        {props.lajkovi}
      </p>
    </div>
  );
};

// komponenta za prikaz novog nasumičnog isječka
const NoviIsjecak = (props) => {
  return (
    <div>
      <h2>"{props.opis}"</h2>
      <p><em>- {props.film}</em></p>

      <Isjecak url={props.video} 
               naslov={props.film}
               opis={props.opis} />
    </div>
  );
};

// komponenta za prikaz najpopularnijeg (najvise lajkova)
const NajpopularnijiIsjecak = (props) => {
  // ako nema nijednog čiji je broj lajkova 
  // veći od 0, nema potrebe za prikazom
  if (props.glasovi === 0) {
    return (
      <div className="container-popularni">
        <img 
          src="https://media3.giphy.com/media/26AHwbQasvsGXMOjK/giphy.gif" 
          alt="Travolta and Thurman dancing" />
      </div>
    );
  }

  // ako ima neki sa lajkovima većima od 0, 
  // prikazuje se ovaj dio
  else {
    return (
      <div className="container-popularni">

        <h6>Najpopularniji</h6>
        <h2>"{props.opis}"</h2>
        <p><em>- {props.film}</em></p>

        <Isjecak url={props.video} 
                 naslov={props.film}
                 opis={props.opis} />

        <div className="container-kontrole">
            <PrikazLajkova lajkovi={props.glasovi} />
        </div>
      </div>
    );
  }
};

// komponenta za tipke
const Tipka = (props) => {
  const IconTag = Icon[props.ikona];
  return (
    <button onClick={props.funkcija} 
            className={props.stil}>
              <IconTag size="2vmin" /> 
              {props.tekst}
    </button>
  );
};

// glavna komponenta
const App = () => {
  const duljina = baza_isjecaka.length; // duljina baze podataka
  const baza = {...baza_isjecaka}; // kopija baze podataka

  // umjesto postavljanja na 0, postavi se odmah na random broj intervala [0, duljina baze podataka]
  const [nasumicni, postaviNasumicni] = useState(Math.floor(Math.random() * duljina));

  // inicijaliziraj kao cijelu bazu podataka
  const [nova, postaviLajkove] = useState(baza);
  
  // provjeri popularne, inicijalizacija na prvi element kod page loada
  const [popularna, postaviPopularni] = useState(baza[0]);

  const generirajNovi = () => {
    postaviNasumicni(Math.floor(Math.random() * duljina));
  };

  const lajkajTrenutni = () => {    
    let novo_stanje = {...nova};           // napravi kopiju baze kao novo stanje   
    novo_stanje[nasumicni].glasovi += 1;   // povecaj broj glasova/lajkova u kopiji   
    postaviLajkove(novo_stanje);           // kopija je sada novo stanje
    azurirajPopularni();                   // da se odmah ažurira s obzirom na stanje lajkova
  };

  const azurirajPopularni = () => {
    let novo_stanje = {...nova}
    let trenutna_popularna = {...popularna}
    
    // iteracija po cijelom objektu baze 
    // i postavljanje novog popularnog prema glasovima

    Object.keys(novo_stanje).forEach(key => {
      if (novo_stanje[key].glasovi > popularna.glasovi) {trenutna_popularna = novo_stanje[key]}
    });
    postaviPopularni(trenutna_popularna);
  }
  
  return (
    <div className="container">
      <h1>Quentin Tarantino isječak dana</h1>

      <div className="container-prikazi">
        <div className="container-glavni"> 
          <NoviIsjecak {...nova[nasumicni]} className="isjecak" />

          <div className="container-kontrole">
            <Tipka funkcija={generirajNovi} 
                   ikona="ChevronsRight" 
                   tekst="Novi" 
                   stil="novi-botun" />

            <Tipka funkcija={lajkajTrenutni} 
                   ikona="Heart" 
                   tekst="Like" 
                   stil="lajk-botun" />

            <PrikazLajkova lajkovi={nova[nasumicni].glasovi} />
          </div>
        </div>
              
        <NajpopularnijiIsjecak {...popularna} className="najpopularniji" /> 

      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));