import React, { useContext, useState } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { UserContext } from "../../../services/context";
import {changePassword} from '../../../services/userActions'

export default function ChangePassword() {
    const { user, setUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                if (values.newPassword === values.confirmNewPassword) {
                    changePassword(values.newPassword).then(() => {
                        messageApi.success('成功更新密码');
                        setIsModalOpen(false);
                    }).catch(error => {
                        messageApi.error('更新密码失败');
                    });
                    console.log('Password updated successfully');
                    setIsModalOpen(false);
                } else {
                    messageApi.error('新旧密码不一致');
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
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
                修改密码
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
                        label="请输入新密码"
                        name="newPassword"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="请确认新密码"
                        name="confirmNewPassword"
                        rules={[{ required: true, message: 'Please confirm your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}