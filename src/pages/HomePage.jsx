import { Navigate } from "react-router-dom";

export default function HomePage() {
    let userName = sessionStorage.getItem("user");

    if (userName === null) {
        return (
            <>
                <Navigate to={"/login"} state={{loginStatus:"UnLoggedIn"}}/>
            </>
        );
    } else {
        return (
            <>
                <p>你好, {userName}</p>
            </>
        );
    }
}