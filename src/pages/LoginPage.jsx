import LoginForm from "../partitions/LoginForm";
import {BasicLayout} from "../generalUsages/Layout";
import {React} from "react";
import "../stylesheets/Logins.css"

export default function LoginPage(){
    return(
        <BasicLayout>
            <LoginForm className="LoginForm"/>
        </BasicLayout>
    )
}