import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface SearchResultsProps {
    products: Product[];
    onAddToList: (product: Product) => void;
    isLoading: boolean;
    error: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, onAddToList, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg h-60 animate-pulse p-5 flex flex-col">
                        <div className="bg-gray-300 h-4 w-1/4 rounded mb-4"></div>
                        <div className="space-y-2 flex-grow">
                            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
                            <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
                        </div>
                        <div className="bg-gray-300 h-4 w-1/3 rounded mt-2"></div>
                        <div className="flex justify-between items-center pt-4 mt-4">
                            <div className="bg-gray-300 h-8 w-1/3 rounded"></div>
                            <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg"><p>Error: {error}</p></div>
    }

    if (products.length === 0) {
        return <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg"><p>No products found. Try another search!</p></div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onAddToList={onAddToList} />
            ))}
        </div>
    );
};

export default SearchResults;
