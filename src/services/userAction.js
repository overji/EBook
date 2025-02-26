import {getApiUrl,myGetJson,myPut,myPost,myGet,myDelete} from "./common";

export async function changePassword(password)
{
    let url = `${getApiUrl()}/user/me/password`
    let res;
    try{
        res = await myPut(url,{
            password:password
        });
        if(res.ok) {
            console.log("成功更改密码");
            return true;
        }
    } catch (e) {
        console.error(e);
        res = {};
    }
    return false;
}

export async function changeIntroduction(introduction)
{
    let url = `${getApiUrl()}/user/me/introduction`
    let res;
    try{
        res = await myPut(url,{
            introduction:introduction
        });
        if(res.ok)
        {
            console.log("成功更改个人简介");
            return true;
        }
    } catch (e) {
        console.error(e);
        res = {};
    }
    return false;
}

export async function changeAvatar(avatarBinary)
{
    let url = `${getApiUrl()}/user/me/avatar`
    let res;
    try{
        res = await myPost(url,{
            file:avatarBinary
        });
        if(res.ok)
        {
            console.log("成功更换头像");
            return true;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
}

export async function getAddresses()
{
    let url = `${getApiUrl()}/user/me/addresses`
    let res;
    try{
        res = await myGetJson(url)
    } catch (e) {
        console.error(e);
        res = {};
    }
    return res;
}

export async function addAddress(address,receiver,tel)
{
    let url = `${getApiUrl()}/user/me/addresses`
    let res;
    try{
        res = await myPost(url,{
            address:address,
            receiver:receiver,
            tel:tel
        });
        if(res.ok)
        {
            console.log("成功添加地址");
            return true;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
}

export async function getUserById(id)
{
    let url = `${getApiUrl()}/user/${id}`;
    let res;
    try{
        res = await myGetJson(url)
    } catch (e) {
        console.error(e);
        res = {};
    }
    return res;
}

export async function getMe()
{
    let url = `${getApiUrl()}/user/me`;
    let res;
    try{
        res = await myGetJson(url)
    } catch (e) {
        console.error(e);
        res = {};
    }
    return res;
}

export async function getAvatarByFileName(filename)
{
    let url = `${getApiUrl()}/user/avatars/${filename}`;
    let res;
    try{
        res = await myGet(url)
    } catch (e) {
        console.error(e);
        res = {};
    }
    return res;
}

export async function deleteMyAddress(id)
{
    let url = `${getApiUrl()}/user/me/addresses/${id}`;
    let res;
    try{
        res = await myDelete(url)
        if(res.ok)
        {
            return true;
        }
    } catch (e) {
        console.error(e);
        res = {};
    }
    return false;
}
