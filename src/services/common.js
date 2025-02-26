import config from '../config.js';

export async function myGetJson(url){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let res = await fetch(url,{
        method:"GET",
        credentials:"include"
    })
    return res.json();
}

export async function myGet(url){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return await fetch(url, {
        method: "GET",
        credentials: "include"
    });
}
export async function myPost(url,data){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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

export async function myPut(url,data)
{
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let res = await fetch(url,{
        method:"PUT",
        body:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials:"include"
    });
    return res.json();
}

export async function myDelete(url,data)
{
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let res = await fetch(url,{
        method:"DELETE",
        body:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials:"include"
    });
    return res.json();
}

export function getApiUrl(){
    return `${config.backEndUrl}/api`
}