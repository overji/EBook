import {Image, Row, Col, Typography, Divider, Spin, Button, message, Pagination, InputNumber} from 'antd'
import {getBookWithId} from "../services/bookActions";
import {useEffect, useState} from "react";
import "../stylesheets/BookIntro.css"
import {addToCart} from "../services/cartActions";
import {addBookComment, getBookComments} from "../services/commentActions";
import {useSearchParams} from "react-router-dom";
import CommentDiv from "./subComponents/userBook/CommentDiv";
import ReplyInput from "./subComponents/userBook/ReplyInput";
import {BugFilled} from "@ant-design/icons";
import OrderModal from "./subComponents/userOrder/OrderModal";
import OneOrderModal from "./subComponents/userBook/OneOrderModal";

const {Title,Text} = Typography;


function BookPurchaseDiv({bookInfo}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [number,setNumber] = useState(1);
    return(
        <Row>
            {contextHolder}
            <Col span={7}>
                <Image
                    src={bookInfo.cover}
                    width="95%"
                    height="auto"
                    style={
                        {
                            paddingLeft:"auto"
                        }
                    }
                />
            </Col>
            <Col span={16} offset={1}>
                <Title level={2}>
                    {bookInfo.title}
                </Title>
                <Divider orientation="left">
                    <Text strong>
                        基本信息
                    </Text>
                </Divider>
                <Text style={{marginRight:"10px"}}>
                    作者: <b>{bookInfo.author}</b>
                </Text>
                <Text style={{marginRight:"10px"}}>
                    销量: <b>{bookInfo.sales}</b>
                </Text>
                <Text style={{marginRight:"10px"}}>
                    库存: <b>{bookInfo.stock}</b>
                </Text>
                <Text>
                    标签: {bookInfo.tags.map((tagInfo, index) => {
                        return (
                            <Text
                                key={tagInfo.id || index} // Use a unique key
                                keyboard
                                style={{
                                    marginRight: "5px"
                                }}
                            >
                                {tagInfo.name}
                            </Text>
                        );
                    })}
                </Text>
                <Divider orientation="left">
                    <Text strong>
                        作品简介
                    </Text>
                </Divider>
                <Text>
                    {bookInfo.description}
                </Text>
                <Row>
                    <Title level={3} className={"priceSpan"} style={{color:"#ff6363"}}>
                        特价:{bookInfo.price/100}￥  (-40%)
                    </Title>
                </Row>
                <Row>
                    <InputNumber
                        min={1}
                        defaultValue={1}
                        addonBefore={"购买数量"}
                        onChange={(val)=>{
                            setNumber(val);
                        }}
                    />
                </Row>
                <Divider></Divider>
                <Row>
                    <Button size="large" type="primary"
                            style={{marginRight:"25px"}}
                            onClick={()=>{
                        addToCart(bookInfo.id,number)
                            .then((res) => {
                                if(res.ok){
                                    messageApi.success("成功加入购物车");
                                } else {
                                    messageApi.error(`加入购物车失败，原因:${res.message}`);
                                }

                            })
                            .catch((e) => { messageApi.error("出错了!请联系管理员") })
                    }}>加入购物车</Button>
                    <OneOrderModal style={{marginLeft:"400px"}} number={number} bookId={bookInfo.id}></OneOrderModal>
                </Row>
            </Col>
        </Row>
    )
}

export default function BookIntro({bookId})
{
    const [bookInfo,setBookInfo] = useState(null);
    const [commentInfo,setCommentInfo] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = Number.parseInt(searchParams.get("pageIndex")??'0');
    const pageSize = Number.parseInt(searchParams.get("pageSize")??"5");
    const sort = searchParams.get("sort")??"createdTime";

    const buttonOnClick = ()=>{
        //设置searchParams中的sort为createdTime或者like
        setSearchParams({
            pageIndex:pageIndex,
            pageSize:pageSize,
            sort:(sort === "createdTime")?"like":"createdTime"
        });
    }

    const pageOnChange = (page,_)=>{
        setSearchParams({
            pageIndex:page-1,
            pageSize:pageSize,
            sort:sort
        });
    }

    useEffect(()=>{
        getBookWithId(bookId)
            .then(res=>{
                setBookInfo(res);
            })
    },[bookId])

    useEffect(() => {
        console.log(`pageIndex:${pageIndex},pageSize:${pageSize},sort:${sort}`);
        getBookComments(bookId,pageIndex,pageSize,sort)
            .then(res=>{
                setCommentInfo(res);
            })
            .catch(e=>{
                console.error(e);
            })
    }, [bookId, pageIndex, pageSize, sort]);

    function setPageIndex(index)
    {
        setSearchParams({
            pageIndex:pageIndex + 1,
            pageSize:pageSize,
            sort:sort
        });
    }

    return(
        <>
            {bookInfo?<BookPurchaseDiv bookInfo={bookInfo}></BookPurchaseDiv>:<Spin />}
            <Divider>评论</Divider>
            <ReplyInput
                onReply={async (text)=>{
                    await addBookComment(bookId,text);
                }}
            >
            </ReplyInput>
            <Row style={{display:"flex",width:"100%"}} justify="end">
                <Button color="primary" variant="dashed" onClick={buttonOnClick}>
                    {(sort === "createdTime")?"时间排序":"赞数排序"}
                </Button>
            </Row>
            <Row>
                {commentInfo?<CommentDiv
                    style={{width:"100%"}}
                    commentData={commentInfo}
                    setCommentData={setCommentInfo}
                />:<Spin />}
            </Row>
            {commentInfo && commentInfo.total ? (
                <Row>
                    <Pagination
                        current={pageIndex+1}
                        total={commentInfo.total * pageSize}
                        pageSize={pageSize}
                        onChange={pageOnChange}
                    />
                </Row>
            ) : null}
        </>
    )
}