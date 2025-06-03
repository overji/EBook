import BookChart from "../components/subComponents/charts/BookChart";
import AdminLayout from "../generalUsages/AdminLayout";
import AdminUserPurchaseTable from "../components/AdminUserPurchaseTable";
import {Divider} from "antd";

export default function AdminStatisticsPage(){
    return(
        <AdminLayout>
            <BookChart isAdmin={true}/>
        </AdminLayout>
    )
}