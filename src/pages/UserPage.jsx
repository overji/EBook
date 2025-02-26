import { UserLayout } from "../generalUsages/Layout";

export default function UserPage() {
    return (
        <UserLayout>
            <div>My Info: {sessionStorage.getItem("userInfo")}</div>
        </UserLayout>
    );
}