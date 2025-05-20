import React from 'react';
import { Card } from 'antd';
import {Navigate, useNavigate} from "react-router-dom";

const { Meta } = Card;

export default function BookPurchaseCard({book}){
    const navigate = useNavigate();
    return(
        <Card
            hoverable
            style={{ width: 360 }}
            cover={<img alt="example" src={book.cover} />}
            onClick={() => {
                navigate(`/book/${book.id}`)
            }}
        >
            <Meta title={book.title} description={`价格:${Number(book.price) / 100}￥`} />
        </Card>
    );
}