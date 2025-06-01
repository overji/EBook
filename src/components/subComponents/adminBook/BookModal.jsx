import React, {useEffect, useState} from 'react';
import {Modal, Button, Form, Input, Select, message, InputNumber, Row, Col} from 'antd';
import ImageUpload from "../common/ImageUpload";
import {getApiUrl} from "../../../services/common";
import {addBook, deleteCoverWithURL, updateBook} from "../../../services/bookActions";

export default function BookModal({books = null, setBooks = null, curModifyingBook = null}) {
    const bookRecord = curModifyingBook ? curModifyingBook : null;
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [inputDisabled, setInputDisabled] = useState(false);
    const [imageURL, setImageURL] = useState(bookRecord ? bookRecord.cover : "");
    const [curYuan, setCurYuan] = useState(bookRecord ? Math.floor(bookRecord.price / 100) : 0);
    const [curJiao, setCurJiao] = useState(bookRecord ? Math.floor((bookRecord.price % 100) / 10) : 0);
    const [curFen, setCurFen] = useState(bookRecord ? bookRecord.price % 10 : 0);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const {title, author, description, tags, ISBN, stock} = values;
            let price = curYuan * 100 + curJiao * 10 + curFen;
            if (bookRecord === null) {
                addBook(title, author, description, price, imageURL, tags, ISBN, stock).then(res => {
                    if (res.ok) {
                        messageApi.success("书籍添加成功");
                        setOpen(false);
                        form.resetFields();
                        setImageURL("");
                        setInputDisabled(false);
                        // 更新books中的书籍信息
                        let len = books.items.length;
                        setBooks({
                            ...books,
                            items:[
                                ...books.items,
                                {
                                    id: res.id,
                                    title: title,
                                    author: author,
                                    description: description,
                                    price: price,
                                    cover: imageURL,
                                    sales: 0,
                                    tags: tags.map((tag, index) => ({
                                        name: tag,
                                        id: index + 1
                                    })),
                                    isbn: ISBN,
                                    stock: stock
                                }
                            ]
                        }
                    )
                    } else {
                        messageApi.error("书籍添加失败");
                    }
                }).catch(err => {
                    console.error(err);
                    messageApi.error("发生错误，书籍添加失败");
                });
            } else {
                updateBook(bookRecord.id, title, author, description, price, imageURL, tags, ISBN, stock).then(res => {
                    if (res.ok) {
                        messageApi.success("书籍修改成功");
                        setOpen(false);
                        setInputDisabled(false);
                        // 更新books中的书籍信息
                        setBooks(
                            {
                                ...books,
                                items: books.items.map(book => {
                                    if (book.id === bookRecord.id) {
                                        return {
                                            id: book.id,
                                            sales: book.sales,
                                            title: title,
                                            author: author,
                                            description: description,
                                            price: price,
                                            cover: imageURL,
                                            tags: tags.map((tag, index) => ({
                                                name: tag,
                                                id: index + 1
                                            })),
                                            isbn: ISBN,
                                            stock: stock
                                        };
                                    } else {
                                        return book;
                                    }
                                })
                            }
                        );
                    } else {
                        messageApi.error("书籍添加失败");
                    }
                }).catch(err => {
                    console.error(err);
                    messageApi.error("发生错误，书籍添加失败");
                });
            }
        }).catch(() => {
            messageApi.error("表单验证失败，请检查输入");
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (bookRecord !== null) {
            setImageURL(bookRecord.cover);
            setCurYuan(Math.floor(bookRecord.price / 100));
            setCurJiao(Math.floor((bookRecord.price % 100) / 10));
            setCurFen(bookRecord.price % 10);
        }
    }, [bookRecord])

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={showModal} style={{marginTop: "3px"}}>
                {bookRecord ? "修改" : "添加书籍"}
            </Button>
            <Modal title="选择收货人" open={open} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    initialValues={{
                        title: bookRecord ? bookRecord.title : '',
                        author: bookRecord ? bookRecord.author : '',
                        description: bookRecord ? bookRecord.description : '',
                        ISBN: bookRecord ? bookRecord.isbn : '',
                        stock: bookRecord ? bookRecord.stock : 0,
                        tags: bookRecord ? bookRecord.tags.map((value) => value.name) : []
                    }}
                    autoComplete="on"
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{required: true, message: '请输入标题!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="书籍封面"
                        name="cover"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!value && !imageURL) {
                                        return Promise.reject(new Error('请上传封面或输入图片URL!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <ImageUpload
                            onUploadSuccess={(url) => {
                                setImageURL(`${getApiUrl()}/${url}`);
                                setInputDisabled(true);
                            }}
                            onFileRemove={() => {
                                deleteCoverWithURL(imageURL).then((res) => {
                                    if (res.ok) {
                                        messageApi.success("删除成功");
                                    } else {
                                        messageApi.error("删除失败");
                                    }
                                });
                                setImageURL("");
                                setInputDisabled(false);
                            }}
                        />
                        <Input
                            placeholder="在这里填入URL"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)} // 同步用户输入
                            disabled={inputDisabled}
                        />
                    </Form.Item>
                    <Form.Item
                        label="作者"
                        name="author"
                        rules={[{required: true, message: '请输入作者!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="description"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value && value.length > 500) {
                                        return Promise.reject(new Error('描述过长!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input.TextArea
                            style={{minHeight: "100px"}}
                            defaultValue={bookRecord ? bookRecord.description : ''}
                        />
                    </Form.Item>
                    <Form.Item
                        label="ISBN"
                        name="ISBN"
                        rules={[{required: true, message: '请输入ISBN!'}]}
                    >
                        <Input
                            placeholder="请输入ISBN"
                        />
                    </Form.Item>
                    <Form.Item
                        label="价格"
                        name="price"
                        rules={[
                            {
                                validator: (_) => {
                                    if (
                                        curYuan === null || curYuan === undefined ||
                                        curJiao === null || curJiao === undefined ||
                                        curFen === null || curFen === undefined) {
                                        return Promise.reject(new Error('请输入价格!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Row>
                            <Col span={12}>
                                <InputNumber
                                    suffix="元"
                                    style={{width: '80%'}}
                                    min={0}
                                    onChange={(value) => {
                                        setCurYuan(value);
                                    }}
                                    defaultValue={0}
                                />
                            </Col>
                            <Col span={4} offset={2}>
                                <InputNumber
                                    suffix="角"
                                    style={{width: '100%'}}
                                    min={0}
                                    max={9}
                                    defaultValue={0}
                                    onChange={(value) => {
                                        setCurJiao(value);
                                    }}
                                />
                            </Col>
                            <Col span={4} offset={2}>
                                <InputNumber
                                    suffix="分"
                                    style={{width: '100%'}}
                                    min={0}
                                    max={9}
                                    defaultValue={0}
                                    onChange={(value) => {
                                        setCurFen(value);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label="库存"
                        name="stock"
                        rules={[{required: true, message: '请输入库存!'}]}
                    >
                        <InputNumber
                            min={0}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item
                        label="标签"
                        name="tags"
                        rules={[{required: true, message: '请输入标签!'}]}
                    >
                        <Select
                            mode="tags"
                            style={{width: '100%'}}
                            placeholder="请输入标签"
                            tokenSeparators={[',']}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}