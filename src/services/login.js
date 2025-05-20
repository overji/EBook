import {getApiUrl, myPost, myPut} from "./common.js";


export async function login(username, userPassword) {
    const urlPath = `${getApiUrl()}/login`;
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
