import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {getMe} from "../services/userAction";
import {Avatar, Breadcrumb, Layout, Menu} from "antd";
import {getApiUrl} from "../services/common";
import {useEffect, useState} from "react";

const { Header, Content, Footer } = Layout;

const routeBreadcrumbNameMap = {
    '/': '首页',
    '/login': '登录',
    '/register': '注册',
};

export function UserLayout({ children }) {
    let userName = sessionStorage.getItem("user");
    const location = useLocation();
    const navigate = useNavigate();
    const [myInfo, setMyInfo] = useState(null);
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
    const pathSnippets = location.pathname.split('/').filter(i => { return i; });

    useEffect(() => {
        const fetchMyData = async () => {
            if(sessionStorage.getItem("userInfo") !== null)
            {
                let res = sessionStorage.getItem("userInfo")
                console.log(res)
                setMyInfo(JSON.parse(res))
                console.log(`已经获取个人信息!`)
                return;
            }
            const data = await getMe();
            setMyInfo(data);
            console.log(JSON.stringify(data))
            sessionStorage.setItem("userInfo",JSON.stringify(data));
        };
        fetchMyData();
    }, []);

    if (userName === null) {
        return <Navigate to={"/login"} state={{ loginStatus: "UnLoggedIn" }} />;
    }

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
                {myInfo && (
                    <Avatar size={48} icon={<img src={`${getApiUrl()}/user/avatars/${myInfo.avatar}`} alt={`${myInfo.nickname}`} />} />
                )}
            </Header>
            <Content style={{ padding: '0 48px', flex: '1 0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    {breadcrumbItems}
                </Breadcrumb>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
                EBook ©{new Date().getFullYear()} Created by Ji.
                <br />
                Thanks for Ant Design.
            </Footer>
        </Layout>
    );
}