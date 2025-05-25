import React, { useState, useEffect } from 'react';
import {Modal, Button, Form, Input, Select, message} from 'antd';
import { getAddresses } from "../../../services/userActions";
import {addOrder} from "../../../services/orderActions";
import {deleteFromCart} from "../../../services/cartActions";

export default function OrderModal({selectedList,setSelectedList}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [myAddress, setMyAddress] = useState([]);

    useEffect(() => {
        getAddresses().then((res) => {
            setMyAddress(res);
        });
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
        if(selectedList.length === 0){
            messageApi.warning("请选择商品!");
            return;
        }
        addOrder({
            address: address,
            tel: tel,
            receiver: receiver,
            itemIds: selectedList
        }).then((res)=>{
            if(!res.ok){
                messageApi.error(`下单失败，原因: ${res.message}`);
                setOpen(false);
                return;
            }
            messageApi.success("下单成功!");
            setOpen(false);
            form.setFieldsValue({
                address: "",
                tel: "",
                receiver: ""
            });
            setSelectedList([]);
            deleteFromCart(selectedList).then(()=>{
                console.log("delete from cart success");
                //刷新页面
                window.location.reload();
            });
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
            <Button type="primary" onClick={showModal} style={{width:"15%"}}>
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