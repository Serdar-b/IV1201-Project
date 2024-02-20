import React from 'react';
import Header from '../view/Header';

/**
 * A layout component that wraps content with optional header display.
 * @param {boolean} [props.showHeader=true] - Whether to display the header.
 * @param {React.ReactNode} props.children - The children elements to be wrapped.
 * @returns {React.ReactElement} The layout component.
 */

const Layout = ({ children, showHeader = true }) => {
    return (
        <div>
            {showHeader && <Header />}
            {children}
        </div>
    );
};

export default Layout;