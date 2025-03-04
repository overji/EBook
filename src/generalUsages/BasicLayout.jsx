import { Breadcrumb, Layout, Menu} from 'antd';
import { useLocation, useNavigate} from 'react-router-dom';
import "../stylesheets/Layout.css"

const { Header, Content, Footer } = Layout;

const routeBreadcrumbNameMap = {
    '/': '首页',
    '/login': '登录',
    '/register': '注册',
};

export function BasicLayout({ children ,useBackGround=false}) {
    const location = useLocation();
    const items = []
    const navigate = useNavigate();
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                {routeBreadcrumbNameMap[url]}
            </Breadcrumb.Item>
        );
    });
    const bgClass = (useBackGround)?"BackgroundLayout":"DefaultLayout";

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            {routeBreadcrumbNameMap['/']}
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    return (
        <Layout className={bgClass}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <button className="demoLogo" onClick={
                    ()=>{
                        navigate("/")
                    }
                }>
                    电子书城
                </button>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <div className="demoLogo">
                    {sessionStorage.getItem("user")}
                </div>
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

