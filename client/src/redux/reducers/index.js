import { updateReducer, listeReducer } from "./reducers";
import { combineReducers } from "redux";


export const rootReducer = combineReducers({
    updateReducer: updateReducer,
    listeReducer: listeReducer
});