import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { Space, theme } from 'antd';
import {login} from "../services/login";
import { useNavigate} from "react-router-dom";

export default function MyLoginForm({messageApi}){
    const { token } = theme.useToken();
    const navigate = useNavigate();

    async function handleLogin(values){
        let status = await login(values.username, values.password)
        if(status)
        {
            navigate("/",{ state: { loginStatus: "LoggedIn" } })
        }
        else
        {
            messageApi.open({
                type: 'error',
                content: '登陆错误',
            });
        }
    }

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo={require('../pictures/e-book.svg').default}
                    title="EBook"
                    subTitle="电子书城"
                    onFinish={handleLogin}
                    actions={
                        <Space>
                            尚未注册?
                            <a href="/register">点我注册</a>
                        </Space>
                    }
                >
                <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'用户名'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                            strengthText:
                                'Password should contain numbers, letters and special characters, at least 8 characters long.',
                        }}
                        placeholder={'密码'}
                        rules={[
                            {
                                required: true,
                                message: '请输入密码！',
                            },
                        ]}
                    />
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            忘记密码
                        </a>
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
}