import {useState,useEffect} from "react";
import {Divider, DatePicker, Table, theme} from 'antd';
import {getOrder, getOrderAdmin, getOrderByTimeAndBookName} from "../services/orderActions";
import {Flex,Row,Col,Typography} from "antd";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
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

export default function OrderTable({isAdmin = false})
{
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [bookName, setBookName] = useState("");
    const [orders,setOrders] = useState([])

    useEffect(()=>{
        if(!isAdmin){
            getOrder(startTime,endTime,bookName)
                .then(res=>{
                    if(res){
                        setOrders(res);
                    } else {
                        setOrders([]);
                    }
                })
                .catch(err=>{
                    console.error("获取订单失败",err);
                });
        } else {
            getOrderAdmin(startTime,endTime,bookName)
                .then(res=>{
                    if(res){
                        setOrders(res);
                    } else {
                        setOrders([]);
                    }
                })
                .catch(err=>{
                    console.error("获取订单失败",err);
                });
        }
    },[startTime, endTime, bookName,isAdmin]);
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

    const onSearch = (value)=>{
        setBookName(value);
    }

    return(
        <>
            <Row>
                <Search
                    placeholder="搜索"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: "30%" }}
                />
                <Typography>
                    <Text strong>开始时间</Text>
                </Typography>
                <DatePicker
                    showTime
                    onChange={(_, dateStr) => setStartTime(dateStr)}
                />
                <Typography>
                    <Text strong>结束时间</Text>
                </Typography>
                <DatePicker
                    showTime
                    onChange={(_, dateStr) => setEndTime(dateStr)}
                />
            </Row>
            <Table
                columns={columns}
                dataSource={orders.map((value,index)=>{
                    return {
                        ...value,
                        key:value.id
                    }
                })}
                rowKey={record=>record.id}
                expandable={{
                    expandedRowRender: record => expandOrderItem(record),
                    rowExpandable: record => record.items.length > 0,
                }}
            />
        </>
    )
}
