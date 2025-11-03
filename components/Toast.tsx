import React from 'react';
import { CheckCircleIcon } from './icons';

interface ToastProps {
    message: string;
    isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
    return (
        <div 
            aria-live="assertive" 
            className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                className={`
                    transform transition-all duration-300 ease-in-out
                    ${isVisible ? 'translate-y-0' : 'translate-y-10'}
                    max-w-md w-full bg-slate-800 text-white shadow-lg rounded-lg pointer-events-auto flex items-center p-4
                `}
            >
                <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                <p className="font-medium text-sm">{message}</p>
            </div>
        </div>
    );
};

export default Toast;
