import React, {useEffect, useState} from 'react';
import {Button, Empty, Flex, message, Pagination, Row, Table} from 'antd';
import {getUsers, setUserDisabled} from "../services/userActions";
import {getApiUrl} from "../services/common";


export default function AdminUserTable() {
    const RecordPerPage = 6; // 每页记录数
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [users, setUsers] = useState(null);
    const [curPage, setCurPage] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        async function fetchUser() {
            getUsers(RecordPerPage, curPage).then((res) => {
                if (res === undefined) {
                    messageApi.error("获取书籍失败");
                    return;
                }
                setUsers(res);
            }).catch((err) => {
                console.error("获取书籍失败", err);
                messageApi.error("获取书籍失败");
                setUsers(null);
            });
        }

        fetchUser();
    }, [curPage,messageApi]);

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
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => (
                <>
                    <Row>
                        {record.privilege !== 0 ? (
                            <Button type="primary" disabled>
                                管理员
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={()=>{
                                    setUserDisabled(record.id, !record.isDisabled)
                                        .then((res) => {
                                            if (res.ok) {
                                                messageApi.success("操作成功");
                                                setUsers(prev => ({
                                                    ...prev,
                                                    items: prev.items.map((item)=> {
                                                        return item.id === record.id ? {
                                                            ...item,
                                                            isDisabled: !item.isDisabled
                                                        } : item
                                                    })
                                                }));
                                            } else {
                                                messageApi.error("操作失败");
                                            }
                                        }).catch((err) => {
                                        console.error("操作失败", err);
                                        messageApi.error("操作失败");
                                    });
                                }
                                }
                            >
                                {record.isDisabled? "启用" : "禁用"}
                            </Button>
                        )}
                    </Row>
                </>
            ),
        },
    ];

    const onSelectChange = newSelectedRowKeys => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Flex gap="middle" vertical>
            {contextHolder}
            {users ? <>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={users.items.map((item) => ({
                        ...item,
                        key: item.id,
                    }))}
                    pagination={false} // 禁用分页
                />
                <Flex align="center" gap="middle">
                    <Pagination
                        defaultCurrent={1}
                        total={users.total * RecordPerPage}
                        pageSize={RecordPerPage}
                        onChange={(page) => {
                            setCurPage(page - 1);
                        }}
                    />
                </Flex>
            </> : <Empty/>}

        </Flex>
    );
};