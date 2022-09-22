
import {useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findById } from '../helper.js/helper';
import { updateDatiTabella } from '../redux/actions';
import { API_uploadOnGoogleSheets, API_updateSessionData } from '../ApiCalls/apiCalls';
export default function CustomCounter({index, sesso, ingressi, valoreIniziale, currentSession}){

  const [value, setValue] = useState(valoreIniziale);
  const [intervalId, setIntervalId] = useState();
  const dispatch = useDispatch();
  

  const intervalHandler = (nuovoValore) => {

    var tmp = [...ingressi];
    tmp[index][sesso] = nuovoValore;
    dispatch(updateDatiTabella(tmp));

    //SEND DATA TO API
    API_updateSessionData(currentSession, tmp);
    API_uploadOnGoogleSheets(currentSession)

  }

  const modificaContatore = ((index, sesso, nuovoValore) => {
    

    // Sending new data only after last click
    if(intervalId)
      clearTimeout(intervalId);

    var id = setTimeout(() => intervalHandler(nuovoValore), 1000);
    setIntervalId(id);






    
  });

  const increment = () =>{
    setValue(value+1);
    modificaContatore(index, sesso, value+1);
  }

  const decrement = () =>{
    setValue(value-1);
    modificaContatore(index, sesso, value-1);    
  }

  return (
    <div>
      <button onClick={decrement}>-</button>
      <label>{value}</label>
      <button onClick={increment}>+</button>
    </div>
  )
  ;
}