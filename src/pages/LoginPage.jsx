import MyLoginForm from "../components/LoginForm";
import { BasicLayout } from "../generalUsages/Layout";
import React from "react";
import "../stylesheets/Logins.css";

export default function LoginPage() {
    return (
        <BasicLayout>
            <div className="LoginContainer">
                <MyLoginForm className="LoginForm" />
            </div>
        </BasicLayout>
    );
}