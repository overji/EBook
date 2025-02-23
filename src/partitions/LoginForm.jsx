import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Button, Checkbox, Form, Input, Flex, Card} from 'antd';
import "../stylesheets/Logins.css";
import WebIntroCard from "./WebIntroCard";

export default function LoginForm(){
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    return (
        <Card className="LoginCard">
            <WebIntroCard width="100%" />
            <Form
                name="login"
                initialValues={{
                    remember: true,
                }}
                style={{
                    maxWidth: 360,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                    ]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                        <a href="">忘记密码</a>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" className="LogButton">
                        登录
                    </Button>
                    未注册? <a href="">点我注册!</a>
                </Form.Item>
            </Form>
        </Card>
    );
};