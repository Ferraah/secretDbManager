
import './EntriesCounterPage.css';
import "gridjs/dist/theme/mermaid.css";

import GridWrap from "../Components/GridWrap"
import { Grid } from 'gridjs-react';
import React, { useEffect, useState } from "react"
import { API_getLists } from "../ApiCalls/apiCalls"
import { generateRows } from '../helper.js/helper';

function ListManagerPage() {

  const { lists, setLists } = useState(new Promise(resolve => {
    API_getLists()
  }));

  const columns = [
    {
      id: "NomeLista",
      name: "Lista"
    },
    {
      id: "PrLista",
      name: "Pr"
    },
  ]


  useEffect(() => {
    const wrapper = async () => {
      let lists = await API_getLists();
    }

  }, [])

  return (
    <div className="App">
      <div className="container">
        <h1>Ciao</h1>
        <GridWrap componentiTabella={API_getLists} columns={columns} />
      </div>
    </div>
  )
}

export default ListManagerPage;