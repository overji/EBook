import {myGetJson, getApiUrl, myDelete, myPost} from "./common.js";

export async function getAllTags()
{
    let url = `${getApiUrl()}/book/tags`;
    let ans = [];
    try{
        ans = await myGetJson(url)
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
    } catch (e) {
        console.error(e);
    }
    return ans;
}

export async function deleteCoverWithURL(url){
    url = `${url}/del`
    let ans = {};
    try{
        ans = await myDelete(url);
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

export async function addBook(title,author,description,price,cover,tags,isbn,stock){
    const url = `${getApiUrl()}/book/insert`;
    let res = {};
    try{
        res = await myPost(url,{
            "title":title,
            "author":author,
            "description":description,
            "price":price,
            "cover":cover,
            "tags":tags,
            "ISBN":isbn,
            "stock":stock
        });
    } catch (e) {
        return {};
    }
    return res;
}

export async function updateBook(id,title,author,description,price,cover,tags,isbn,stock){
    const url = `${getApiUrl()}/book/modify/${id}`;
    let res = {};
    try{
        res = await myPost(url,{
            "title":title,
            "author":author,
            "description":description,
            "price":price,
            "cover":cover,
            "tags":tags,
            "ISBN":isbn,
            "stock":stock
        });
    } catch (e) {
        return {};
    }
    return res;
}

export async function deleteBook(id){
    const url = `${getApiUrl()}/book/${id}`;
    let res = {};
    try{
        res = await myDelete(url);
    } catch (e) {
        return {};
    }
    return res;
}