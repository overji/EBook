import React, {useEffect,useState} from 'react';
import { useLocation, useNavigate} from "react-router-dom";
import {Avatar, Breadcrumb, Dropdown, Layout, Menu} from "antd";
import { getApiUrl } from "../services/common";
import {getMe} from "../services/userAction";
import {UserContext} from "../services/context";
import {PageLoading} from "@ant-design/pro-components";

const { Header, Content, Footer } = Layout;

const routeBreadcrumbNameMap = {
    '/': '首页',
    '/login': '登录',
    '/register': '注册',
};

export default function UserLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const items = [
        {
            key: 0,
            label: `首页`,
            onClick: () => navigate("/")
        },
        {
            key: 1,
            label: `个人`,
            onClick: () => navigate("/me")
        }
    ];

    function getDropItems(user) {
        return {
            items: [
                {
                    key: '1',
                    label: (
                        <div
                            onClick={() => {
                                navigate("/me");
                            }}
                            style={{cursor: 'pointer' }}
                        >
                            个人中心
                        </div>
                    ),
                },
                {
                    key: '2',
                    label:`余额：${user.balance}元`
                },
                {
                    key: '3',
                    label: (
                        <div onClick={() => {
                            localStorage.removeItem("token");
                            setUser(null);
                            navigate("/login",{state:{"loginStatus":"UnLoggedIn"}});
                        }} style={{cursor: 'pointer'}}>
                            退出登录
                        </div>
                    ),
                    danger: true,
                },
            ]
        };
    }

    const pathSnippets = location.pathname.split('/').filter(i => { return i; });

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                {routeBreadcrumbNameMap[url]}
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            {routeBreadcrumbNameMap['/']}
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    useEffect(()=>{
        const fetchData = async () => {
            const user = await getMe();
            if(!user)
            {
                navigate("/login",{state:{"loginStatus":"UnLoggedIn"}});
            }
            setUser(user);
        }
        fetchData();
    },[navigate])


    return (
            <Layout className="DefaultLayout">
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <button className="demoLogo" onClick={() => navigate("/")}>
                        电子书城
                    </button>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={items}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    {user && (
                        <Dropdown menu={getDropItems(user)}>
                            <Avatar size={48} icon={<img src={`${getApiUrl()}/user/avatars/${user.avatar}`} alt={`${user.nickname}`} />} />
                        </Dropdown>
                    )}
                </Header>
                <Content style={{ padding: '0 48px', flex: '1 0 auto' }}>
                    {user ? (
                        <UserContext.Provider value={{user,setUser}}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                {breadcrumbItems}
                            </Breadcrumb>
                            {children}
                        </UserContext.Provider>
                    ) : (
                        <PageLoading />
                    )}
                </Content>
                <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
                    EBook ©{new Date().getFullYear()} Created by Ji.
                    <br />
                    Thanks for Ant Design.
                </Footer>
            </Layout>
    );
}