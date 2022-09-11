import Axios from 'axios'
const serverLink = 'http://localhost:3001';

// Set to open or close the session identified by a certain date
export async function API_setSessionStatus(session, status){
    Axios.post(serverLink+'/setSessionStatus', {session: session, status: status});
}

// Set to open or close the session identified by a certain date
export async function API_test(data){
    Axios.post(serverLink+'/test', data);
}


// Set to open or close the session identified by a certain date
export async function API_getSession(date){
    //console.log(date);
    
    let tmp = await Axios.post(serverLink+'/getSession', {date: date});
    return tmp.data;
    //console.log(tmp)
}


export async function API_uploadOnGoogleSheets(session){
    //console.log(date);
    
    let tmp = await Axios.post(serverLink+'/uploadOnGoogleSheets', {session: session});
    //console.log(tmp)
}

// Get every list object
export async function API_getLists(){
    let res = await Axios.get(serverLink+'/getLists');
    return res.data;
}

// Get every list object
export async function API_getSessionData(session){
    let res = await Axios.post(serverLink+'/getSessionData', session);
    return res.data;

}

// Update the current session data
export async function API_updateSessionData(session, newData){
    Axios.put(serverLink+'/updateSessionData', {session: session, data: newData}).then( (res) => {
    });
}