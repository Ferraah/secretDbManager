import { createAction } from '@reduxjs/toolkit'

export const updateDatiTabella = createAction("UPDATE", function prepare(dati) {
    return {
        payload: dati
    }
})

export const setListe = createAction("SETLISTE", function prepare(dati) {
    return {
        payload: dati
    }
})