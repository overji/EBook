import {getApiUrl,myPost,myDelete,myGetJson,myPut} from "./common";

export async function getBookComments(bookId,pageIndex,pageSize,sort)
{
    let url = `${getApiUrl()}/book/${bookId}/comments?pageIndex=${pageIndex}&pageSize=${pageSize}&sort=${sort}`;
    try{
        return myGetJson(url);
    } catch (e){
        throw e;
    }
}

export async function addBookComment(bookId,content)
{
    let url = `${getApiUrl()}/book/${bookId}/comments`;
    try{
        return myPost(url,{
            content:content
        })
    } catch (e){
        throw e;
    }
}

export async function unlikeComment(commentId)
{
    let url = `${getApiUrl()}/comment/${commentId}/unlike`;
    try{
        return myPut(url);
    } catch (e) {
        throw e;
    }
}

export async function likeComment(commentId)
{
    let url = `${getApiUrl()}/comment/${commentId}/like`;
    try{
        return myPut(url);
    } catch (e) {
        throw e;
    }
}

export async function replyComment(commentId,content)
{
    let url = `${getApiUrl()}/comment/${commentId}`;
    try{
        return myPost(url,{
            content:content
        })
    } catch (e){
        throw e;
    }
}