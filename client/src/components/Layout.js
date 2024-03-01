import React from 'react';
import Header from '../view/Header';
import Footer from '../view/Footer';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * A layout component that wraps content with optional header display.
 * @param {boolean} [props.showHeader=true] - Whether to display the header.
 * @param {React.ReactNode} props.children - The children elements to be wrapped.
 * @returns {React.ReactElement} The layout component.
 */

const Layout = ({ children, showHeader = true }) => {
    return (
        <div className="layout-container">
            {showHeader && <Header />}
            <LanguageSwitcher />
            <main className="layout-content">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;