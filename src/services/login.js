
import {myPost, getApiUrl, myPut} from "./common.js";


export async function login(username, userPassword) {
    const urlPath = `${getApiUrl()}/login`;
    const loginObject = {
        username: username,
        password: userPassword
    };
    try {
        await myPost(urlPath,loginObject);
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export async function logout(){
    const urlPath = `${getApiUrl()}/logout`;
    try {
        await myPut(urlPath);
    } catch (e) {
        console.error(e);
    }
    return false;
}
