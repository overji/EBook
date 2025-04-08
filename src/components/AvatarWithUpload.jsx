import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { getApiUrl } from '../services/common';
import ImgCrop from "antd-img-crop";

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

export default function AvatarWithUpload({ onUploadSuccess }) {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const handleChange = async (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            onUploadSuccess()
        }
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    return (
        <ImgCrop rotationSlider>
            <Upload
                name="file"
                accept="image/*"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                withCredentials={true}
                action={`${getApiUrl()}/user/me/avatar`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                            width: '100%',
                        }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>
        </ImgCrop>
    );
}