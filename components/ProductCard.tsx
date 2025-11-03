import React from 'react';
import { Product, Store } from '../types';
import { PlusIcon } from './icons';

interface ProductCardProps {
    product: Product;
    onAddToList: (product: Product) => void;
}

const storeColors: Record<Store, { bg: string, text: string, border: string }> = {
    [Store.Coles]: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
    [Store.Woolworths]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
    [Store.ALDI]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    [Store.IGA]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToList }) => {
    const storeColor = storeColors[product.store] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' };
    const originalPrice = product.price + product.discountAmount;

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col group border-t-4 ${storeColor.border}`}>
            <div className="p-5 flex flex-col flex-grow relative">
                {product.discountAmount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        SAVE ${product.discountAmount.toFixed(2)}
                    </div>
                )}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start ${storeColor.bg} ${storeColor.text}`}>
                    {product.store}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-2 flex-grow min-h-[5rem]">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.quantity}</p>
                <div className="flex items-baseline justify-between mt-4">
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
                        {product.discountAmount > 0 && (
                             <p className="text-md font-medium text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToList(product)}
                        className="bg-green-600 text-white rounded-full p-2.5 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform group-hover:scale-110"
                        aria-label={`Add ${product.name} to buy list`}
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;