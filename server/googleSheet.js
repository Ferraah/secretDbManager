const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
});




async function sheetsRead(){
    //Auth client Object
    const authClientObject = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    const spreadsheetId = "1N9ta1K8nBWWzg0oNMrwjs8-Si8twvLEGuwz_A8F7gvM";

    //Read front the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: "Foglio1!A:A", //range of cells to read from.
    })

    console.log(readData.data);
}

module.exports = {sheetsRead};