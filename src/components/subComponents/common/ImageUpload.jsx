import React, {useState} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {Button, message, Space, Upload} from 'antd';
import {getApiUrl} from "../../../services/common";

const beforeUpload = (file) => {
    //在上传图片之前先判断图片的格式是不是jpg或者png，大小是否小于2M
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

export default function ImageUpload({onUploadSuccess,onFileRemove}){
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = async (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true); // 设置加载状态
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false); // 取消加载状态
            const response = info.file.response; // 获取服务器返回的数据
            console.log(response);
            if (response && response.ok === true) {
                message.success('Upload successful!');
                onUploadSuccess(response.filePath); // 调用上传成功后的回调
            } else {
                message.error('Upload failed!');
            }
        } else if (info.file.status === 'error') {
            setLoading(false);
            message.error('Upload failed!');
        }
    };
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Upload
                name="file"
                accept="image/*"
                className="avatar-uploader"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onRemove={onFileRemove}
                withCredentials={true}
                action={`${getApiUrl()}/books/cover`}
                listType="picture"
                maxCount={1}
            >
                <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
        </Space>
    );
}