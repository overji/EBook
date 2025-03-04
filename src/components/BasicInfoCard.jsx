import {Card} from "antd";

export default function BasicInfoCard({username,balance})
{
    return(
        <Card title="用户基本信息">
            <p>用户名:{username}</p>
            <p>余额:{balance}</p>
        </Card>
    )
}