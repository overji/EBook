import { UserLayout } from "../generalUsages/Layout";
import { Avatar, Row, Space, Typography } from "antd";
import { getApiUrl } from "../services/common";
import { useState, useEffect } from "react";
import { changeIntroduction } from "../services/userAction";
import "../stylesheets/User.css"

const { Title, Paragraph } = Typography;

function UserRow({children})
{
    return(
        <Row className="UserRow">
            {children}
        </Row>
    )
}
export default function UserPage() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const [introduction, setIntroduction] = useState('');

    useEffect(() => {
        if (userInfo) {
            setIntroduction(userInfo.introduction);
        }
    }, [userInfo]);

    if (!userInfo) {
        return (
            <UserLayout>
                <p>出错了，请确认用户信息</p>
            </UserLayout>
        );
    }

    function updateIntroduction(value) {
        changeIntroduction(value);
    }

    return (
        <UserLayout>
            <Space direction="vertical" className="UserSpace">
                <UserRow>
                    <Avatar size={128} icon={<img src={`${getApiUrl()}/user/avatars/${userInfo.avatar}`} alt={`${userInfo.nickname}`} />} />
                </UserRow>
                <UserRow>
                    <Title level={3}>{userInfo.nickname}</Title>
                </UserRow>
                <UserRow>
                    <Paragraph
                        editable={{
                            onChange: updateIntroduction,
                        }}
                    >
                        {introduction}
                    </Paragraph>
                </UserRow>
            </Space>
        </UserLayout>
    );
}