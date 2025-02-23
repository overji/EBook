// src/partitions/WebIntroCard.jsx
import React from 'react';
import {Card, Flex, Image, Typography} from 'antd';

export default function WebIntroCard({ width }) {
    const cardStyle: React.CSSProperties = {
        width: width || "100%",
    };

    return (
        <Card style={cardStyle}>
            <Flex justify="space-between" horizontal>
                <Image width="40%" src={require('../pictures/e-book.svg').default} />
                <Typography.Title level={2}>
                    电子书城
                </Typography.Title>
            </Flex>
        </Card>
    );
}