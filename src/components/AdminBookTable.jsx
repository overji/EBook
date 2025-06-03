import React, {useEffect, useState} from 'react';
import {Button, Empty, Flex, message, Pagination, Row, Table} from 'antd';
import {deleteBook, getAllTags, searchBooks} from "../services/bookActions";
import BookModal from "./subComponents/adminBook/BookModal";
import BookSearch from "./subComponents/common/BookSearch";


export default function AdminBookTable() {
    const RecordPerPage = 6; // 每页记录数
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [books, setBooks] = useState(null);
    const [curPage, setCurPage] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();
    const [tag, setTag] = useState("");
    const [keyword, setKeyword] = useState("");
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        async function fetchBook() {
            const bookData = await searchBooks(tag, keyword, curPage, RecordPerPage);
            setBooks(bookData);
        }

        fetchBook();
    }, [curPage, tag, keyword]);

    useEffect(() => {
        async function fetchTags() {
            const tagsData = await getAllTags();
            //如果tagsData不是列表，那么就返回空列表
            if(tagsData.status === 401){
                setAllTags([]);
                return;
            }
            setAllTags(tagsData);
        }

        fetchTags();
    }, []);

    async function onKeywordSearch(value) {
        setKeyword(value);
    }

    async function onTagSearch(value) {
        setTag(value);
    }


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
        {
            title: '标题',
            dataIndex: 'title',
            render: (text, record) => (
                <div style={{maxWidth: '380px'}}>
                    {text}
                </div>
            )
        },
        {title: '作者', dataIndex: 'author'},
        {title: 'ISBN', dataIndex: 'isbn'},
        {
            title: '价格',
            dataIndex: 'price',
            render: (text, record) => {
                return (
                    <span>{(text / 100).toFixed(2)} ￥</span>
                );
            }
        },
        {
            title: '销量',
            dataIndex: 'sales',
            render: (text, record) => (
                <div style={{color: 'green'}}>
                    {text}
                </div>
            )
        },
        {title: '库存', dataIndex: 'stock'},
        {
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => (
                <>
                    <Row>
                        <Button
                            type="primary"
                            onClick={() => {
                                deleteBook(record.id).then((res) => {
                                    if (res === undefined || res.status !== 200) {
                                        messageApi.error("删除失败");
                                        return;
                                    }
                                    messageApi.success("删除成功");
                                    //从books中删除该书籍
                                    setBooks((prevBooks) => ({
                                        ...prevBooks,
                                        items: prevBooks.items.filter((item) => item.id !== record.id),
                                    }));
                                });
                            }
                            }
                        >
                            删除
                        </Button>
                    </Row>
                    <Row>
                        <BookModal
                            books={books}
                            setBooks={setBooks}
                            curModifyingBook={record}
                        />
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
            <Flex align="center" gap="middle">
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                <BookModal
                    books={books}
                    setBooks={setBooks}
                    curModifyingBook={null}
                />
            </Flex>
            <BookSearch
                onKeywordSearch={onKeywordSearch}
                allTags={allTags}
                onTagSearch={onTagSearch}
                setTag={setTag}
            />
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
                        total={books.total * RecordPerPage}
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