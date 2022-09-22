
import './ListManagerPage.css';
import "gridjs/dist/theme/mermaid.css";

import {GridWrap, TestMessage} from "../Components/GridWrap"
import { Grid } from 'gridjs-react';
import React, { useEffect, useState } from "react"
import { API_getLists, API_insertNewList} from "../ApiCalls/apiCalls"
import { generateCountersRows, generateListsRows } from '../helper.js/helper';

const logo = require("../assets/logo.jpg")
function ListManagerPage() {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [listName, setListName] = useState();
  const [prName, setPrName] = useState();
  const [showGrid, setShowGrid] = useState(true);

  const columns = [
    {
      id: "NomeLista",
      name: "Lista"
    },
    {
      id: "PrLista",
      name: "Pr"
    },
    {
      id: "Visibile",
      name: "Visibile"
    },
    {
      id: "deleteButton",
      name: "Elimina"
    },
  ]




  // Waiting for the data fetch and generate Grid components
  const gridFetcher = async () => {
    return await generateListsRows(forceUpdate);
  }


  // Sendo to server a new List to insert in db
  const sendNewList = async () => {
    console.log(listName)
    await API_insertNewList(listName, prName)
    setShowGrid(true);
  }


  return (

    <div className="App">

      <div className="container">
        <div className="header">
          <img className="logo" src={logo} alt="logo" />
          <div className="title">
            <h1>Secret DB manager</h1>
          </div>
        </div>


        {
        showGrid ? 
          <>
            <GridWrap tableComponents={gridFetcher} columns={columns} /> 
            <button onClick={()=>setShowGrid(false)}>Inserisci nuovi dati</button>
          </>
          : 
          <>
            <div className="newData">
              <h3>Inserisci nuova lista</h3>
              <input type="text" placeholder='Nome della lista'  onChange={(e) => setListName(e.target.value)} value={listName}></input>
              <input type="text" placeholder='Pr di riferimento' onChange={(e) => setPrName(e.target.value)}></input>
              <button onClick={sendNewList}>Inserisci</button>
              <button onClick={()=>setShowGrid(true)}>Annulla</button>

            </div>
          </>
        }

    

        
      </div>

    </div>
  );
}



export default ListManagerPage;