import {Select} from "antd";
import Search from "antd/es/input/Search";

export default function BookSearch({onKeywordSearch,allTags, onTagSearch, setTag}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
        }}>
            <Search placeholder="搜索" onSearch={onKeywordSearch} size="large" style={{width: "25vw"}}/>
            <Select
                size="large"
                style={{
                    width: "8vw",
                }}
                allowClear
                options={allTags.map((tag, index) => {
                    return {
                        value: tag,
                        label: tag
                    }
                })}
                onSelect={onTagSearch}
                onClear={() => setTag("")}
                placeholder="标签"
            />
        </div>
    )
}