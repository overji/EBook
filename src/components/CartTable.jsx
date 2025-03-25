import {getCart,changeCart,addToCart,deleteFromCart} from "../services/cartAction";

import React, {useEffect, useState} from 'react';
import {Button, Col, Flex, InputNumber, Row, Table, Typography} from 'antd';
import OrderModal from "./OrderModal";
const {Text} = Typography;

function ExpandCartItem({cartItem}){
    return (
        <Flex>
            <Col span="4">
                <img
                    src={cartItem.book.cover}
                    alt={cartItem.book.title}
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </Col>
            <Col span="18" offset="1">
                {cartItem.book.description}
            </Col>
        </Flex>
    )
}
export default function CartTable(){
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [cart,setCart] = useState([]);

    function getSelectedTotalPrice(){
        let totalPrice = 0;
        for(let key of selectedRowKeys){
            const item = cart.find((item) => item.id === key);
            totalPrice += item.book.price * item.number / 100;
        }
        return totalPrice
    }

    const columns = [
        {
            title: '标题',
            dataIndex: ['book','title'],
            key: 'title',
        },
        {
            title: '数量',
            dataIndex: 'number',
            key: 'number',
            render: (text, record) => (
                <InputNumber
                    defaultValue={record.number}
                    min={1}
                    onChange={(value) => {
                        changeCart(record.id,value).then(() => {
                                setCart(cart.map((item) => {
                                    if(item.book.id === record.book.id)
                                    {
                                        return {
                                            ...item,
                                            number: value
                                        };
                                    }
                                    return item;
                                }));
                        });
                    }}
                />
            )
        },
        {
            title: '总价',
            key: 'totalPrice',
            render: (text, record) => (
                <span>{record.book.price * record.number / 100}￥</span>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_,record)=>{
                return (
                    <Button
                        onClick={() => {
                            deleteFromCart(record.id).then(() => {
                                setCart(cart.filter((item) => item.id !== record.id));
                            });
                        }}
                        type="primary"
                        variant="filled"
                    >
                        删除
                    </Button>
                );

            }
        }
    ];

    useEffect(() => {
        getCart().then((res) => {
            console.log(JSON.stringify(res))
            if(res)
            {
                setCart(res);
            }
        });
    }, []);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        console.log(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={cart}
                rowKey={record => record.id}
                expandable={{
                    expandedRowRender: (record) => <ExpandCartItem cartItem={record}/>,
                }}
            />
            <Text strong>
                总价:{getSelectedTotalPrice()}￥
            </Text>
            <OrderModal selectedList={selectedRowKeys} setSelectedList={setSelectedRowKeys}/>
        </Flex>
    );
}