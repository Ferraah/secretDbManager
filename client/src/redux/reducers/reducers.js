


export const updateReducer = (state = null, action)=>{
    switch(action.type){
        case "UPDATE":
            return action.payload;

        default: 
            return state;
    }
}

export const listeReducer = (state = null, action)=>{
    switch(action.type){
        case "SETLISTE":
            return action.payload;
        
        default: 
            return state;
    }
}