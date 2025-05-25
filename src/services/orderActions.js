import {getApiUrl, myGetJson, myPost} from "./common";

export async function getOrder()
{
    let url = getApiUrl() + '/order';
    try{
        return await myGetJson(url);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function addOrder(orderInfo)
{
    let url = getApiUrl() + '/order';
    try{
        return await myPost(url, orderInfo);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function addOneOrder(orderInfo,bookId,number)
{
    let url = getApiUrl() + `/order/${bookId}?number=${number}`;
    try{
        return await myPost(url, orderInfo);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}