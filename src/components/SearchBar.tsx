import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6 px-4 relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., milk, bread, eggs..."
                    className="w-full pl-5 pr-12 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-sm"
                    disabled={isLoading}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-4 bg-green-600 text-white rounded-r-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    disabled={isLoading}
                    aria-label="Search"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <SearchIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
