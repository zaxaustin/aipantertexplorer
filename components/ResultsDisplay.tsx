import React from 'react';
import type { ChartDataItem } from '../types';
import { KnowledgeTags } from './KnowledgeTags';
import { PatentChart } from './PatentChart';


interface ResultsDisplayProps {
    response: string;
    summary?: string | null;
    chartData?: ChartDataItem[];
    knowledgeTags?: string[];
}

// A simple utility to render markdown-like text into basic HTML
const renderMarkdownLite = (text: string) => {
    return text
        .split('\n\n') // Split by paragraphs
        .map((paragraph, pIndex) => {
            // Handle headings
            if (paragraph.startsWith('# ')) {
                return <h2 key={pIndex} className="text-3xl font-bold mt-8 mb-4 text-indigo-300">{paragraph.substring(2)}</h2>;
            }
            if (paragraph.startsWith('## ')) {
                return <h3 key={pIndex} className="text-2xl font-bold mt-6 mb-3 text-indigo-300">{paragraph.substring(3)}</h3>;
            }
            if (paragraph.startsWith('### ')) {
                return <h4 key={pIndex} className="text-xl font-bold mt-5 mb-2 text-indigo-300">{paragraph.substring(4)}</h4>;
            }

            // Handle list items
            if (paragraph.match(/^(\*|\-|\d+\.) /m)) {
                const items = paragraph.split('\n').filter(line => line.trim() !== '').map((item, i) => (
                    <li key={i} className="mb-2">{item.replace(/^(\*|\-|\d+\.) /, '')}</li>
                ));
                const listType = paragraph.startsWith('*') || paragraph.startsWith('-') ? 'ul' : 'ol';
                return React.createElement(listType, {
                    key: pIndex,
                    className: `${listType === 'ul' ? 'list-disc' : 'list-decimal'} pl-6`
                }, items);
            }
            
            // Regular paragraph
            return <p key={pIndex} className="mb-4 leading-relaxed">{paragraph}</p>;
        });
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ response, summary, chartData, knowledgeTags }) => {
    return (
        <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            {summary && (
                <div className="bg-indigo-900/30 p-4 rounded-lg mb-8 border border-indigo-700 shadow-lg">
                    <h3 className="text-xl font-bold text-indigo-300 mb-2 font-serif tracking-wider">Patent Pulse</h3>
                    <p className="text-gray-300 italic leading-relaxed">{summary}</p>
                </div>
            )}
            
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2 text-gray-200">
                Research Findings
            </h2>
            
            {knowledgeTags && knowledgeTags.length > 0 && (
                <KnowledgeTags tags={knowledgeTags} />
            )}

            <div className="prose prose-invert max-w-none text-gray-300">
              {renderMarkdownLite(response)}
            </div>

            {chartData && chartData.length > 0 && (
                <PatentChart data={chartData} />
            )}
        </section>
    );
};