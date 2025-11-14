import React, { useState, useEffect } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { AudioRecorder } from './AudioRecorder';

interface SearchFormProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
    initialQuery: string;
    setQuery: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, initialQuery, setQuery }) => {

    useEffect(() => {
        if(initialQuery !== query) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    const query = initialQuery;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleTranscription = (text: string) => {
        setQuery(query ? `${query} ${text}` : text);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'How do perpetual motion machines in patents work?' or 'prototype a simple drone'"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-300 resize-none h-28"
                disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-colors duration-300 flex-grow"
                >
                    {isLoading ? (
                        'Researching...'
                    ) : (
                        <>
                            <GoogleIcon className="w-5 h-5 mr-2" />
                            Search with Google
                        </>
                    )}
                </button>
                <AudioRecorder onTranscription={handleTranscription} disabled={isLoading} />
            </div>
        </form>
    );
};