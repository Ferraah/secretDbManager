import './EntriesCounterPage.css';
import "gridjs/dist/theme/mermaid.css";
import "react-datepicker/dist/react-datepicker.css";

import { Grid, _ } from "gridjs-react";
import { useEffect, useState } from 'react';
import { generateCountersRows, getFormattedDate } from '../helper.js/helper';
import { rootReducer } from '../redux/reducers';
import { createStore } from "redux";
import { useSelector, useDispatch } from 'react-redux';
import { updateDatiTabella } from '../redux/actions';
import { CHIUSO, APERTO, logoLink, NON_ESISTE } from "../costants";
import { API_getSession, API_getSessionData, API_resetSession, API_setSessionStatus, API_updateSessionData, API_uploadOnGoogleSheets } from '../ApiCalls/apiCalls';
import { useInterval } from '../helper.js/helper';
import WebFont from 'webfontloader';
import DatePicker from "react-datepicker";
import {GridWrap} from "../Components/GridWrap"

const logo = require('../assets/logo.jpg')

const store = createStore(rootReducer);


function EntriesCounterPage() {

  const [formattedDate, setFormattedDate] = useState(getFormattedDate(new Date())); // Formatted date for backend
  const [date, setDate] = useState(new Date()); // Date
  const [currentSession, setCurrentSession] = useState(); // Current daily session
  const [fetchCompleted, setFetchCompleted] = useState(false); // To set loading state text
  const [status, setStatus] = useState(APERTO); // Open or closed session placeholder

  const dispatch = useDispatch();




  const wrap = async() =>{
    // Set loading state
    setFetchCompleted(false);

    // Wait for the session object given the formattedDate
    const session = await API_getSession(formattedDate);
    // Raw data object from back-end
    const rawData = await fetchRawData(session);


    // STATES UPDATES ------------------
    // Redux dispatch of raw data (TODO: check utility)
    dispatch(updateDatiTabella(rawData));
    setFetchCompleted(true);
    setCurrentSession(session);
  }

  
  // Initial procedure
  useEffect(() => {
    
    // Downloading fonts
    WebFont.load({
      google: {
        families: ['DM Sans', 'sans-serif']
      }
    });


    // Fetch data and more for the first time. Warning: Data grid will
    // be dowloading them a second time
    wrap();


  }, []);

  // Fetch data again when the date is changed by the user
  useEffect(()=>{
    wrap();
    
  }, [formattedDate])


  const fetchRawData = async (session) => {
    const rawData = await API_getSessionData(session);
    return rawData;
  }


  // SECOND fetch for the Grid
  const fetchTableComponents = async ()=>{

    const session = await API_getSession(formattedDate);
    const rawData = await fetchRawData(session);
    const tableComponents = generateCountersRows(rawData, store, currentSession);
    return tableComponents;

    
  }

  // Start a new session on server
  const startSession = async () => {

    await API_setSessionStatus(currentSession, APERTO);
    wrap();
    setStatus(APERTO);


  }

  // Close the session
  const closeSession = () => {
    //sendData();
    API_setSessionStatus(currentSession, CHIUSO)
    setStatus(CHIUSO);
  }

  // Delete current session and create another one
  const resetSession = async () => {
    setFetchCompleted(false);
    await API_resetSession(currentSession);
    startSession();
  }

  /*
  const sendData = (rawData) => {
    console.log("IMGRESSI MANDATI")
    console.log(rawData)
    API_updateSessionData(currentSession, rawData);
    //API_uploadOnGoogleSheets(currentSession)
    //console.log(sessioneCorrente);
  }
  */

  
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
      id: "uominiCounter",
      name: "Uomini",
    },
    {
      id: "donneCounter",
      name: "Donne"
    },
  ]


  const SessioneChiusaTesto = (
    <div>
      <h1>La sessione è stata chiusa</h1>
    </div>
  )

  const DatePickerWrap = (
    <div>
      <DatePicker selected={date} onChange={(date) => {
        setFormattedDate(getFormattedDate(date))
        setDate(date);
      }}/>
    </div>
  )

  return (

    <div className="App">

      <div className="container">
        <div className="header">
          <img className="logo" src={logo} alt="logo" />
          <div className="title">
            <h1>Secret DB manager alpha 1 </h1>
          </div>
        </div>


        {fetchCompleted && status === APERTO ? <GridWrap tableComponents={fetchTableComponents} columns={columns}/>: <></>}
        {status === CHIUSO ? SessioneChiusaTesto: <></>}
        {fetchCompleted ? DatePickerWrap : <h1>Caricamento...</h1> }
        
        <button onClick={startSession}>Inizia Sessione</button>
        <button onClick={closeSession}>Chiudi Sessione</button>
        <button onClick={resetSession}>Resetta Sessione</button>

      </div>

    </div>
  );

}



export default EntriesCounterPage;
