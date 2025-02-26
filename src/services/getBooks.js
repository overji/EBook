import {myGetJson,getApiUrl} from "./common.js";

export async function getAllTags()
{
    let url = `${getApiUrl()}/book/tags`;
    let ans = [];
    try{
        ans = await myGetJson(url)
        console.log(ans);
    } catch (e) {
        console.error(e);
    }
    return ans;
}
export async function getBookWithId(id){
    let url = `${getApiUrl()}/book/${id}`
    let ans = {};
    try{
        ans = await myGetJson(url)
        console.log(ans);
    } catch (e) {
        console.error(e);
    }
    return ans;
}

export async function searchBooks(tag,keyword,pageIndex,pageSize)
{
    tag = encodeURIComponent(tag);
    keyword = encodeURIComponent(keyword)
    const url = `${getApiUrl()}/books?tag=${tag}&keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
    let books = {};
    try{
        books = await myGetJson(url);
    } catch (e) {
        console.error(e);
        books = {
            total:0,
            items:[]
        };
    }
    return books;
}