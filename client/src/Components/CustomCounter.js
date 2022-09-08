
import {useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findById } from '../helper.js/helper';
import { updateDatiTabella } from '../redux/actions';

export default function CustomCounter({idLista, sesso, ingressi, valoreIniziale, onChange}){

  const [value, setValue] = useState(valoreIniziale);
  
  const dispatch = useDispatch();
  

  const modificaContatore = ((idLista, sesso, nuovoValore) => {
    
    //console.log(ingressi);
    const id = findById(ingressi, idLista);
    console.log(id);
    
    var tmp = [...ingressi];
    tmp[id][sesso] = nuovoValore;
    //console.log(tmp);
    dispatch(updateDatiTabella(tmp));
    
    

    
  });

  const increment = () =>{
    setValue(value+1);
    modificaContatore(idLista, sesso, value+1);
  }

  const decrement = () =>{
    setValue(value-1);
    modificaContatore(idLista, sesso, value-1);    
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