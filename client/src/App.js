import './App.css';
import "gridjs/dist/theme/mermaid.css";
import "react-datepicker/dist/react-datepicker.css";

import { Grid, _ } from "gridjs-react";
import { useEffect, useState } from 'react';
import { generateRows, getFormattedDate } from './helper.js/helper';
import { rootReducer } from './redux/reducers';
import { createStore } from "redux";
import { useSelector, useDispatch } from 'react-redux';
import { updateDatiTabella } from './redux/actions';
import {CHIUSO, APERTO, logoLink, NON_ESISTE} from "./costants";
import { API_getLists, API_getSession, API_getSessionData, API_setSessionStatus, API_updateSessionData } from './ApiCalls/apiCalls';
import { useInterval } from './helper.js/helper';
import WebFont from 'webfontloader';
import DatePicker from "react-datepicker";

const store = createStore(rootReducer);



function GridWrap({ componentiTabella, columns }) {


  return (
    (
      <div>
      <Grid
        data={componentiTabella}
        columns={columns}
        search={true}
        pagination={{
          enabled: false,
          limit: 10,
        }}
        style={
          {
            table: {
              width: "100%"
            }
          }
        }
      />
      </div>

    )
  )
}




function App() {

  const [startDate, setStartDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(new Date());
  const [sessioneCorrente, setSessioneCorrente] = useState();
  const [statoSessione, setStatoSessione] = useState(APERTO);
  const [componentiTabella, setComponentiTabella] = useState();
  const [loading, setLoading] = useState(false);
  // Redux
  const ingressi = useSelector(state => state.updateReducer);
  const dispatch = useDispatch();



  useInterval(() => {
    if(statoSessione === APERTO && componentiTabella){
      sendData();
    }
  }, 1000);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['DM Sans', 'sans-serif']
      }
    });
   }, []);

  const fetchDatiSessione = async (session) => {


    // SE ESISTE SESSIONE
    if(session.idSession !== -1){
      let lists = await API_getLists();
      let data = await API_getSessionData(session);
      dispatch(updateDatiTabella(data));
      setComponentiTabella(generateRows(lists, data, store, sendData));
      setStatoSessione(APERTO);

    }else{
      setStatoSessione(NON_ESISTE);
    }
    

  }

  const fetchSessione = async (formattedDate) =>{
    // IMPOSTAZIONE SESSIONE DI OGGI
    let session = await API_getSession(formattedDate);
    setSessioneCorrente(session);
    return session;

  }

  const wrapper = async (formattedDate) =>{
    setLoading(true)
    let session = await fetchSessione(formattedDate);
    await fetchDatiSessione(session);
    setLoading(false);


  }

  useEffect(() => {

    // IMPOSTAZIONE DATA
    const formattedDate = getFormattedDate(startDate);
    setFormattedDate(formattedDate);
    

    wrapper(formattedDate);

    

    

  }, [startDate])




  const startSession = async() => {
    setLoading(true)

    API_setSessionStatus(sessioneCorrente, APERTO);
    let session = await fetchSessione(formattedDate);
    fetchDatiSessione(session);
    setStatoSessione(APERTO);

    setLoading(false)


  }

  const closeSession = () => {
    sendData();
    API_setSessionStatus(sessioneCorrente, CHIUSO)
    setStatoSessione(CHIUSO);
  }


  const sendData = () =>{
    API_updateSessionData(sessioneCorrente, ingressi);
    //console.log(sessioneCorrente);
  }

  const columns = [
    {
      id: "nomeLista",
      name: "Lista"
    },
    {
      id: "prLista",
      name: "Pr"
    },
    {
      id: "uominiCounter",
      name: "Uomini",
    },
    {
      id: "donneCounter",
      name: "Donne"
    },
  ]


    const sessioneChiusaTesto = (
      <div>
        <h1>La sessione è stata chiusa</h1>
      </div>
    )

    return (
      
      <div className="App">

        <div className="container">
          <div className="header">
              <img className="logo" src={logoLink} alt="logo"/>
            <div className="title">
              <h1>Secret DB manager</h1>
            </div>
          </div>
          {
            statoSessione === NON_ESISTE ? <h1>Questa sessione non è ancora stata inizializzata</h1> : <></>
          }

          { !loading  && statoSessione === APERTO ? 
            <GridWrap className="grid" componentiTabella={componentiTabella} columns={columns} ingressi={ingressi} />
            :
            <></>
          }

          {
            statoSessione === CHIUSO ? sessioneChiusaTesto : <></>
          }


          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />          
          <button onClick={startSession}>Inizia Sessione</button>
          <button onClick={closeSession}>Chiudi Sessione</button>
          <button onClick={sendData}>Invia Dati</button>

        </div>

      </div>
    );

}



export default App;
