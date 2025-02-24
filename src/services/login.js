
import {myPost,getApiUrl} from "./common.js";


export async function login(username, userPassword) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const urlPath = `${getApiUrl()}/login`;
    const loginObject = {
        username: username,
        password: userPassword
    };
    try {
        const response = await myPost(urlPath,loginObject);
        console.log(`用户${username}，${response.message}`);
        if(response.ok){
            sessionStorage.setItem("user",username);
            return true;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
}

export function isUserLoggedIn()
{
    const curUser = sessionStorage.getItem("user");
    return (curUser !== null)
}
