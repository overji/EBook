import React, {useEffect, useState} from 'react';
import {Button, Empty, Flex, Pagination, Table} from 'antd';
import {searchBooks} from "../services/getBooks";
import BookModal from "./subComponents/adminBook/BookModal";

const columns = [
    {
        title: "封面",
        dataIndex: 'cover',
        render: (text, record) => (
            <img
                src={text}
                alt="封面"
                style={{width: 50, height: "auto"}}
            />
        )
    },
    {title: '标题', dataIndex: 'title'},
    {title: '作者', dataIndex: 'author'},
    {title: 'ISBN', dataIndex: 'isbn'},
    {title: '价格', dataIndex: 'price'},
    {title: '库存', dataIndex: 'stock'},
    {title: '操作', dataIndex: 'action'},
];

export default function AdminBookTable() {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [books, setBooks] = useState(null);
    const [curPage, setCurPage] = useState(0);
    const start = () => {
        console.log('Selected Row Keys: ', selectedRowKeys);
    };
    const onSelectChange = newSelectedRowKeys => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        searchBooks("", "", curPage, 6).then((bookData) => {
            //判断是否bookData.status是401
            console.log(bookData);
            if (bookData.status === 401) {
                setBooks([]);
                return;
            }
            console.log(bookData);
            setBooks(bookData);
        });
    }, [curPage]);

    return (
        <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
                <Button type="primary" onClick={start} disabled={!hasSelected}>
                    Reload
                </Button>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                <BookModal/>
            </Flex>
            {books ? <>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={books.items.map((item) => ({
                        ...item,
                        key: item.id,
                    }))}
                    pagination={false} // 禁用分页
                />
                <Flex align="center" gap="middle">
                    <Pagination
                        defaultCurrent={1}
                        total={books.total * 6}
                        onChange={(page)=>{
                            setCurPage(page-1);
                        }}
                    />
                </Flex>
            </> : <Empty/>}

        </Flex>
    );
};