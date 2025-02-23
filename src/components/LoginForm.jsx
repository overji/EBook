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

export default function MyLoginForm(){
    const { token } = theme.useToken();

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo={require('../pictures/e-book.svg').default}
                    title="EBook"
                    subTitle="电子书城"
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
                            statusRender: (value) => {
                                const getStatus = () => {
                                    if (value && value.length > 12) {
                                        return 'ok';
                                    }
                                    if (value && value.length > 6) {
                                        return 'pass';
                                    }
                                    return 'poor';
                                };
                                const status = getStatus();
                                if (status === 'pass') {
                                    return (
                                        <div style={{ color: token.colorWarning }}>
                                            强度：中
                                        </div>
                                    );
                                }
                                if (status === 'ok') {
                                    return (
                                        <div style={{ color: token.colorSuccess }}>
                                            强度：强
                                        </div>
                                    );
                                }
                                return (
                                    <div style={{ color: token.colorError }}>强度：弱</div>
                                );
                            },
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