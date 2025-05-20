import React, {useState, useEffect, useRef} from 'react';
import {Modal, Button, Form, Input, Select, message} from 'antd';
import {getAddresses} from "../../../services/userAction";
import {addOrder} from "../../../services/orderAction";
import {deleteFromCart} from "../../../services/cartAction";
import ImageUpload from "../common/ImageUpload";
import {getApiUrl} from "../../../services/common";
import {deleteCoverWithURL} from "../../../services/getBooks";

export default function BookModal({selectedList, setSelectedList, isAdd = true, bookId = -1}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [myAddress, setMyAddress] = useState([]);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [imageURL,setImageURL] = useState("");

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
        if (!receiver || !tel || !address) {
            messageApi.error("请填写完整信息!");
            return;
        }
        if (selectedList.length === 0) {
            messageApi.warning("请选择商品!");
            return;
        }
        addOrder({
            address: address,
            tel: tel,
            receiver: receiver,
            itemIds: selectedList
        }).then((res) => {
            if (!res.ok) {
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
            deleteFromCart(selectedList).then(() => {
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
            <Button type="primary" onClick={showModal} style={{width: "15%"}}>
                立即下单
            </Button>
            <Modal title="选择收货人" open={open} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >
                    <Form.Item
                        label="常用收货地址"
                        name="selectAddress"
                        rules={[{required: true, message: '请上传封面或输入图片URL!'}]}
                    >
                        <ImageUpload
                            onUploadSuccess={(url) => {
                                setImageURL(`${getApiUrl()}/${url}`);
                                setInputDisabled(true);
                            }}
                            onFileRemove={()=>{
                                deleteCoverWithURL(imageURL).then((res)=>{
                                    if(res.ok){
                                        messageApi.success("删除成功");
                                    }
                                    else{
                                        messageApi.error("删除失败");
                                    }
                                });
                                setImageURL("");
                                setInputDisabled(false);
                            }}
                        />
                        <Input
                            placeholder="在这里填入URL"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)} // 同步用户输入
                            disabled={inputDisabled}
                        />
                    </Form.Item>
                    <Form.Item
                        label="收货地址"
                        name="address"
                        rules={[{required: true, message: '请输入收货地址!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="电话号码"
                        name="tel"
                        rules={[{required: true, message: '请输入电话号码!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="收货人"
                        name="receiver"
                        rules={[{required: true, message: '请输入收货人!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}