import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

const routeBreadcrumbNameMap = {
    '/': '首页',
    '/login': '登录',
    '/register': '注册',
};

export function BasicLayout({ children }) {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);
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
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
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