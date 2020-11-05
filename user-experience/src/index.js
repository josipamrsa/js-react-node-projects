import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // css stilovi za aplikaciju
import * as Icon from 'react-feather'; // ikone za botune

const Tipka = (props) => {
  // definira tipke koje postavljaju glasove

  // kako bi se mogla koristiti ikona prema poslanom parametru
  const IconTag = Icon[props.ikona];
  return (  
    <button onClick={props.klik} className={props.stil}>
      <IconTag size={48} />
    </button>
  );
};

const Ocjena = (props) => {
  // oznaka i broj glasova za pojedinu ocjenu
  return (
    <div className={props.stil}>
      <p>{props.oznaka}: {props.broj}</p>
    </div>
  );
};

const Statistika = (props) => {
  // ako postoji barem jedan glas, onda se statistika računa prema stanju ostalih parametara
  if (props.ukupno > 0) {
    return (
      <div className="ispis-stat">
        <p>Pozitivno: 
          <strong> { ((props.dobra + props.neutralna) / props.ukupno).toFixed(2) * 100 }%</strong> 
        </p>
      </div>
    );
  }

  // u protivnom ispisuje poruku da nema rezultata za računanje
  else {
    return (
    <div className="ispis-stat">
      <p>Pozitivno: 
        <strong> Nema relevantnih podataka</strong>
      </p>
    </div>
    );
  }
};

const Ispis = (props) => {
  // ispis ocjena i postotka pozitivnih ocjena
  return (
    <div className="ispis-rezultati">

      <div className="ispis-ocjene">
        <Ocjena broj={props.dobra} 
                oznaka="Dobra" 
                stil="ocjena-dobra" />

        <Ocjena broj={props.neutralna} 
                oznaka="Neutralna" 
                stil="ocjena-neutralna" />

        <Ocjena broj={props.losa} 
                oznaka="Loša" 
                stil="ocjena-losa" />
      </div>

      <Statistika {...props} />
    </div>
  );
};

const App = () => {
  // postavljanje ocjena i ukupnog broja glasova
  const [ocjene, postaviOcjenu] = useState({dobra: 0, neutralna: 0, losa: 0, ukupno: 0});
  
  // postavljanje glasova za pojedinu ocjenu
  const ocjenaDobra = () => postaviOcjenu(
    {...ocjene, 
      dobra: ocjene.dobra + 1, 
      ukupno: ocjene.ukupno + 1 });

  const ocjenaNeutralna = () => postaviOcjenu(
    {...ocjene, 
      neutralna: ocjene.neutralna + 1, 
      ukupno: ocjene.ukupno + 1 });

  const ocjenaLosa = () => postaviOcjenu(
    {...ocjene, 
      losa: ocjene.losa + 1, 
      ukupno: ocjene.ukupno + 1 });
  
  // glavna struktura 
  return (
  <div className="container">
    <h1>Kvaliteta usluge</h1>
    <h2>Ocjenite našu kvalitetu usluge: </h2>

    <div className="tipke">
      {/* Parametar ikona sluzi za postavljanje 
      ispravne ikone na pripadajuci botun */}
      <Tipka klik={ocjenaDobra} 
             ikona="Smile" 
             stil="tipka-dobra" /> 

      <Tipka klik={ocjenaNeutralna} 
             ikona="Meh" 
             stil="tipka-neutralna" />

      <Tipka klik={ocjenaLosa} 
             ikona="Frown" 
             stil="tipka-losa" />
    </div>

    <Ispis {...ocjene} /> {/* Ovako se šalje potpuni objekt kao props */}
  </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));