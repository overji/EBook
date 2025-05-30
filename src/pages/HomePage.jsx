import BookPurchaseCard from "../components/subComponents/userBook/BookPurchaseCard";
import {useState, useEffect} from "react";
import {getAllTags, searchBooks} from "../services/bookActions";
import {Col, Pagination, Row, Input, Empty, Select} from "antd";
import UserLayout from "../generalUsages/UserLayout";
import "../stylesheets/Home.css"
import BookSearch from "../components/subComponents/common/BookSearch";

const {Search} = Input;

function BookTab({books, curIndex}) {
    let bookInfos = books.items;
    return (
        <div style={{backgroundColor: "white"}}>
            <Row gutter={[16, 16]}>
                {bookInfos.map((_, index) => {
                    return (
                        <Col span={6} key={index} className={"gutter-row"}>
                            <BookPurchaseCard
                                book={bookInfos[index]}
                            />
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}

export default function HomePage() {
    const [totalPages, setTotalPages] = useState(0);
    const [curIndex, setCurIndex] = useState(0);
    const [books, setBooks] = useState(null);
    const [tag, setTag] = useState("");
    const [keyword, setKeyword] = useState("");
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        async function fetchBook() {
            const bookData = await searchBooks(tag, keyword, curIndex, 8);
            setBooks(bookData);
            setTotalPages(bookData.total);
        }

        fetchBook();
    }, [curIndex, tag, keyword]);

    useEffect(() => {
        async function fetchTags() {
            const tagsData = await getAllTags();
            //如果tagsData不是列表，那么就返回空列表
            if(tagsData.status === 401){
                setAllTags([]);
                return;
            }
            setAllTags(tagsData);
        }

        fetchTags();
    }, []);

    async function onKeywordSearch(value) {
        setKeyword(value);
    }

    async function onTagSearch(value) {
        setTag(value);
    }

    return (
        <UserLayout>
            <BookSearch
                onKeywordSearch={onKeywordSearch}
                allTags={allTags}
                onTagSearch={onTagSearch}
                setTag={setTag}
            />
            {books && books.items.length > 0 ? <BookTab books={books} curIndex={curIndex}/> :
                <Empty style={{minHeight: "65vh"}}/>}
            <Pagination
                className="HomePagination"
                align="center"
                defaultCurrent={1}
                total={totalPages * 8} // Ensure total is set correctly
                onChange={(page, pageSize) => {
                    setCurIndex(page - 1);
                }}
            />
        </UserLayout>
    );
}