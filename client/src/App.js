import { useState } from "react";
import EntriesCounterPage from "./Pages/EntriesCounterPage";
import ListManagerPage from "./Pages/ListsManagerPage.js";

function App(){


  const [editingPage, setEditingPage] = useState(false);
  return(

    <div>
      <button onClick={()=>setEditingPage(!editingPage)}>Cambia schermata</button>
      {editingPage ? <ListManagerPage/> : <EntriesCounterPage/>}
    </div>

  )
}

export default App;