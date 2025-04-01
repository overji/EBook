import {useState} from 'react';
import {Button, Input, Row, Space, message} from 'antd';
import "../stylesheets/Reply.css"
export default function ReplyInput({textHolder="发布一条友善的评论",onReply=null,className=""}){
    const [text,setText] = useState("");
    const [messageApi,contextHolder] = message.useMessage();
    return (
        <>
            {contextHolder}
            <Row className={className}>
                <Input
                    className="inputRect"
                    autoFocus
                    placeholder={textHolder}
                    onChange={(e)=>{
                        setText(e.target.value);
                    }}
                >
                </Input>
            </Row>
            <Row justify="end" className={className}>
                <Button
                    onClick={()=>{
                        onReply(text)
                            .then(()=>{
                                setText("");
                                messageApi.success("成功发送评论");
                                window.location.reload();
                            })
                    }}
                    className="inputButton"
                    color="primary"
                    variant="solid"
                >
                    发送
                </Button>
            </Row>
        </>
    )
}