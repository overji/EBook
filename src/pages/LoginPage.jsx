import MyLoginForm from "../components/LoginForm";
import {BasicLayout} from "../generalUsages/BasicLayout";
import React, {useEffect, useRef} from "react";
import "../stylesheets/Logins.css";
import {useLocation} from "react-router-dom";
import {message} from "antd";


export default function LoginPage() {
    const [messageApi, contextHolder] = message.useMessage();

    const location = useLocation();
    let loginStatus = useRef(location.state?.loginStatus || "UnLoggedIn");
    const keyRef = useRef(Date.now()); // Move useRef to the top level

    useEffect(() => {
        let cur = keyRef.current;
        if (loginStatus.current === "UnLoggedIn") {
            messageApi.info({
                content: '请先登录!',
                key: keyRef.current
            });
        } else {
            console.log("hi?");
        }
        return () => {
            messageApi.destroy(cur); // Use the same key for cleanup
        };
    }, [loginStatus, messageApi]);

    return (
        <BasicLayout useBackGround={true}>
            {contextHolder}
            <div className="LoginContainer">
                <MyLoginForm className="LoginForm" messageApi={messageApi}/>
            </div>
        </BasicLayout>
    );
}