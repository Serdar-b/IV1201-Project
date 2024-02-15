import React from 'react';
import Header from '../view/Header';

const Layout = ({ children, showHeader = true }) => {
    return (
        <div>
            {showHeader && <Header />}
            {children}
        </div>
    );
};

export default Layout;