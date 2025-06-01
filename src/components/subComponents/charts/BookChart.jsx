import React, {useEffect, useState} from 'react';
import {getOrder, getOrderAdmin} from "../../../services/orderActions";
import {DatePicker, Row, Table, Typography} from "antd";

const {Text} = Typography;
export default function BookChart({isAdmin = false}) {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [statistics, setStatistics] = useState([]);
    const [totalPurchase, setTotalPurchase] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        getOrder(startTime, endTime, "")
            .then(res => {
                if (res) {
                    let tmp = {};
                    let purchase = 0;
                    let cost = 0;
                    for (let i = 0; i < res.length; i++) {
                        for (let j = 0; j < res[i].items.length; j++) {
                            purchase += res[i].items[j].number;
                            cost += res[i].items[j].number * res[i].items[j].book.price / 100;
                            tmp[res[i].items[j].book.id] = tmp[res[i].items[j].book.id] || {
                                ...res[i].items[j].book,
                                purchase: 0
                            };
                            tmp[res[i].items[j].book.id].purchase += res[i].items[j].number;
                        }
                    }
                    setTotalPurchase(purchase);
                    setTotalCost(cost);
                    //遍历tmp的每一个键值对，将其转换为数组存在statistics中，并且按purchase进行排序
                    const sortedStatistics = Object.values(tmp).sort((a, b) => b.purchase - a.purchase);
                    setStatistics(sortedStatistics);
                } else {
                    setStatistics([]);
                }
            })
            .catch(err => {
                console.error("获取订单失败", err);
            });
    }, [startTime, endTime, isAdmin]);
    const columns = [
        {
            title: '书籍封面',
            dataIndex: 'cover',
            key: 'cover',
            render: (text, record) => (
                <img
                    src={record.cover}
                    alt={record.title}
                    style={{width: '50px', height: 'auto'}}
                />
            )
        },
        {
            title: '书籍名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '购买数量',
            dataIndex: 'purchase',
            key: 'purchase',
        },
        {
            title: "花费",
            key: 'cost',
            render: (text, record) => {
                const cost = (record.purchase * record.price / 100).toFixed(2);
                return (
                    <span>{cost} ￥</span>
                );
            }
        }
    ];

    return (
        <>
            <Row>
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
            <Row>
                <Typography>
                    <Text strong>总购买数量: {totalPurchase}</Text>
                </Typography>
            </Row>
            <Row>
                <Typography>
                    <Text strong>总花费: {totalCost.toFixed(2)} ￥</Text>
                </Typography>
            </Row>
            <Table
                columns={columns}
                dataSource={statistics.map((value, index) => {
                    return {
                        ...value,
                        key: value.id
                    }
                })}
                rowKey={record => record.id}
            />
        </>
    )
}
