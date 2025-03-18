import {getApiUrl,myGetJson,myPut,myDelete} from "./common";

export async function getCart()
{
    let url = getApiUrl() + '/cart';
    let res;
    try{
        res = await myGetJson(url);
        return res;
    } catch (e) {
        console.log(e);
    }
}

export async function addToCart(bookId)
{
    let url = getApiUrl() + '/cart';
    let res;
    try{
        res = await myPut(url, {
            bookId: bookId
        });
        return res;
    } catch (e) {
        console.log(e);
    }
}

export async function changeCart(id, number)
{
    let url = getApiUrl() + `/cart/${id}?number=${number}`;
    let res;
    try{
        res = await myPut(url);
        return res;
    } catch (e) {
        console.log(e);
    }
}

export async function deleteFromCart(id)
{
    let url = getApiUrl() + `/cart/${id}`;
    let res;
    try{
        res = await myDelete(url);
        return res;
    } catch (e) {
        console.log(e);
    }
}