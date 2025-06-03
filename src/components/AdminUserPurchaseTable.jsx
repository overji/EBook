import React, {useEffect, useState} from 'react';
import {Button, Empty, Flex, message, Pagination, Row, Table, Typography} from 'antd';
import {getUsers, setUserDisabled} from "../services/userActions";
import {getApiUrl} from "../services/common";
import {getUserOrderStatistics} from "../services/orderActions";

const {Text,Title} = Typography;
export default function AdminUserPurchaseTable({startTime, endTime}) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [userInfos, setUserInfos] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        async function fetchUser() {
            getUserOrderStatistics(startTime, endTime).then((res) => {
                console.log(res);
                // res按照totalCost降序排列
                if (res === null) {
                    messageApi.error("获取用户失败");
                    return;
                }
                res.sort((a, b) => b.totalCost - a.totalCost);
                setUserInfos({
                    items: res,
                    total: res.length
                });
            }).catch((err) => {
                console.error("获取用户失败", err);
                messageApi.error("获取用户失败");
                setUserInfos(null);
            });
        }

        fetchUser();
    }, [startTime, endTime, messageApi]);

    const columns = [
        {
            title: "头像",
            dataIndex: 'avatar',
            render: (text, record) => (
                <img
                    src={`${getApiUrl()}/user/avatars/${text}`}
                    alt="头像"
                    style={{width: 50, height: "auto"}}
                />
            )
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (text, record) => (
                <div style={{maxWidth: '380px'}}>
                    {text}
                </div>
            )
        },
        {title: '昵称', dataIndex: 'nickname'},
        {title: '余额', dataIndex: 'balance'},
        {title: 'email', dataIndex: 'email'},
        {
            title: "总消费",
            key: 'totalCost',
            dataIndex: 'totalCost',
            render: (text) => {
                return (
                    <span>{(text / 100).toFixed(2)} ￥</span>
                );
            }
        }
    ];

    const onSelectChange = newSelectedRowKeys => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Title>
                用户购买统计
            </Title>
            <Flex gap="middle" vertical>
                {contextHolder}
                {userInfos ? <>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={userInfos.items.map((item) => ({
                            ...item,
                            key: item.id,
                        }))}
                        pagination={{
                            pageSize: 12, // 每页显示 12 个用户
                        }}
                    />
                </> : <Empty/>}
            </Flex>
        </>

    );
};