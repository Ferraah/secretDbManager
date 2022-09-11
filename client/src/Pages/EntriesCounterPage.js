import './EntriesCounterPage.css';
import "gridjs/dist/theme/mermaid.css";
import "react-datepicker/dist/react-datepicker.css";

import { Grid, _ } from "gridjs-react";
import { useEffect, useState } from 'react';
import { generateRows, getFormattedDate } from '../helper.js/helper';
import { rootReducer } from '../redux/reducers';
import { createStore } from "redux";
import { useSelector, useDispatch } from 'react-redux';
import { updateDatiTabella } from '../redux/actions';
import { CHIUSO, APERTO, logoLink, NON_ESISTE } from "../costants";
import { API_getSession, API_getSessionData, API_setSessionStatus, API_updateSessionData, API_uploadOnGoogleSheets } from '../ApiCalls/apiCalls';
import { useInterval } from '../helper.js/helper';
import WebFont from 'webfontloader';
import DatePicker from "react-datepicker";
import GridWrap from "../Components/GridWrap"

const logo = require('../assets/logo.jpg')

const store = createStore(rootReducer);


function EntriesCounterPage() {

  const [formattedDate, setFormattedDate] = useState(getFormattedDate(new Date()));
  const [date, setDate] = useState(new Date());
  const [currentSession, setCurrentSession] = useState();
  const [firstFetchCompleted, setFirstFetchCompleted] = useState(false);
  const [status, setStatus] = useState(APERTO);

  //const [ingressi, setIngressi] = useState();
  const ingressi = useSelector(state => state.updateReducer);
  const dispatch = useDispatch();



  const wrap = async() =>{
    setFirstFetchCompleted(false);
    const session = await API_getSession(formattedDate);
    const rawData = await fetchRawData(session);
    console.log(rawData);


    // STATES UPDATES
    dispatch(updateDatiTabella(rawData));
    //setIngressi(rawData);
    setFirstFetchCompleted(true);
    setCurrentSession(session);
  }

  useEffect(() => {
    
    // FONT
    WebFont.load({
      google: {
        families: ['DM Sans', 'sans-serif']
      }
    });



    wrap();


  }, []);

  useEffect(()=>{
    wrap();
    
  }, [formattedDate])

  const fetchRawData = async (session) => {
    
    
    const rawData = await API_getSessionData(session);
    return rawData;
  }


  // SECOND FETCH FOR GRIDWRAPPER
  const fetchTableComponents = async ()=>{

    const session = await API_getSession(formattedDate);
    const rawData = await fetchRawData(session);
    const tableComponents = generateRows(rawData, store, currentSession);
    return tableComponents;

    
  }







  const startSession = async () => {

    await API_setSessionStatus(currentSession, APERTO);
    wrap();
    setStatus(APERTO);


  }

  const closeSession = () => {
    //sendData();
    API_setSessionStatus(currentSession, CHIUSO)
    setStatus(CHIUSO);
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
            <h1>Secret DB manager</h1>
          </div>
        </div>


        {firstFetchCompleted && status === APERTO ? <GridWrap tableComponents={fetchTableComponents} columns={columns}/>: <></>}
        {status === CHIUSO ? SessioneChiusaTesto: <></>}
        {firstFetchCompleted ? DatePickerWrap : <h1>Caricamento...</h1> }
        
        <button onClick={startSession}>Inizia Sessione</button>
        <button onClick={closeSession}>Chiudi Sessione</button>

      </div>

    </div>
  );

}



export default EntriesCounterPage;
