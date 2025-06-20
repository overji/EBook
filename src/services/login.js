import {getApiUrl, myPost, myPut} from "./common.js";
import sha256 from "crypto-js/sha256";

export async function login(username, userPassword) {
    const urlPath = `${getApiUrl()}/login`;
    userPassword = sha256(userPassword).toString();
    const loginObject = {
        username: username,
        password: userPassword
    };
    try {
        return await myPost(urlPath, loginObject)
    } catch (e) {
        console.error(e);
    }
    return undefined;
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
