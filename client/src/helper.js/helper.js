import React, { useEffect, useRef } from 'react';
import CustomCounter from "../Components/CustomCounter";
import { Provider } from "react-redux";
import { _ } from "gridjs-react";

import {UOMO, DONNA} from '../costants';



export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Trova l'indice dei dati associati agli ingressi e alla lista
export function findById(source, id) {
    for (var i = 0; i < source.length; i++) {
      if (source[i]['idLista'] === id) {
        return i;
      }
    }
    throw "Couldn't find object with id: " + id;
  }

export function getFormattedDate(date){

  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  var formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
  
}

// OTTIMIZZARE
export function generateRows(liste, ingressi, store, onChange){

  var rows = [];
  liste.forEach(lista => {
      // Trova l'indice dei dati associati agli ingressi e alla lista
      let index = findById(ingressi, lista.idLista);

      rows.push(
        {
          idLista: lista.idLista,
          nomeLista: lista.NomeLista, 
          prLista: lista.PrLista, 
          uominiCounter: _(<Provider store={store}><CustomCounter valoreIniziale={ingressi[index].uomini} ingressi={ingressi} idLista={index} sesso={UOMO} onChange={onChange} /></Provider>),
          donneCounter: _(<Provider store={store}><CustomCounter valoreIniziale={ingressi[index].donne} ingressi={ingressi} idLista={index} sesso={DONNA} onChange={onChange}/></Provider>)
        }
  
      )


  });

  return rows;
}

export function generateTestRows(max, store, ingressi){

  var rows = [];
  for (let index = 0; index < max; index++) {
    
    rows.push(
      {
        idLista: index,
        nomeLista: makeid(4), 
        prLista: makeid(4), 
        uominiCounter: _(<Provider store={store}><CustomCounter ingressi={ingressi} idLista={index} sesso={UOMO} /></Provider>),
        donneCounter: _(<Provider store={store}><CustomCounter ingressi={ingressi} idLista={index} sesso={DONNA} /></Provider>)}

    )
    
  }

  return rows;
}

export function generateTestIngressi(max){

  var rows = [];
  for (let index = 0; index < max; index++) {
    
    rows.push(
      {
        idLista: index,
        uomini: 0,
        donne: 0
      }

    )
    
  }

  return rows;
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
  return result;
}