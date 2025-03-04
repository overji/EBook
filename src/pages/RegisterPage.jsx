import RegisterForm from "../components/RegisterForm";
import {BasicLayout} from "../generalUsages/BasicLayout";
import {React} from "react";
import "../stylesheets/Logins.css"

export default function RegisterPage(){
    return(
        <BasicLayout>
            <RegisterForm className="LoginForm"/>
        </BasicLayout>
    )
}