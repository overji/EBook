import MyLoginForm from "../components/LoginForm";
import { BasicLayout } from "../generalUsages/Layout";
import React, {useEffect, useRef} from "react";
import "../stylesheets/Logins.css";
import {useLocation} from "react-router-dom";
import {message} from "antd";


export default function LoginPage() {
    const [messageApi, contextHolder] = message.useMessage();

    const location = useLocation();
    let loginStatus = useRef(location.state.loginStatus || {});
    
    useEffect(()=>{
        let key = Date.now();
        if(loginStatus.current === "UnLoggedIn") {
            messageApi.info({
                content:'请先登录!',
                key:key
            });
            loginStatus.current = "";
        }
        return ()=>{
            messageApi.destroy(key);
        }
    },[loginStatus, messageApi]);

    return (
        <BasicLayout>
            {contextHolder}
            <div className="LoginContainer">
                <MyLoginForm className="LoginForm" messageApi={messageApi}/>
            </div>
        </BasicLayout>
    );
}