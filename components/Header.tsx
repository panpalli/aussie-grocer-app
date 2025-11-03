import React from 'react';
import { ShoppingCartIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg w-full">
            <div className="container mx-auto px-4 py-5 flex items-center justify-center">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
                    <ShoppingCartIcon className="w-8 h-8"/>
                    Aussie Grocer Hunt
                </h1>
            </div>
        </header>
    );
};

export default Header;