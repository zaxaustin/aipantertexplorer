
import React from 'react';
import type { Source } from '../types';

interface SourcesProps {
    sources: Source[];
}

export const Sources: React.FC<SourcesProps> = ({ sources }) => {
    if (sources.length === 0) {
        return null;
    }

    return (
        <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-200">
                Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((source, index) => (
                    <a
                        key={index}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                    >
                        <p className="font-semibold text-indigo-400 truncate">{source.title}</p>
                        <p className="text-sm text-gray-400 truncate">{source.uri}</p>
                    </a>
                ))}
            </div>
        </section>
    );
};
