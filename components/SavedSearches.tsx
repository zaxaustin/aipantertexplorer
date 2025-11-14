
import React from 'react';
import type { SavedSearch } from '../types';

interface SavedSearchesProps {
    searches: SavedSearch[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    activeSearchId: string | null;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({ searches, onLoad, onDelete, activeSearchId }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-200">Previous Searches</h2>
            {searches.length === 0 ? (
                <p className="text-gray-500 text-sm">Your past searches will appear here.</p>
            ) : (
                <ul className="space-y-3 max-h-[calc(100vh-25rem)] overflow-y-auto pr-2">
                    {searches.map((search) => (
                        <li 
                            key={search.id} 
                            className={`p-3 rounded-lg transition-all duration-200 border ${activeSearchId === search.id ? 'bg-indigo-900/50 border-indigo-700' : 'bg-gray-700/50 border-transparent hover:border-gray-600'}`}
                        >
                            <p 
                                className="font-semibold text-gray-300 truncate cursor-pointer hover:text-indigo-400"
                                onClick={() => onLoad(search.id)}
                                title={search.query}
                            >
                                {search.query}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(search.timestamp).toLocaleString()}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <button 
                                    onClick={() => onLoad(search.id)}
                                    className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition-colors"
                                    aria-label={`Load search: ${search.query}`}
                                >
                                    Load
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(search.id);
                                    }}
                                    className="text-xs px-3 py-1 bg-red-800 hover:bg-red-700 rounded text-white transition-colors"
                                    aria-label={`Delete search: ${search.query}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
