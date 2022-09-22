
const express = require('express');
const app = express();
//const mysql = require('mysql');
const cors = require('cors');
var syncSql = require('sync-sql');
const { generateTestIngressi, convertEntriesToClientFormat, convertEntriesToSheetsFormat } = require('./helper');
const {GS_sheetsRead, GS_create, GS_addSheet, GS_writeData} = require("./googleSheet");
const { query } = require('express');


app.use(cors());
app.use(express.json());

const connection = {
    user:'daniele',
    host: 'localhost',
    password: 'daniele',
    database: 'secretroomDb'
}


function print(text){
    console.log("+++ "+text+" +++");
}


function getSessionId(date, next){
    
    const res = syncSql.mysql(connection, `SELECT * FROM Sessioni WHERE Data = '${date}';`);
    if(res.data.rows.length != 0){
        return res.data.rows[0].idSessione
    }
    else
        return -1;

}

function getLists(){
    let res =  syncSql.mysql(connection, "SELECT * FROM Liste ");
    if(res.success){
        return res.data.rows;
    }
    else{
        return [];
    }
}

// Depercated
function retrieveSessionDataOld(idSession){
    let tmp = syncSql.mysql(connection, `SELECT * FROM Ingressi WHERE (fk_idSessione = ${idSession})`).data.rows;
    return tmp;
}

function retrieveSessionData(idSession){
    // Retrieve visible data
    let tmp = syncSql.mysql(connection, `SELECT idLista, NomeLista, PrLista, Uomini, Donne FROM Ingressi JOIN Liste ON Liste.idLista = fk_idLista AND Liste.Visibile = 1 WHERE (fk_idSessione = ${idSession})`).data.rows;
    return tmp;
}

function initializeData(sessionId){
    const entries = generateTestIngressi(getLists());

    entries.forEach(entry => {
        const query = `INSERT INTO Ingressi (Uomini, Donne, fk_idSessione, fk_idLista) VALUES ('${entry.uomini}', '${entry.uomini}', '${sessionId}', '${entry.idLista}')`;
        let res = syncSql.mysql(connection,query);
        //console.log(res);
    });
}

app.post('/getSession', async  (req, res) => {

    const date = req.body.date;
    const id = getSessionId(date);
    console.log(id);
    res.send({
        idSession: id,
        date: date
    })

});

app.post('/deleteList', async  (req, res) => {


    console.log(req.body);

    if(req.body.idList === undefined){
        res.send({
            success: 0,
            message: "Request body is empty"
        })
        return;
    }


    const idList = req.body.idList;
    const query = `UPDATE Liste SET Visibile = 0 WHERE (idLista = ${idList});`;
    let queryStatus = syncSql.mysql(connection,query);

    if(queryStatus.success){
        res.status(200).json({
            success: 1, 
            message: "Lists Updated"
        })
        return;
    }else{
        res.status(500).json({
            success: 0, 
            message: "Error, lists not updated"
        })
        return;
    }
});

app.post('/insertNewList', async  (req, res) => {


    console.log(req.body);

    if(req.body.listName === undefined || req.body.prName  === undefined){
        res.send({
            success: 0,
            message: "Request body is not correct"
        })
        return;
    }


    const listName = req.body.listName;
    const prName = req.body.prName;

    const query = `INSERT INTO Liste (NomeLista, PrLista, Visibile) VALUES ('${listName}', '${prName}', 1)`
    let queryStatus = syncSql.mysql(connection,query);
    console.log(queryStatus);
    if(queryStatus.success){
        res.status(200).json({
            success: 1, 
            message: "Lists Updated"
        })
        return;
    }else{
        res.status(500).json({
            success: 0, 
            message: "Error, lists not updated"
        })
        return;
    }
});



app.post('/getSessionData', async  (req, res) => {
    let idSession = req.body.idSession; 
    let tmp = retrieveSessionData(idSession);
    //TODO: DATA DINAMICA
    //writeData("2022-09-11", convertEntriesToSheetsFormat(tmp));
    res.send(tmp);

});

app.post('/uploadOnGoogleSheets', async  (req, res) => {

    if(!req.body.session){
        res.send({
            success: 0,
            message: "Request body is empty"
        })


        return;
    }
    
    let idSession = req.body.session.idSession; 
    let date = req.body.session.date;
    let tmp = retrieveSessionData(idSession);

    GS_addSheet(date);
    
    GS_writeData(date, convertEntriesToSheetsFormat(tmp));
    res.send(tmp);

});

app.post('/setSessionStatus', async (req, res) => {

    if(!req.body.session){
        res.send({
            success: 0,
            message: "Request body is empty"
        })


        return;
    }


    const date = req.body.session.date.replaceAll('/', '-');
    const status = req.body.status;
    
    let sessionId = getSessionId(date);
    var queryStatus;

    if(sessionId != -1){
        queryStatus = syncSql.mysql(connection, `UPDATE Sessioni SET Chiusa = ${status} WHERE (idSessione = '${sessionId}');`);
        if(queryStatus.success){
            console.log("+++ "+date +" SESSION HAS CHANGED STATUS TO "+status+ " +++");
            res.status(200).json({
                success: 1, 
                message: "Session updated"
            })

            return;
        }

    }else{
        queryStatus = syncSql.mysql(connection, `INSERT INTO Sessioni (Data, Chiusa) VALUES ('${date}', '0')`);
        if(queryStatus.success){
            sessionId = getSessionId(date);
            initializeData(sessionId);
            
            // Sheets Api
            GS_addSheet(date);
            console.log("+++ "+"DATA INITIALIZED FOR NEW SESSION: "+date+ " +++");
            res.send({
                success: 1,
                message: "Data updated"
            })
            return;
        }
    }
    
    res.send({
        success: 0,
        message: "Data query failed"
    })

    /*

    */
})


app.put('/updateSessionData', function (req, res) {

    if(!req.body){
        res.send({
            success: 0,
            message: "Request body is empty"
        })

        return;
    }
    const date = req.body.session.date.replaceAll('/', '-');
    const newData = req.body.data;
    const idSessione = getSessionId(date);
    //console.log(newData)

    if(idSessione!= -1){
        newData.forEach(entry => {
            syncSql.mysql(connection, `UPDATE Ingressi SET Uomini = ${entry.Uomini} WHERE (fk_idLista = ${entry.idLista} AND fk_idSessione = ${idSessione})`);
            syncSql.mysql(connection, `UPDATE Ingressi SET Donne = ${entry.Donne} WHERE (fk_idLista = ${entry.idLista} AND fk_idSessione = ${idSessione})`);
    
        });

        res.send({
            success: 1,
            message: "Data updated"
        })

        print("DATA UPDATED FOR "+date);
    }
    else{
        print("ATTEMPTED TO UPDATE NON-EXISTING DATA FOR SESSION "+JSON.stringify(date));
        res.send({
            success: 0,
            message: "Attempted to update data for a non-existing session"
        })
    }

});

app.put('/resetSession', function (req, res) {

    if(!req.body){
        res.send({
            success: 0,
            message: "Request body is empty"
        })

        return;
    }

    const date = req.body.session.date.replaceAll('/', '-');
    const idSessione = getSessionId(date);

    if(idSessione!= -1){

        // Deleting data and starting a new session
        var queryStr = `DELETE FROM Ingressi WHERE fk_idSessione=${idSessione};`
        var queryRes = syncSql.mysql(connection, queryStr);
        console.log(queryRes.success)

        queryStr= `DELETE FROM Sessioni WHERE idSessione=${idSessione};`;
        queryRes = syncSql.mysql(connection, queryStr);
        console.log(queryRes.success)

        queryStr= `INSERT INTO Sessioni (Data, Chiusa) VALUES ('${date}', '0');`;
        queryRes = syncSql.mysql(connection, queryStr);
        console.log(queryRes.success)

        
        // Initializing data
        const newIdSessione = getSessionId(date);
        initializeData(newIdSessione);

        res.send({
            success: 1,
            message: "Session reset"
        })

        print("SESSION RESET "+date);
    }
    else{
        print("ATTEMPTED TO RESET NON-EXISTING SESSION "+JSON.stringify(date));
        res.send({
            success: 0,
            message: "Attempted to update data for a non-existing session"
        })
    }

});

app.get('/getLists', function (req, res) {

    res.send(getLists());
});


app.listen(3001, ()=>{
    console.log("Connesso");
})


// Testing google sheets api
//sheetsRead();
//writeData("2022-09-11", {});