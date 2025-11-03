import React from 'react';
import { BuyListItem as BuyListItemType, Store } from '../types';
import { TrashIcon } from './icons';

interface BuyListItemProps {
    item: BuyListItemType;
    onRemove: (id: string) => void;
    onToggleTaken: (id: string) => void;
    className?: string;
}

const storeColors: Record<Store, string> = {
    [Store.Coles]: 'border-l-red-500',
    [Store.Woolworths]: 'border-l-green-500',
    [Store.ALDI]: 'border-l-blue-500',
    [Store.IGA]: 'border-l-yellow-500',
};

const BuyListItem: React.FC<BuyListItemProps> = ({ item, onRemove, onToggleTaken, className }) => {
    const storeColor = storeColors[item.store] || 'border-l-gray-500';

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(item.id);
    };

    return (
        <div 
            className={`p-3 flex items-center justify-between border-l-4 ${storeColor} shadow-sm rounded-r-md transition-all duration-300 cursor-pointer ${item.isTaken ? 'bg-slate-600' : 'bg-white'} ${className}`}
            onClick={() => onToggleTaken(item.id)}
        >
            <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${item.isTaken ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                <div className={`flex items-center text-sm mt-1 space-x-3 flex-wrap ${item.isTaken ? 'text-slate-300' : 'text-gray-500'}`}>
                    <span>{item.store}</span>
                    <span>&bull;</span>
                    <span>{item.quantity}</span>
                    {item.discountAmount > 0 && !item.isTaken &&
                        <span className="text-red-600 font-bold">(Save ${item.discountAmount.toFixed(2)})</span>
                    }
                </div>
            </div>
            <div className="flex items-center space-x-4 ml-2">
                {item.isTaken && <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">TAKEN</span>}
                 <p className={`font-bold ${item.isTaken ? 'text-white' : 'text-gray-900'}`}>{item.price.toFixed(2)}</p>
                <button 
                    onClick={handleRemoveClick}
                    className={`transition-colors z-10 ${item.isTaken ? 'text-slate-300 hover:text-white' : 'text-gray-400 hover:text-red-600'}`}
                    aria-label={`Remove ${item.name} from buy list`}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default BuyListItem;
