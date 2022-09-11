const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
});


const spreadsheetId = "1N9ta1K8nBWWzg0oNMrwjs8-Si8twvLEGuwz_A8F7gvM";




async function sheetsRead(){
    

    //Auth client Object
    const authClientObject = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    //Read front the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: "Foglio1!A:A", //range of cells to read from.
    })

    //console.log(readData.data);
}


async function create(title) {

  
      //Auth client Object
    const authClientObject = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
    const resource = {
      properties: {
        title,
      },
    };

    try {
      const spreadsheet = await googleSheetsInstance.spreadsheets.create({
        resource,
        fields: 'spreadsheetId',
      });
      //console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
      return spreadsheet.data.spreadsheetId;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
}

async function writeData(sheetName, data){

  const authClientObject = await auth.getClient();

  const service = google.sheets({ version: "v4", auth: authClientObject });

  try {
    
    const result = await service.spreadsheets.values.update({
      spreadsheetId,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: data
      },
    });
    console.log(result.data)


  } catch (err) {
    console.log(err)
    // TODO (developer) - Handle exception
  }

}

async function addSheet(title){
  const authClientObject = await auth.getClient();

  const service = google.sheets({ version: "v4", auth: authClientObject });

  try {
    
    const result = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      auth: authClientObject,
      resource: {
        requests: [
          {
              'addSheet':{
                  'properties':{
                      'title': title
                  }
              } 
          }
      ],
      }  
    });

  

  } catch (err) {
    // TODO (developer) - Handle exception
  }
}
/*

{
  "sheetId": integer,
  "title": "Test",
  "sheetType": enum (SheetType),
  "gridProperties": {
    object (GridProperties)
  },

}
*/


module.exports = {sheetsRead, create, addSheet, writeData};