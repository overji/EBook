import { UserLayout } from "../generalUsages/UserLayout";
import {Avatar, Col, Row, Space, Typography} from "antd";
import { getApiUrl } from "../services/common";
import { useState, useEffect } from "react";
import { changeIntroduction, getMe } from "../services/userAction";
import "../stylesheets/User.css";
import AvatarWithUpload from "../components/AvatarWithUpload";
import { EditOutlined } from "@ant-design/icons";
import BasicInfoCard from "../components/BasicInfoCard";

const { Title, Paragraph } = Typography;

export default function UserPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [avatarState, setAvatarState] = useState("normal");

    useEffect(() => {
        getMe().then(info => setUserInfo(info));
    }, []);

    if (!userInfo) {
        return (
            <UserLayout>
                <p>出错了，请确认用户信息</p>
            </UserLayout>
        );
    }

    function updateIntroduction(value) {
        changeIntroduction(value);
        setUserInfo({
            ...userInfo,
            introduction: value
        });
    }

    return (
        <UserLayout>
            <Space direction="vertical" className="UserSpace" size="0" justify="center">
                <Row>
                    <Col span={"8"} offset={"8"} style={{ textAlign: 'center' }}>
                    <div className="avatar-container">
                        {avatarState === "normal" ? (
                            <Avatar
                                size={96}
                                icon={<img src={`${getApiUrl()}/user/avatars/${userInfo.avatar}`} alt={`${userInfo.nickname}`} />}
                                className="NormalAvatar"
                                onClick={() => {
                                    setAvatarState("upload");
                                }}
                            />
                        ) : (
                            <AvatarWithUpload
                                onUploadSuccess={() => {
                                    setAvatarState("normal");
                                    getMe().then(info => {
                                        setUserInfo(info);
                                        sessionStorage.setItem("userInfo", JSON.stringify(info));
                                        window.location.reload();
                                    });
                                }}
                            />
                        )}
                        <EditOutlined className="edit-icon" />
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={"8"} offset={"8"} style={{ textAlign: 'center' }}>
                        <Title level={3}>{userInfo.nickname}</Title>
                    </Col>
                </Row>
                <Row>
                    <Col span={"8"} offset={"8"} style={{ textAlign: 'center' }}>
                        <Paragraph
                            editable={{
                                onChange: updateIntroduction,
                            }}
                        >
                            {userInfo.introduction}
                        </Paragraph>
                    </Col>
                </Row>
                <Row>
                    <Col span={"8"} offset={"8"} style={{ textAlign: 'left' }}>
                        <BasicInfoCard
                            username={userInfo.username}
                            balance={userInfo.balance}
                        />
                    </Col>
                </Row>
            </Space>
        </UserLayout>
    );
}