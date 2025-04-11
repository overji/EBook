import React from 'react';
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";
import BookPage from "../pages/BookPage";
import Error404Page from "../pages/Error404Page";

function BookPageWrapper() {
    const { id } = useParams();
    return <BookPage bookId={Number(id)} />;
}

export default function AppRoutes() {
    // 这个组件是路由的入口
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage/>} />
                <Route path="/me" element={<UserPage/>} />
                <Route path="/cart" element={<CartPage/>} />
                <Route path="/order" element={<OrderPage/>} />
                <Route path="/order" element={<OrderPage/>} />
                <Route path="/book/:id" element={<BookPageWrapper />} />
                <Route path="*" element={<Error404Page/>} />
            </Routes>
        </Router>
    );
}