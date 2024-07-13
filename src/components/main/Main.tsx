import React, { useState } from 'react';
import App from "../app/App"
import style from './Main.module.scss'
import Header from '../header/Header';
import Footer from '../footer/Footer';
export const Main = () => {
	return (
        <>
        <Header title='Добро пожаловать!' text='Мини-игра сапер'/>
        <App />
        <Footer />
        </>
	);
};