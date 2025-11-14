
import React from 'react';

interface ResultsDisplayProps {
    response: string;
}

// A simple utility to render markdown-like text into basic HTML
const renderMarkdownLite = (text: string) => {
    return text
        .split('\n\n') // Split by paragraphs
        .map((paragraph, pIndex) => {
            // Handle headings
            if (paragraph.startsWith('# ')) {
                return <h2 key={pIndex} className="text-2xl font-bold mt-6 mb-3 text-indigo-300">{paragraph.substring(2)}</h2>;
            }
            if (paragraph.startsWith('## ')) {
                return <h3 key={pIndex} className="text-xl font-bold mt-5 mb-2 text-indigo-300">{paragraph.substring(3)}</h3>;
            }
            if (paragraph.startsWith('### ')) {
                return <h4 key={pIndex} className="text-lg font-bold mt-4 mb-1 text-indigo-300">{paragraph.substring(4)}</h4>;
            }

            // Handle list items
            if (paragraph.match(/^(\*|\-|\d+\.) /m)) {
                const items = paragraph.split('\n').map((item, i) => (
                    <li key={i} className="mb-2">{item.replace(/^(\*|\-|\d+\.) /, '')}</li>
                ));
                const listType = paragraph.startsWith('*') || paragraph.startsWith('-') ? 'ul' : 'ol';
                // FIX: Use React.createElement for dynamic tag names to resolve JSX-related type errors.
                return React.createElement(listType, {
                    key: pIndex,
                    className: `${listType === 'ul' ? 'list-disc' : 'list-decimal'} pl-6`
                }, items);
            }
            
            // Regular paragraph
            return <p key={pIndex} className="mb-4 leading-relaxed">{paragraph}</p>;
        });
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ response }) => {
    return (
        <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2 text-gray-200">
                Research Findings
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              {renderMarkdownLite(response)}
            </div>
        </section>
    );
};
