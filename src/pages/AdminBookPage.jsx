import AdminLayout from "../generalUsages/AdminLayout";
import AdminBookTable from "../components/AdminBookTable";


export default function AdminBookPage(){
    return(
        <AdminLayout>
            <AdminBookTable></AdminBookTable>
        </AdminLayout>
    )
}