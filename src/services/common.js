import config from '../config.js';
export async function myPost(url,data){
    const response = await fetch(url,{
        method:"POST",
        body:JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        },
        credentials:"include"
    });
    return response.json();
}

export function getApiUrl(){
    return `${config.backEndUrl}/api`
}