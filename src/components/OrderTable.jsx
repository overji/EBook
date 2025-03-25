import {useState,useEffect} from "react";
import {Divider, Table} from 'antd';
import {getOrder} from "../services/orderAction";
import {Flex,Row,Col,Typography} from "antd";

const {Text} = Typography;

function expandOrderItem(order){
    return(
        <>
            {order.items.map((item,index)=>(
                <Row key={index}>
                    <Flex>
                        <Col span="4">
                            <img
                                src={item.book.cover}
                                alt={item.book.title}
                                style={{
                                    width: '80%',
                                    height: 'auto',
                                }}
                            />
                        </Col>
                        <Col span="4" offset="2">
                            <Row>
                                <Text strong>
                                    {item.book.title}
                                </Text>
                            </Row>
                            <Row>
                                <Text type="secondary">
                                    {item.book.author}
                                </Text>
                            </Row>
                        </Col>
                        <Col span="4" offset="2">
                            <Row>
                                <Text >
                                    数量: {item.number}
                                </Text>
                            </Row>
                            <Row>
                                <Text>
                                    总价: {item.book.price * item.number / 100}￥
                                </Text>
                            </Row>
                        </Col>
                    </Flex>
                    {(index === order.items.length - 1) ? null : <Divider/>}
                </Row>
            ))}
        </>
    )
}

export default function OrderTable()
{
    const [orders,setOrders] = useState([])

    useEffect(()=>{
        getOrder().then((res)=>{
            setOrders(res)
        });
    },[])
    const columns = [
        {
            title: '收货人',
            dataIndex: 'receiver',
            key: 'receiver',
        },
        {
            title: '收货地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '电话号码',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: '下单时间',
            key: 'createdAt',
            render:(text,record)=>(
                new Date(record.createdAt).toLocaleString()
            )
        },
    ];
    return(
        <Table
            columns={columns}
            dataSource={orders}
            rowKey={record=>record.id}
            expandable={{
                expandedRowRender: record => expandOrderItem(record),
                rowExpandable: record => record.items.length > 0,
            }}
        />
    )
}
