import AdminLayout from "../generalUsages/AdminLayout";
import AdminUserTable from "../components/AdminUserTable";

export default function AdminUserPage(){
    return(
        <AdminLayout>
            <AdminUserTable></AdminUserTable>
        </AdminLayout>
    )
}