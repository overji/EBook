import OrderTable from "../components/OrderTable";
import AdminLayout from "../generalUsages/AdminLayout";

export default function AdminOrderPage(){
    return(
        <AdminLayout>
            <OrderTable isAdmin={true}/>
        </AdminLayout>
    )
}