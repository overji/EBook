import { Navigate } from "react-router-dom";
import BookPurchaseCard from "../components/BookPurchaseCard";
import { useState, useEffect } from "react";
import { getBookWithId, searchBooks } from "../services/getBooks";
import { Col, Pagination, Row } from "antd";
import {BasicLayout, UserLayout} from "../generalUsages/Layout";
import "../stylesheets/Home.css"
import {getAvatarByFileName, getMe} from "../services/userAction";

function BookTab({ books, curIndex }) {
    let bookInfos = books.items;
    return (
        <div style={{backgroundColor:"white"}}>
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
    let userName = sessionStorage.getItem("user");
    const [totalPages, setTotalPages] = useState(0);
    const [curIndex, setCurIndex] = useState(0);
    const [books, setBooks] = useState(null);
    const [tag, setTag] = useState("");
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        async function fetchBook() {
            const bookData = await searchBooks(tag, keyword, curIndex, 8);
            setBooks(bookData);
            setTotalPages(bookData.total);
        }
        fetchBook();
    }, [curIndex, tag, keyword]);

    if (userName === null) {
        return <Navigate to={"/login"} state={{ loginStatus: "UnLoggedIn" }} />;
    }

    return (
        <UserLayout>
            <button onClick={async ()=>{
                let res = await getMe();
                console.log(res);
            }}>看我</button>
            {books && <BookTab books={books} curIndex={curIndex} />}
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