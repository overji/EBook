import React from 'react';
import {BrowserRouter as Router, Route, Routes, useParams ,createBrowserRouter,RouterProvider} from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";
import BookPage from "../pages/BookPage";
import Error404Page from "../pages/Error404Page";
import AdminBookPage from "../pages/AdminBookPage";


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
                {/*当用户访问类似 /book/123 的路径时，:id 会捕获 123 作为参数*/}
                {/*在组件中可以通过 useParams 钩子获取这个参数的值*/}
                <Route path="/book/:id" element={<BookPageWrapper />} />
                <Route path="*" element={<Error404Page/>} />
                <Route path="/admin" element={<AdminBookPage/>}/>
            </Routes>
        </Router>
    );
}