import React from 'react';
import styles from './Header.module.scss';

type THeader = {
  title: string;
  text: string;
};

export default function Header({ title, text }: THeader) {
  return (
    <header className={styles.header}> 
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.text}>{text}</p>
    </header>
  );
}