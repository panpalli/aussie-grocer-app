import React, { useState } from 'react';
import { BuyListItem as BuyListItemType } from '../types';
import BuyListItem from './BuyListItem';
import { ShoppingCartIcon, ShareIcon, ClipboardIcon } from './icons';

interface BuyListProps {
    items: BuyListItemType[];
    onRemoveItem: (id: string) => void;
    onToggleTaken: (id: string) => void;
}

const BuyList: React.FC<BuyListProps> = ({ items, onRemoveItem, onToggleTaken }) => {
    const totalPrice = items.reduce((total, item) => total + (item.isTaken ? 0 : item.price), 0);
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = () => {
        if (items.length === 0) return;

        const shareableUrl = `${window.location.origin}${window.location.hash}`;

        navigator.clipboard.writeText(shareableUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy list URL:', err);
        });
    };


    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCartIcon className="w-7 h-7 text-green-600"/>
                    My Buy List
                </h2>
                <button
                    onClick={handleShare}
                    disabled={items.length === 0 || isCopied}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isCopied ? (
                        <>
                            <ClipboardIcon className="w-5 h-5"/>
                            <span>Copied!</span>
                        </>
                    ) : (
                         <>
                            <ShareIcon className="w-5 h-5"/>
                            <span>Share</span>
                        </>
                    )}
                </button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                    <ShoppingCartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Your list is empty.</p>
                    <p className="text-gray-400 text-sm">Add products from the search results!</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 -mr-2">
                        {items.map(item => (
                            <BuyListItem
                                key={item.id}
                                item={item}
                                onRemove={onRemoveItem}
                                onToggleTaken={onToggleTaken}
                            />
                        ))}
                    </div>
                    <div className="mt-6 border-t-2 border-dashed pt-4 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">Total (un-taken):</span>
                        <span className="text-3xl font-extrabold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default BuyList;
