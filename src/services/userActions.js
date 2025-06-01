import {getApiUrl,myGetJson,myPut,myPost,myGet,myDelete} from "./common";

export async function getUsers(pageSize,pageIndex){
    let url = `${getApiUrl()}/user/admin?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    let res;
    try{
        res = await myGetJson(url);
        if(res.ok === false){
            return undefined;
        }
    } catch (e) {
        console.error(e);
        res = undefined;
    }
    return res;
}

export async function setUserDisabled(id,disabled){
    let url = `${getApiUrl()}/user/admin/${id}?isDisabled=${disabled}`;
    let res;
    try{
        res = await myPut(url);
        if(res.ok) {
            console.log("成功更改用户状态");
        }
    } catch (e) {
        console.error(e);
        res = {}
    }
    return res;
}
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

export async function register(username,nickname,password,email){
    let url = `${getApiUrl()}/user/register`
    let res;
    try{
        res = await myPost(url,{
            username:username,
            nickname:nickname,
            password:password,
            email:email
        });
        if(res.ok)
        {
            console.log("成功注册");
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
        else
        {
            console.log("更换头像失败");
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
            return res;
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
        if(res.ok === false){
            return undefined;
        }
    } catch (e) {
        console.error(e);
        res = undefined;
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

export function getAvatarFullUrl(filename)
{
    return `${getApiUrl()}/user/avatars/${filename}`;
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
