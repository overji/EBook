import {useContext, useEffect, useState} from "react";
import {Avatar, Button, Card, Col, Form, Input, message, Modal, Row, Space, Table, Typography} from "antd";
import { getApiUrl } from "../services/common";
import {
    addAddress,
    changeIntroduction,
    deleteMyAddress,
    getAddresses,
    getMe
} from "../services/userAction";
import "../stylesheets/User.css";
import AvatarWithUpload from "./subComponents/me/AvatarWithUpload";
import { EditOutlined } from "@ant-design/icons";
import { UserContext } from "../services/context";
import {PageLoading} from "@ant-design/pro-components";
import ChangePassword from "./subComponents/me/ChangePassword";

const { Title, Paragraph } = Typography;

function BasicInfoCard({username,balance})
{
    return(
        <Card title="用户基本信息">
            <p>用户名:{username}</p>
            <p>余额:{balance / 100}￥</p>
        </Card>
    )
}

function AddLocation({locations,setLocations})
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                addAddress(values.address,values.name,values.tel)
                    .then(()=>{
                        setIsModalOpen(false);
                        form.resetFields();
                        getAddresses().then(setLocations);
                        messageApi.success("添加成功");
                    })
                    .catch(()=>{
                        messageApi.error("添加失败");
                    })
            })
    };

    const handleCancel = () => {
        //清空表单
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={showModal}>
                添加收货人
            </Button>
            <Modal title="修改密码" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="收货人:"
                        name="name"
                        rules={[{ required: true, message: '请输入收货人!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="收货地址:"
                        name="address"
                        rules={[{ required: true, message: '请输入收货地址!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="电话号码:"
                        name="tel"
                        rules={[{ required: true, message: '请输入电话号码!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

function LocationCard({ locations,setLocations }) {
    const columns = [
        {
            title: '收货人',
            dataIndex: 'receiver',
            key: 'receiver',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '联系电话',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                    onClick={
                        ()=>{
                            deleteMyAddress(record.id).then(()=>{
                                setLocations(locations.filter((location)=>location.id!==record.id));
                            });
                        }
                    }>
                        删除
                    </Button>
                </Space>
            ),
        }
    ];

    return (
        <Card title={"收货地址"} extra={<AddLocation setLocations={setLocations} locations={locations}/>}>
            <Table dataSource={locations} columns={columns} rowKey="id" pagination={false} />
        </Card>
    );
}

export default function UserProfile() {
    const { user, setUser } = useContext(UserContext);
    const [locations, setLocations] = useState([]);
    const [avatarState, setAvatarState] = useState("normal");

    useEffect(() => {
        getAddresses().then((data) => {
            setLocations(data);
        });
    }, []);

    if (!user) {
        console.log("loading");
        return (
            <PageLoading>
            </PageLoading>
        );
    }

    function updateIntroduction(value) {
        changeIntroduction(value);
        setUser({
            ...user,
            introduction: value
        });
    }

    return (
        <Space direction="vertical" className="UserSpace" size="0" justify="center">
            <Row>
                <Col span={"16"} offset={"4"} style={{ textAlign: 'center' }}>
                    <div className="avatar-container">
                        {avatarState === "normal" ? (
                            <Avatar
                                size={96}
                                icon={<img src={`${getApiUrl()}/user/avatars/${user.avatar}`} alt={`${user.nickname}`} />}
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
                                        setUser(info);
                                        window.location.reload();
                                    });
                                }}
                            />
                        )}
                        <EditOutlined
                            className="edit-icon"
                            onClick={() => {
                                setAvatarState("upload");
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={"16"} offset={"4"} style={{ textAlign: 'center' }}>
                    <Title level={3}>{user.nickname}</Title>
                </Col>
            </Row>
            <Row>
                <Col span={"16"} offset={"4"} style={{ textAlign: 'center' }}>
                    <Paragraph
                        editable={{
                            onChange: updateIntroduction,
                        }}
                    >
                        {user.introduction}
                    </Paragraph>
                </Col>
            </Row>
            <Row>
                <Col span={"16"} offset={"4"} style={{ textAlign: 'center' }}>
                    <ChangePassword></ChangePassword>
                </Col>
            </Row>
            <Row>
                <Col span={"16"} offset={"4"} style={{ textAlign: 'left' }}>
                    <BasicInfoCard
                        username={user.username}
                        balance={user.balance}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={"16"} offset={"4"} style={{ textAlign: 'left' }}>
                    <LocationCard locations={locations} setLocations={setLocations}/>
                </Col>
            </Row>
        </Space>
    );
}