import React, {useState, useEffect, useContext} from 'react';
import {Modal, Button, Form, Input, Select, message} from 'antd';
import { getAddresses } from "../../../services/userActions";
import {addOneOrder, addOrder} from "../../../services/orderActions";
import {deleteFromCart} from "../../../services/cartActions";
import {UserContext} from '../../../services/context';

export default function OneOrderModal({bookId,number}) {
    const { user, setUser } = useContext(UserContext);
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [myAddress, setMyAddress] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        getAddresses().then((res) => {
            setMyAddress(res);
        });
    }, []);

    useEffect(() => {
        let username = user.username;
        console.log("1111111111111 ",username);
        const socket = new WebSocket("ws://localhost:8080/ws?username=" + username);
        socket.onopen = () => console.log("WebSocket 连接已建立");
        socket.onmessage = (event) => console.log("收到后端消息:", event.data);
        socket.onerror = (error) => console.error("WebSocket 错误:", error);
        socket.onclose = () => console.log("WebSocket 连接已关闭");
        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);


    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        let receiver = form.getFieldValue('receiver');
        let tel = form.getFieldValue('tel');
        let address = form.getFieldValue('address');
        if(!receiver || !tel || !address){
            messageApi.error("请填写完整信息!");
            return;
        }
        addOneOrder({
            address: address,
            tel: tel,
            receiver: receiver,
        },bookId,number).then((res)=>{
            if(!res.ok){
                messageApi.error(`下单失败，原因: ${res.message}`);
                setOpen(false);
                form.setFieldsValue({
                    address: "",
                    tel: "",
                    receiver: ""
                });
                return;
            }
            setOpen(false);
            form.setFieldsValue({
                address: "",
                tel: "",
                receiver: ""
            });
            // 显示 loading 提示
            const loadingKey = "loading";
            messageApi.loading({ content: "正在下单中...", key: loadingKey, duration: 0 });

            // 监听 WebSocket 消息
            ws.onmessage = (event) => {
                console.log("收到后端消息:", event.data);
                try {
                    const data = JSON.parse(event.data);
                    if (data.ok) {
                        messageApi.success({ content: "下单成功", key: loadingKey });
                        setOpen(false);
                        form.setFieldsValue({
                            address: "",
                            tel: "",
                            receiver: ""
                        });
                    } else {
                        messageApi.error({ content: "下单失败", key: loadingKey });
                    }
                } catch (e) {
                    console.error("消息解析失败:", e);
                    messageApi.error({ content: "下单失败", key: loadingKey });
                }
            };
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSelectChange = (value) => {
        const selectedAddress = myAddress.find(item => item.id === value);
        if (selectedAddress) {
            form.setFieldsValue({
                address: selectedAddress.address,
                tel: selectedAddress.tel,
                receiver: selectedAddress.receiver
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Button size="large" type="primary" onClick={showModal}>
                立即下单
            </Button>
            <Modal title="选择收货人" open={open} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="常用收货地址"
                        name="selectAddress"
                        rules={[{ required: true, message: '请选择常用收货地址!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="选择常用收货地址"
                            options={[
                                { value: 'header', label: '地址 电话 收货人', disabled: true },
                                ...myAddress.map((item) => ({
                                    value: item.id,
                                    label: `${item.address} ${item.tel} ${item.receiver}`
                                }))
                            ]}
                            onChange={handleSelectChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="收货地址"
                        name="address"
                        rules={[{ required: true, message: '请输入收货地址!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="电话号码"
                        name="tel"
                        rules={[{ required: true, message: '请输入电话号码!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="收货人"
                        name="receiver"
                        rules={[{ required: true, message: '请输入收货人!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}