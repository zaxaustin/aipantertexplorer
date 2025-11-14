
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse-fast"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse-fast [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse-fast [animation-delay:0.4s]"></div>
                <span className="ml-4 text-gray-400">Analyzing information...</span>
            </div>
        </div>
    );
};
