import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

export default function BookPurchaseCard({book}){
    return(
        <Card
            hoverable
            style={{ width: 360 }}
            cover={<img alt="example" src={book.cover} />}
            onClick={async () => {
                alert(JSON.stringify(book));
            }}
        >
            <Meta title={book.title} description={`价格:${Number(book.price) / 100}￥`} />
        </Card>
    );
}