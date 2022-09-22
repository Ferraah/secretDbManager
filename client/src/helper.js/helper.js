import React, { useEffect, useRef } from 'react';
import CustomCounter from "../Components/CustomCounter";
import { Provider } from "react-redux";
import { _ } from "gridjs-react";

import {UOMO, DONNA} from '../costants';
import { API_getLists, API_deleteList } from '../ApiCalls/apiCalls';



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


export function getFormattedDate(date){

  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  var formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
  
}

export function generateCountersRows(data, store, currentSession){

  var rows = [];
  var index = 0;
  data.forEach(lista => {

      rows.push(
        {
          idLista: lista.idLista,
          NomeLista: lista.NomeLista, 
          PrLista: lista.PrLista, 
          uominiCounter: _(<Provider store={store}><CustomCounter currentSession={currentSession} index={index} valoreIniziale={lista.Uomini} ingressi={data} sesso={UOMO}  /></Provider>),
          donneCounter: _(<Provider store={store}><CustomCounter currentSession={currentSession} index={index} valoreIniziale={lista.Donne} ingressi={data}  sesso={DONNA} /></Provider>)
        }
  
      )
      
      index+=1;

  });

  return rows;
}

// 
export async function generateListsRows(forceUpdate){

  // Fetching every list
  const data = await API_getLists();

  var rows = [];
  var index = 0;

  // Make a row components for each of the lists.
  data.forEach(lista => {

      rows.push(
        {
          idLista: lista.idLista,
          NomeLista: lista.NomeLista, 
          PrLista: lista.PrLista,
          Visibile: lista.Visibile ? "Sì" : "No", 
          deleteButton: _(<button onClick={async () => {

            await API_deleteList(lista.idLista);
            forceUpdate();
            
          }}>Elimina</button>)
        }
  
      )
      
      index+=1;

  });

  return rows;
}

