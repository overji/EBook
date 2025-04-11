import React, {useState} from 'react';
import {LikeFilled, LikeOutlined, MessageOutlined, StarOutlined} from '@ant-design/icons';
import {Avatar, Button, List, Row, Space, Typography} from 'antd';
import {getAvatarFullUrl} from "../services/userAction";
import "../stylesheets/Comment.css"
import {likeComment, replyComment, unlikeComment} from "../services/commentAction";
import ReplyInput from "./ReplyInput";

const {Text} = Typography;
const IconText = ({icon, text, key, className, onClick}) => (
    <Space key={key} className={className} onClick={onClick}>
        {React.createElement(icon)}
        {text}
    </Space>
);


function CommentListItem({item, commentData, setCommentData,curReply,setCurReply}) {
    const [replying, setReplying] = useState(false);

    function CommentAction({className}) {
        return (
            <Space className={className}>
                <Row>
                    <IconText icon={(item.liked) ? LikeFilled : LikeOutlined}
                              text={item.like}
                              key="list-vertical-like-o"
                              className="likeIcon"
                              onClick={() => {
                                  if (item.liked) {
                                      unlikeComment(item.id)
                                          .then(() => {
                                              setCommentData({
                                                  ...commentData,
                                                  items: commentData.items.map(comment => {
                                                      if (comment.id === item.id) {
                                                          return {
                                                              ...comment,
                                                              like: comment.like - 1,
                                                              liked: false
                                                          };
                                                      }
                                                      return comment;
                                                  })
                                              });
                                          });
                                  } else {
                                      likeComment(item.id)
                                          .then(() => {
                                              setCommentData({
                                                  ...commentData,
                                                  items: commentData.items.map(comment => {
                                                      if (comment.id === item.id) {
                                                          return {
                                                              ...comment,
                                                              like: comment.like + 1,
                                                              liked: true
                                                          };
                                                      }
                                                      return comment;
                                                  })
                                              });
                                          });
                                  }
                              }}
                    />
                    <IconText
                        icon={MessageOutlined}
                        text={"回复"}
                        className="likeIcon"
                        key="list-vertical-message"
                        onClick={() => {
                            if (curReply === item.id){
                                setCurReply(null);
                            } else {
                                setCurReply(item.id);
                            }
                        }}
                    />
                </Row>
            </Space>
        )
    }

    return (
        <List.Item
            key={item.id}
            actions={[
                <CommentAction className="CommentActionRow"/>
            ]}
        >
            <List.Item.Meta
                avatar={<Avatar src={getAvatarFullUrl(item.avatar)}
                                className="defaultAvatar">{item.username[0]}</Avatar>}
                title={item.username}
                description={new Date(item.createdAt).toLocaleString()}
            />
            <Text>
                {(item.reply)?`回复 ${item.reply}: `:""}
                {item.content}
            </Text>
        </List.Item>
    )
}

export default function CommentDiv({commentData, setCommentData}) {
    console.log(JSON.stringify(commentData))
    const [curReply,setCurReply] = useState(null);
    return (
        <Row className={"CommentDivRow"}>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={commentData.items}
                style={{width:"100%"}}
                renderItem={(item) => (
                    <>
                        <CommentListItem
                            item={item}
                            commentData={commentData}
                            setCommentData={setCommentData}
                            curReply={curReply}
                            setCurReply={setCurReply}
                        />
                        {(curReply === item.id)?
                            <ReplyInput
                                textHolder={`回复 ${item.username}`}
                                className={"CommentOthersRow"}
                                onReply={async (text)=>{
                                    await replyComment(item.id,text);
                                }}
                            >
                            </ReplyInput>:<></>
                        }

                    </>
                )}
            />
        </Row>
    )
}